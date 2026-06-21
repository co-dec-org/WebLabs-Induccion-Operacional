import React, { useEffect, useState } from 'react';
import { getPageContent, listSitePages, getLatestDraft, saveDraft, publishPage, listPageVersions, restoreVersion } from '../lib/dmtApi.js';
import { BlockRenderer } from '../components/blocks.jsx';

export function AdminAccountsPage() {
  return (
    <section className="page-grid">
      <article className="hero-panel">
        <p className="section-label">Admin · Cuentas</p>
        <h3>Administración de accesos</h3>
        <p>
          Módulo reservado para enrolamiento, actualización de perfiles y solicitudes de reset
          de acceso institucional.
        </p>
      </article>
      <article className="status-card">
        <span>Perfiles V1</span>
        <strong>Admin · Supervisor · Operador</strong>
        <p>Los permisos se aplican mediante Supabase Auth, perfiles y RLS.</p>
      </article>
      <article className="status-card">
        <span>Reset de acceso</span>
        <strong>Requiere flujo seguro</strong>
        <p>
          No se debe exponer `service_role` en el frontend. El reset debe ejecutarse desde
          Supabase Dashboard o desde una función backend protegida.
        </p>
      </article>
      <article className="status-card">
        <span>Dato mínimo</span>
        <strong>Correo institucional y rol</strong>
        <p>No registrar datos reales de víctimas, PSC, causas, folios ni ubicaciones.</p>
      </article>
    </section>
  );
}

// ---- Editor Visual: panel de edición de bloques (admin) ----
const TEXT_FIELDS = [
  { key: 'eyebrow', label: 'Etiqueta' },
  { key: 'title', label: 'Título' },
  { key: 'subtitle', label: 'Subtítulo' },
  { key: 'body', label: 'Texto' },
];

const BLOCK_TYPES = [
  { value: 'hero', label: 'Portada (Hero)' },
  { value: 'titulo', label: 'Título' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'acordeon', label: 'Acordeón' },
  { value: 'cta', label: 'Llamado a acción (CTA)' },
];

