import { supabase } from './supabaseClient.js';

const LOCAL_NOTES_KEY = 'dmt-contextual-notes';
const LOCAL_USER_KEY = 'dmt-demo-user';

function readLocalNotes() {
  const raw = localStorage.getItem(LOCAL_NOTES_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(LOCAL_NOTES_KEY);
    return [];
  }
}

function writeLocalNotes(notes) {
  localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(notes));
}

export async function getCurrentSession() {
  if (!supabase) {
    const localUser = localStorage.getItem(LOCAL_USER_KEY);
    if (!localUser) return null;

    try {
      return { user: JSON.parse(localUser) };
    } catch {
      localStorage.removeItem(LOCAL_USER_KEY);
      return null;
    }
  }

  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signInWithInstitutionalEmail(email, password) {
  if (!supabase) {
    const user = {
      id: 'local-demo-user',
      email,
      user_metadata: { full_name: 'Juan Gonzalez Tapia' },
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    return { user };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.session;
}

export async function signOut() {
  localStorage.removeItem(LOCAL_USER_KEY);
  if (supabase) await supabase.auth.signOut();
}

export async function updateInitialPassword(newPassword) {
  if (!supabase) {
    return { ok: true };
  }

  const { error: passwordError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (passwordError) throw passwordError;

  const { error: profileError } = await supabase.rpc('complete_initial_password_change');

  if (profileError) throw profileError;
  return { ok: true };
}

export async function getProfile(userId) {
  if (!supabase || !userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function saveVisualPreference({ userId, deviceType, visualMode }) {
  localStorage.setItem(`dmt-visual-mode-${deviceType}`, visualMode);

  if (!supabase || !userId) return null;

  const { data, error } = await supabase
    .from('user_visual_preferences')
    .upsert(
      {
        user_id: userId,
        device_type: deviceType,
        visual_mode: visualMode,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,device_type' },
    )
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listContextualNotes(userId) {
  if (!supabase || !userId) return readLocalNotes();

  const { data, error } = await supabase
    .from('contextual_notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function saveContextualNote({
  userId,
  page,
  contextLabel,
  note,
  evidenceType,
}) {
  const payload = {
    id: crypto.randomUUID(),
    user_id: userId || 'local-demo-user',
    page,
    context_label: contextLabel,
    note,
    evidence_type: evidenceType,
    created_at: new Date().toISOString(),
  };

  if (!supabase || !userId) {
    const notes = [payload, ...readLocalNotes()];
    writeLocalNotes(notes);
    return payload;
  }

  const { data, error } = await supabase
    .from('contextual_notes')
    .insert({
      user_id: userId,
      page,
      context_label: contextLabel,
      note,
      evidence_type: evidenceType,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}


export async function getPageContent(pageKey) {
  // Devuelve { page, blocks } o null. Nunca lanza: ante cualquier problema
  // retorna null para que la UI use su fallback (el código actual).
  if (!supabase || !pageKey) return null;
  try {
    const { data: page, error: pageError } = await supabase
      .from('site_pages')
      .select('id, page_key, route, title, status, default_theme')
      .eq('page_key', pageKey)
      .maybeSingle();
    if (pageError || !page) return null;

    const { data: blocks, error: blocksError } = await supabase
      .from('page_blocks')
      .select('id, block_type, position, props, is_visible, parent_block_id')
      .eq('page_id', page.id)
      .order('position', { ascending: true });
    if (blocksError) return null;

    return { page, blocks: blocks || [] };
  } catch {
    return null;
  }
}


export async function listSitePages() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('site_pages')
    .select('id, page_key, route, title, status, sort_order')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getLatestDraft(pageId) {
  if (!supabase || !pageId) return null;
  const { data, error } = await supabase
    .from('editor_drafts')
    .select('id, data, updated_at')
    .eq('page_id', pageId)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function saveDraft({ pageId, userId, blocks, label }) {
  if (!supabase || !pageId) return { ok: false, error: 'sin-conexion' };
  // Desactiva borradores anteriores y crea uno nuevo activo (historial simple).
  await supabase.from('editor_drafts').update({ is_active: false }).eq('page_id', pageId);
  const { data, error } = await supabase
    .from('editor_drafts')
    .insert({
      page_id: pageId,
      author_id: userId || null,
      label: label || null,
      data: { blocks },
      is_active: true,
    })
    .select('id')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data?.id };
}
