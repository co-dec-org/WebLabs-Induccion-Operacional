// navTrace.js — Telemetría de navegación ANÓNIMA (Ley 21.719: sin datos personales).
//
// Registra el recorrido de navegación en la tabla `nav_traces` de Supabase:
//   - 'view'  al entrar a una ruta (con la ruta previa = referrer).
//   - 'leave' al salir de una ruta (con la duración en ms).
//
// Privacidad por diseño:
//   - `anon_session` es un identificador ALEATORIO por pestaña (sessionStorage),
//     NO ligado a la identidad y descartado al cerrar la pestaña. No hay
//     seguimiento longitudinal de la persona.
//   - No se envía nombre, correo, UUID de usuario ni IP. Solo ruta, tiempo y
//     contexto técnico (dispositivo, tema y rol agregado).
//   - La telemetría es "best-effort": NUNCA debe romper ni bloquear la interfaz.

import { supabase } from './supabaseClient.js';
import { getPageKeyFromPath } from '../app/system-map/systemMap.js';

const SESSION_KEY = 'dmt-anon-session';

function randomId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 's-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

// Identificador de sesión anónimo, por pestaña, no persistente entre sesiones.
function getAnonSession() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = randomId();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Si sessionStorage no está disponible, sesión efímera en memoria.
    return randomId();
  }
}

function safePageKey(route) {
  try {
    return getPageKeyFromPath(route) || null;
  } catch {
    return null;
  }
}

// Inserción silenciosa: cualquier error se ignora para no afectar la UI.
function insertTrace(row) {
  if (!supabase) return;
  try {
    const result = supabase.from('nav_traces').insert(row);
    if (result && typeof result.then === 'function') {
      result.then(
        () => {},
        () => {},
      );
    }
  } catch {
    /* no-op: la telemetría nunca debe propagar errores */
  }
}

/**
 * Registra la entrada a una ruta.
 * @param {{route:string, referrerRoute?:string|null, deviceType?:string, theme?:string, role?:string}} p
 */
export function trackView(p) {
  if (!p || !p.route) return;
  insertTrace({
    anon_session: getAnonSession(),
    route: p.route,
    page_key: safePageKey(p.route),
    event_type: 'view',
    referrer_route: p.referrerRoute || null,
    device_type: p.deviceType || null,
    theme: p.theme || null,
    role: p.role || null,
  });
}

/**
 * Registra la salida de una ruta, con la duración de permanencia.
 * @param {{route:string, durationMs?:number, deviceType?:string, theme?:string, role?:string}} p
 */
export function trackLeave(p) {
  if (!p || !p.route) return;
  insertTrace({
    anon_session: getAnonSession(),
    route: p.route,
    page_key: safePageKey(p.route),
    event_type: 'leave',
    duration_ms: p.durationMs != null ? Math.max(0, Math.round(p.durationMs)) : null,
    referrer_route: null,
    device_type: p.deviceType || null,
    theme: p.theme || null,
    role: p.role || null,
  });
}