function newId() {
  return (globalThis.crypto && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'tmp-' + Math.random().toString(36).slice(2);
}

function normalizeBlocks(list) {
  return (list || []).map((b, i) => ({
    id: b.id || newId(),
    block_type: b.block_type || 'hero',
    position: i,
    is_visible: b.is_visible !== false,
    props: b.props || {},
  }));
}

export function AdminContentPage({ user }) {
  const [pages, setPages] = useState([]);
  const [pageId, setPageId] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState('Cargando…');
  const [saving, setSaving] = useState(false);
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    let alive = true;
    listSitePages().then((ps) => {
      if (!alive) return;
      setPages(ps);
      if (ps.length) setPageId(ps[0].id);
      setStatus(ps.length ? '' : 'No hay páginas. Aplica el seed del editor en Supabase.');
    });
    return () => { alive = false; };
  }, []);

  const currentPage = pages.find((p) => p.id === pageId) || null;

  useEffect(() => {
    if (!currentPage) return;
    let alive = true;
    setPreview(false);
    setStatus('Cargando contenido…');
    (async () => {
      const draft = await getLatestDraft(currentPage.id);
      if (!alive) return;
      if (draft && draft.data && draft.data.blocks) {
        setBlocks(normalizeBlocks(draft.data.blocks));
        setStatus('Borrador en edición (cambios sin publicar).');
        return;
      }
      const content = await getPageContent(currentPage.page_key);
      if (!alive) return;
      setBlocks(normalizeBlocks(content && content.blocks));
      setStatus('Mostrando contenido publicado (aún sin borrador).');
    })();
    return () => { alive = false; };
  }, [pageId]);

  useEffect(() => {
    if (!currentPage) { setVersions([]); return; }
    let alive = true;
    listPageVersions(currentPage.id).then((vs) => { if (alive) setVersions(vs); });
    return () => { alive = false; };
  }, [pageId]);

  async function reloadVersions() {
    if (currentPage) setVersions(await listPageVersions(currentPage.id));
  }

  async function handlePublish() {
    if (!currentPage) return;
    if (!window.confirm('Publicar reemplazará el contenido VISIBLE de esta página por estos bloques. ¿Continuar?')) return;
    setSaving(true); setStatus('Publicando…');
    const res = await publishPage(currentPage.id, blocks);
    setSaving(false);
    if (res.ok) { setStatus('Publicado ✓ — ahora es la versión viva de la página.'); reloadVersions(); }
    else setStatus('No se pudo publicar: ' + (res.error || ''));
  }

  async function handleRestore(v) {
    if (!currentPage) return;
    if (!window.confirm('¿Restaurar la versión ' + v.version_number + ' como contenido vivo?')) return;
    setStatus('Restaurando…');
    const res = await restoreVersion(v.id);
    if (res.ok) {
      const c = await getPageContent(currentPage.page_key);
      setBlocks(normalizeBlocks(c && c.blocks));
      setStatus('Versión ' + v.version_number + ' restaurada ✓');
      reloadVersions();
    } else setStatus('No se pudo restaurar: ' + (res.error || ''));
  }

  function setProp(idx, key, value) {
    setBlocks((bs) => bs.map((b, i) => (i === idx ? { ...b, props: { ...b.props, [key]: value } } : b)));
  }
  function setType(idx, value) {
    setBlocks((bs) => bs.map((b, i) => (i === idx ? { ...b, block_type: value } : b)));
  }
  function toggleVisible(idx) {
    setBlocks((bs) => bs.map((b, i) => (i === idx ? { ...b, is_visible: !b.is_visible } : b)));
  }
  function move(idx, dir) {
    setBlocks((bs) => {
      const j = idx + dir;
      if (j < 0 || j >= bs.length) return bs;
      const copy = bs.slice();
      const t = copy[idx]; copy[idx] = copy[j]; copy[j] = t;
      return copy.map((b, i) => ({ ...b, position: i }));
    });
  }
  function addBlock() {
    setBlocks((bs) => [...bs, { id: newId(), block_type: 'hero', position: bs.length, is_visible: true, props: { title: 'Nuevo bloque' } }]);
  }
  function removeBlock(idx) {
    setBlocks((bs) => bs.filter((_, i) => i !== idx).map((b, i) => ({ ...b, position: i })));
  }

  async function handleSave() {
    if (!currentPage) return;
    setSaving(true);
    setStatus('Guardando borrador…');
    const res = await saveDraft({ pageId: currentPage.id, userId: user && user.id, blocks });
    setSaving(false);
    setStatus(res.ok ? 'Borrador guardado ✓ (no afecta la web publicada).' : 'No se pudo guardar: ' + (res.error || ''));
  }

  const box = { border: '1px solid var(--line)', borderRadius: 12, padding: 16, marginBottom: 12, background: 'var(--paper)' };
  const row = { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' };
  const input = { width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--surface)' };

  return (
    <section className="page-grid">
      <article className="hero-panel">
        <p className="section-label">Admin · Editor Visual</p>
        <h3>Editor de contenido por página</h3>
        <p>
          Edita bloques, textos, orden y visibilidad. Los cambios se guardan como <strong>borrador</strong> y
          no afectan la web publicada hasta que se publiquen (próxima fase).
        </p>
        <div style={{ ...row, marginTop: 12 }}>
          <label>
            Página:&nbsp;
            <select value={pageId} onChange={(e) => setPageId(e.target.value)} style={{ padding: '6px 8px' }}>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>{p.title} ({p.route})</option>
              ))}
            </select>
          </label>
          <button onClick={handleSave} disabled={saving || !currentPage}>Guardar borrador</button>
          <button onClick={handlePublish} disabled={saving || !currentPage}>Publicar</button>
          <button className="ghost-button" onClick={() => setPreview((v) => !v)}>
            {preview ? 'Volver a editar' : 'Vista previa'}
          </button>
          <button className="ghost-button" onClick={addBlock} disabled={preview}>+ Agregar bloque</button>
        </div>
        {status ? <p className="form-status" style={{ marginTop: 10 }}>{status}</p> : null}
      </article>

      {preview ? (
        <BlockRenderer blocks={blocks.filter((b) => b.is_visible !== false)} />
      ) : (
        <div>
          {blocks.length === 0 ? (
            <article className="status-card"><p>Esta página no tiene bloques. Usa “+ Agregar bloque”.</p></article>
          ) : (
            blocks.map((b, idx) => (
              <div key={b.id} style={box}>
                <div style={{ ...row, justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <strong>#{idx + 1}</strong>
                    <select value={b.block_type} onChange={(e) => setType(idx, e.target.value)} style={{ padding: '4px 6px' }}>
                      {BLOCK_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </span>
                  <span style={row}>
                    <button className="ghost-button" onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                    <button className="ghost-button" onClick={() => move(idx, 1)} disabled={idx === blocks.length - 1}>↓</button>
                    <label style={{ ...row, gap: 4 }}>
                      <input type="checkbox" checked={b.is_visible} onChange={() => toggleVisible(idx)} /> visible
                    </label>
                    <button className="ghost-button" onClick={() => removeBlock(idx)}>Eliminar</button>
                  </span>
                </div>
                {TEXT_FIELDS.map((f) => (
                  <label key={f.key} style={{ display: 'block', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>{f.label}</span>
                    {f.key === 'body' ? (
                      <textarea rows={3} style={input} value={b.props[f.key] || ''} onChange={(e) => setProp(idx, f.key, e.target.value)} />
                    ) : (
                      <input style={input} value={b.props[f.key] || ''} onChange={(e) => setProp(idx, f.key, e.target.value)} />
                    )}
                  </label>
                ))}
                {b.block_type === 'cta' ? (
                  <label style={{ display: 'block', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>Texto del botón</span>
                    <input style={input} value={b.props.buttonLabel || ''} onChange={(e) => setProp(idx, 'buttonLabel', e.target.value)} />
                  </label>
                ) : null}
              </div>
            ))
          )}
        </div>
      )}

      <article className="status-card">
        <span>Historial de versiones</span>
        {versions.length === 0 ? (
          <p>Sin versiones publicadas aún.</p>
        ) : (
          <div>
            {versions.map((v) => (
              <div key={v.id} style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line)' }}>
                <span>Versión {v.version_number} · {new Date(v.published_at).toLocaleString()}</span>
                <button className="ghost-button" onClick={() => handleRestore(v)}>Restaurar</button>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
