// navStats.js — Capa de lectura de la telemetría de navegación (nav_traces).
//
// Provee los 4 indicadores Constelar a partir de la tabla `nav_traces` y su vista
// agregada `nav_traces_summary` (ver supabase/014_nav_analytics.sql).
// Solo lectura; RLS permite consultar a supervisor/admin. Si Supabase no está
// configurado, devuelve estructuras vacías (las visualizaciones usan su fallback).

import { supabase } from './supabaseClient.js';

/**
 * Estadísticas por página desde la vista agregada.
 * @returns {Promise<Array<{route:string,pageKey:string|null,visitas:number,sesiones:number,tiempoMedioS:number|null,indiceAD:number|null}>>}
 */
export async function getResumenPaginas() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('nav_traces_summary')
    .select('route, page_key, visitas, sesiones, duracion_media_ms')
    .order('visitas', { ascending: false });
  if (error || !data) return [];
  return data.map((r) => {
    const visitas = Number(r.visitas) || 0;
    const tiempoMedioS =
      r.duracion_media_ms != null ? Math.round(Number(r.duracion_media_ms) / 1000) : null;
    // Índice compuesto aD_ = visitas × tiempo(s) / 100 (misma escala que el mockup).
    const indiceAD = tiempoMedioS != null ? Math.round((visitas * tiempoMedioS) / 100) : null;
    return { route: r.route, pageKey: r.page_key, visitas, sesiones: Number(r.sesiones) || 0, tiempoMedioS, indiceAD };
  });
}

/**
 * Totales para las tarjetas del Tablero Constelar.
 * @returns {Promise<{visitas:number,tiempoMedioS:number|null,indiceTotal:number,paginas:Array}>}
 */
export async function getResumenTablero() {
  const paginas = await getResumenPaginas();
  const visitas = paginas.reduce((s, p) => s + p.visitas, 0);
  const conTiempo = paginas.filter((p) => p.tiempoMedioS != null);
  const tiempoMedioS = conTiempo.length
    ? Math.round(conTiempo.reduce((s, p) => s + p.tiempoMedioS, 0) / conTiempo.length)
    : null;
  const indiceTotal = paginas.reduce((s, p) => s + (p.indiceAD || 0), 0);
  return { visitas, tiempoMedioS, indiceTotal, paginas };
}

/**
 * Recorridos: transiciones referrer_route -> route, agregadas en cliente sobre
 * las trazas recientes (suficiente para el laboratorio; para volumen alto conviene
 * una vista/RPC dedicada en Supabase).
 * @returns {Promise<Array<{desde:string,hacia:string,veces:number}>>}
 */
export async function getTransiciones(opts) {
  if (!supabase) return [];
  const limit = (opts && opts.limit) || 2000;
  const { data, error } = await supabase
    .from('nav_traces')
    .select('referrer_route, route')
    .eq('event_type', 'view')
    .not('referrer_route', 'is', null)
    .order('occurred_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  const counts = new Map();
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const key = row.referrer_route + '|' + row.route;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const out = [];
  counts.forEach((veces, key) => {
    const parts = key.split('|');
    out.push({ desde: parts[0], hacia: parts[1], veces });
  });
  out.sort((a, b) => b.veces - a.veces);
  return out;
}
