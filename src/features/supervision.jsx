import React, { useEffect, useRef, useState } from 'react';
import { getResumenTablero, getTransiciones } from '../lib/navStats.js';

// =====================================================================
// SupervisionPage — Tablero Constelar (analítica de navegación anónima).
// Solo supervisor/admin (la RLS de nav_traces ya lo restringe). Lee datos
// reales vía navStats; si aún no hay datos, usa una muestra de respaldo.
// =====================================================================

const PAGES = [
  { key: 'inicio', name: 'Inicio', route: '/home' },
  { key: 'induccion', name: 'Inducción', route: '/induccion' },
  { key: 'bitacora', name: 'Bitácora', route: '/bitacora' },
  { key: 'marco_legal', name: 'Marco legal', route: '/marco-legal' },
  { key: 'recursos', name: 'Recursos', route: '/recursos' },
  { key: 'perfil', name: 'Perfil', route: '/perfil' },
];
const ROUTE_TO_KEY = PAGES.reduce((m, p) => { m[p.route] = p.key; return m; }, {});
const SPINE = [
  ['inicio', 'induccion'], ['induccion', 'bitacora'], ['bitacora', 'marco_legal'],
  ['marco_legal', 'recursos'], ['recursos', 'perfil'],
];
const SAMPLE = {
  inicio: { v: 320, t: 22 }, induccion: { v: 210, t: 95 }, bitacora: { v: 140, t: 60 },
  marco_legal: { v: 90, t: 70 }, recursos: { v: 110, t: 45 }, perfil: { v: 70, t: 30 },
};
const SAMPLE_TR = [
  { d: 'inicio', h: 'induccion', w: 180 }, { d: 'inicio', h: 'marco_legal', w: 70 },
  { d: 'inicio', h: 'recursos', w: 80 }, { d: 'induccion', h: 'bitacora', w: 95 },
  { d: 'induccion', h: 'perfil', w: 40 }, { d: 'bitacora', h: 'marco_legal', w: 75 },
  { d: 'marco_legal', h: 'recursos', w: 35 }, { d: 'recursos', h: 'perfil', w: 28 },
];

const G = ['#f2fff9', '#c8f5e6', '#9fe1cb', '#5dcaa5', '#2aa37c', '#0f6e56'];
const ACCENTS = {
  boldo: { core: '#eafff7', line: '159,225,203', star: '#d6f3e8' },
  ambar: { core: '#f6c270', line: '201,150,53', star: '#ffdf9e' },
};
const DEV = '#e8795a';
const PANEL = '#00120b';

function hexA(h, a) { h = h.replace('#', ''); const n = parseInt(h, 16); return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
function rnd() { return Math.random(); }
function gau() { return rnd() + rnd() + rnd() - 1.5; }
function makeSprite(c) { const s = document.createElement('canvas'); s.width = s.height = 64; const g = s.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, hexA(c, 1)); gr.addColorStop(0.25, hexA(c, 0.5)); gr.addColorStop(0.6, hexA(c, 0.13)); gr.addColorStop(1, hexA(c, 0)); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return s; }
function makeDiff(c) { const s = document.createElement('canvas'); s.width = s.height = 96; const g = s.getContext('2d'); const gr = g.createRadialGradient(48, 48, 0, 48, 48, 48); gr.addColorStop(0, hexA(c, 0.4)); gr.addColorStop(0.45, hexA(c, 0.14)); gr.addColorStop(1, hexA(c, 0)); g.fillStyle = gr; g.fillRect(0, 0, 96, 96); return s; }
function tf(x, y, z, yaw, pitch, K, W, H) { const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch); const X = x * cy + z * sy, Z = -x * sy + z * cy, Y = y; const Y2 = Y * cp - Z * sp, Z2 = Y * sp + Z * cp; let ze = 4.6 - Z2; if (ze < 0.2) ze = 0.2; const s = 2.4 / ze; return { sx: W / 2 + X * s * K, sy: H / 2 - Y2 * s * K, s, ze }; }
function mkDeep(n) { const a = []; for (let i = 0; i < n; i++) { const u = rnd() * 6.283, b = Math.acos(2 * rnd() - 1), r = 3.5 + rnd() * 3; a.push({ x: r * Math.sin(b) * Math.cos(u), y: r * Math.sin(b) * Math.sin(u) * 0.8, z: r * Math.cos(b), r: 0.5 + rnd(), a: 0.05 + rnd() * 0.05, sx: 0.7 + rnd() * 0.6, sy: 0.3 + rnd() * 0.4, rot: rnd() * 6.283, tw: rnd() * 6.283, fr: 0.0002 + rnd() * 0.0002 }); } return a; }
function mkStars(n) { const a = []; for (let i = 0; i < n; i++) { const u = rnd() * 6.283, b = Math.acos(2 * rnd() - 1), r = 3 + rnd() * 3; a.push({ x: r * Math.sin(b) * Math.cos(u), y: r * Math.sin(b) * Math.sin(u), z: r * Math.cos(b), r: 0.3 + rnd() * 0.7, tw: rnd() * 6.283, dim: rnd() < 0.6 }); } return a; }

function buildSprites(AC) {
  const spr = {}; G.forEach((c, i) => { spr[i] = makeSprite(c); });
  spr.core = makeSprite(AC.core); spr.glow = makeDiff(G[3]); spr.gal = makeDiff(G[2]); spr.dev = makeSprite(DEV);
  return spr;
}
function drawBg(ctx, W, H, now, yaw, pitch, K, o, AC, spr) {
  ctx.globalCompositeOperation = 'lighter';
  o.deep.forEach((g) => { const q = tf(g.x, g.y, g.z, yaw, pitch, K, W, H); if (q.ze < 0.3) return; const sz = g.r * q.s * K, tw = 0.5 + 0.5 * Math.sin(now * g.fr + g.tw); ctx.globalAlpha = g.a * tw * 1.6; ctx.save(); ctx.translate(q.sx, q.sy); ctx.rotate(g.rot); ctx.drawImage(spr.gal, -sz * g.sx, -sz * g.sy, sz * g.sx * 2, sz * g.sy * 2); ctx.restore(); });
  ctx.globalCompositeOperation = 'source-over';
  o.stars.forEach((s) => { const q = tf(s.x, s.y, s.z, yaw, pitch, K, W, H); if (q.ze < 0.3) return; const tw = 0.4 + 0.6 * Math.abs(Math.sin(now * 0.0008 + s.tw)); ctx.globalAlpha = tw * (s.dim ? 0.22 : 0.45); ctx.fillStyle = s.dim ? '#cdeede' : AC.star; ctx.beginPath(); ctx.arc(q.sx, q.sy, s.r * q.s * 0.5, 0, 7); ctx.fill(); });
  ctx.globalAlpha = 1;
}

const VPOS = { inicio: [-0.1, 0.1, 0.15], induccion: [0.55, 0.4, -0.25], bitacora: [-0.7, -0.4, 0.2], marco_legal: [0.75, -0.4, 0.35], recursos: [0.0, -0.6, -0.45], perfil: [-0.82, 0.5, -0.2] };
const VEDGES = [['inicio', 'induccion'], ['inicio', 'bitacora'], ['inicio', 'recursos'], ['induccion', 'marco_legal'], ['induccion', 'perfil'], ['bitacora', 'recursos'], ['recursos', 'perfil']];

function drawVisitas(o, ctx, W, H, now, AC, spr) {
  const yaw = o.y0 + now * 0.00004, pitch = -0.16, K = Math.min(W, H) * 0.5;
  drawBg(ctx, W, H, now, yaw, pitch, K, o, AC, spr);
  const pp = {}; PAGES.forEach((p) => { pp[p.key] = tf(VPOS[p.key][0], VPOS[p.key][1], VPOS[p.key][2], yaw, pitch, K, W, H); });
  ctx.strokeStyle = 'rgba(' + AC.line + ',0.2)'; ctx.lineWidth = 1;
  VEDGES.forEach((e) => { const a = pp[e[0]], b = pp[e[1]]; ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke(); });
  ctx.globalCompositeOperation = 'lighter';
  o.sw.forEach((w) => { const q = tf(w.b[0] + w.ox, w.b[1] + w.oy, w.b[2] + w.oz, yaw, pitch, K, W, H); if (q.ze < 0.3) return; const sz = w.r * q.s * K, tw = 0.4 + 0.6 * Math.sin(now * 0.0013 + w.tw); ctx.globalAlpha = tw * w.bs * 0.7; ctx.drawImage(spr[w.ci], q.sx - sz, q.sy - sz, sz * 2, sz * 2); });
  PAGES.forEach((p) => { const q = pp[p.key]; if (q.ze < 0.3) return; const sr = o.sr[p.key], tw = 0.78 + 0.22 * Math.sin(now * 0.001 + p.key.length); const gs = sr * 2.4 * q.s * K; ctx.globalAlpha = 0.45 * tw; ctx.drawImage(spr.glow, q.sx - gs, q.sy - gs, gs * 2, gs * 2); const cs = sr * q.s * K; ctx.globalAlpha = tw; ctx.drawImage(spr.core, q.sx - cs, q.sy - cs, cs * 2, cs * 2); });
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
}

const TANG = { inicio: 0.5, induccion: 1.55, bitacora: 2.6, marco_legal: 3.65, recursos: 4.7, perfil: 5.75 };
function uForT(t) { return Math.log(1 + t) / Math.log(101); }
function drawTiempo(o, ctx, W, H, now, AC, spr) {
  const yaw = o.y0 + now * 0.00004, pitch = -0.15, K = Math.min(W, H) * 0.52, RTX = 1.05, RTY = 0.6;
  drawBg(ctx, W, H, now, yaw, pitch, K, o, AC, spr);
  for (let ri = 0; ri < 13; ri++) { const z = -2.6 + 4.8 * ri / 12; ctx.strokeStyle = 'rgba(' + AC.line + ',' + (0.04 + 0.1 * (ri / 13)) + ')'; ctx.lineWidth = 1; ctx.beginPath(); let st = false; for (let k = 0; k <= 28; k++) { const th = k / 28 * 6.283, q = tf(RTX * Math.cos(th), RTY * Math.sin(th), z, yaw, pitch, K, W, H); if (q.ze < 0.3) { st = false; continue; } if (st) ctx.lineTo(q.sx, q.sy); else ctx.moveTo(q.sx, q.sy); st = true; } ctx.stroke(); }
  ctx.globalCompositeOperation = 'lighter';
  const all = []; o.pg.forEach((L) => { L.parts.forEach((p) => { all.push({ L, p }); }); });
  all.forEach((it) => { it.q = tf(it.L.ax + it.p.ox, it.L.ay + it.p.oy, it.L.az + it.p.oz, yaw, pitch, K, W, H); });
  all.sort((a, b) => b.q.ze - a.q.ze);
  all.forEach((it) => { const q = it.q; if (q.ze < 0.3) return; const sz = it.p.r * q.s * K, tw = 0.4 + 0.6 * Math.sin(now * 0.0015 + it.p.tw); ctx.globalAlpha = Math.min(1, it.p.bs * tw); ctx.drawImage(spr[it.p.ci], q.sx - sz, q.sy - sz, sz * 2, sz * 2); });
  o.pg.forEach((L) => { const q = tf(L.ax, L.ay, L.az, yaw, pitch, K, W, H); if (q.ze < 0.3) return; const cs = L.cr * q.s * K; ctx.globalAlpha = 0.9; ctx.drawImage(spr.core, q.sx - cs, q.sy - cs, cs * 2, cs * 2); });
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
}

const NCL = [[-0.32, -0.08], [0.1, 0.05], [0.36, -0.22], [-0.16, 0.3], [0.26, 0.3], [0.46, 0.12]];
function drawIndice(o, ctx, W, H, now, AC, spr) {
  const yaw = o.y0 + now * 0.00004, pitch = -0.14, K = Math.min(W, H) * 0.5;
  drawBg(ctx, W, H, now, yaw, pitch, K, o, AC, spr);
  ctx.globalCompositeOperation = 'lighter';
  o.parts.forEach((p) => { p.q = tf(p.x, p.y, p.z, yaw, pitch, K, W, H); });
  o.parts.sort((a, b) => b.q.ze - a.q.ze);
  o.parts.forEach((p) => { const q = p.q; if (q.ze < 0.3) return; const sz = p.r * q.s * K, tw = 0.5 + 0.5 * Math.sin(now * 0.0014 + p.tw); ctx.globalAlpha = Math.min(1, p.bs * tw); ctx.drawImage(spr[p.ci], q.sx - sz, q.sy - sz, sz * 2, sz * 2); });
  const cq = tf(0, 0, 0, yaw, pitch, K, W, H), cs = 0.09 * cq.s * K, tw = 0.8 + 0.2 * Math.sin(now * 0.0013);
  ctx.globalAlpha = tw; ctx.drawImage(spr.core, cq.sx - cs, cq.sy - cs, cs * 2, cs * 2);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
}

const RN = { inicio: [-1, 0, 0], induccion: [-0.5, 0.32, 0.4], bitacora: [-0.05, -0.28, -0.3], marco_legal: [0.42, 0.34, 0.3], recursos: [0.82, -0.12, -0.4], perfil: [1.15, 0.16, 0.1] };
const RK = ['inicio', 'induccion', 'bitacora', 'marco_legal', 'recursos', 'perfil'];
const RDEV = [['inicio', 'marco_legal'], ['inicio', 'recursos'], ['induccion', 'perfil']];
function rpick(rtr, c) { const a = rtr[c]; if (!a || !a.length) return null; let s = 0; a.forEach((o) => { s += o.w; }); let r = rnd() * s; for (let i = 0; i < a.length; i++) { r -= a[i].w; if (r <= 0) return a[i]; } return a[0]; }
function ease(t) { return t * t * (3 - 2 * t); }
function rspawn(rtr, a) { a.cur = 'inicio'; const n = rpick(rtr, 'inicio'); a.next = n; a.dev = n ? n.dev : false; a.t = rnd() * 0.2; a.spd = 0.00018 + rnd() * 0.00014; a.sz = 0.5 + rnd() * 0.5; if (!n) a.dead = true; }
function drawRec(o, ctx, W, H, now, dt, AC, spr) {
  const yaw = o.y0 + now * 0.00004, pitch = -0.14, K = Math.min(W, H) * 0.46;
  drawBg(ctx, W, H, now, yaw, pitch, K, o, AC, spr);
  const pj = {}; RK.forEach((k) => { pj[k] = tf(RN[k][0], RN[k][1], RN[k][2], yaw, pitch, K, W, H); });
  RDEV.forEach((e) => { const a = pj[e[0]], b = pj[e[1]]; ctx.strokeStyle = 'rgba(232,121,90,0.2)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke(); });
  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(' + AC.line + ',0.28)'; ctx.lineWidth = 1.4; ctx.beginPath(); RK.forEach((k, i) => { const p = pj[k]; if (i) ctx.lineTo(p.sx, p.sy); else ctx.moveTo(p.sx, p.sy); }); ctx.stroke();
  ctx.globalCompositeOperation = 'lighter';
  o.ast.forEach((a) => {
    if (a.dead) return;
    a.t += a.spd * dt;
    if (a.t >= 1) { a.cur = a.next.to; const n = rpick(o.rtr, a.cur); if (!n) { rspawn(o.rtr, a); return; } a.next = n; a.dev = n.dev; a.t = 0; }
    const et = ease(a.t), A = RN[a.cur], B = RN[a.next.to], q = tf(A[0] + (B[0] - A[0]) * et, A[1] + (B[1] - A[1]) * et, A[2] + (B[2] - A[2]) * et, yaw, pitch, K, W, H);
    if (q.ze < 0.3) return; const sz = (0.04 * a.sz + 0.014) * q.s * K; ctx.globalAlpha = 0.95; ctx.drawImage(a.dev ? spr.dev : spr.core, q.sx - sz, q.sy - sz, sz * 2, sz * 2);
  });
  ctx.globalCompositeOperation = 'source-over';
  RK.forEach((k) => { const p = pj[k]; if (p.ze < 0.3) return; ctx.globalAlpha = 0.85; ctx.fillStyle = 'rgba(' + AC.line + ',0.9)'; ctx.beginPath(); ctx.arc(p.sx, p.sy, 2.4 * p.s, 0, 7); ctx.fill(); });
  ctx.globalAlpha = 1;
}

function buildModels(vals, trans) {
  const maxV = Math.max(1, ...PAGES.map((p) => vals[p.key].v));
  const maxAD = Math.max(1, ...PAGES.map((p) => vals[p.key].v * vals[p.key].t));
  // Visitas (constelación)
  const vis = { y0: 0.5, deep: mkDeep(8), stars: mkStars(22), sw: [], sr: {} };
  PAGES.forEach((p) => { const sr = 0.02 + Math.sqrt(vals[p.key].v / maxV) * 0.045; vis.sr[p.key] = sr; const k = Math.round(3 + (vals[p.key].v / maxV) * 22); for (let i = 0; i < k; i++) vis.sw.push({ b: VPOS[p.key], ox: gau() * 0.1, oy: gau() * 0.1, oz: gau() * 0.09, ci: 1 + Math.floor(rnd() * 3), r: 0.01 + rnd() * 0.024, tw: rnd() * 6.283, bs: 0.3 + rnd() * 0.3 }); });
  // Tiempo (túnel)
  const maxT = Math.max(1, ...PAGES.map((p) => vals[p.key].t));
  const tie = { y0: 0.35, deep: mkDeep(8), stars: mkStars(22), pg: [] };
  PAGES.forEach((p) => { const th = TANG[p.key]; const L = { ax: 0.7 * Math.cos(th), ay: 0.4 * Math.sin(th), az: 2.0 - uForT(vals[p.key].t) * 4.6, cr: 0.05 + (vals[p.key].v / maxV) * 0.03, parts: [] }; const n = Math.round(3 + (vals[p.key].v / maxV) * 16), Rc = 0.09 + (vals[p.key].v / maxV) * 0.05; for (let k = 0; k < n; k++) L.parts.push({ ox: gau() * Rc, oy: gau() * Rc, oz: gau() * 0.13, ci: 1 + Math.floor(rnd() * 3), r: 0.013 + rnd() * 0.03, tw: rnd() * 6.283, bs: 0.4 + rnd() * 0.4 }); tie.pg.push(L); });
  // Índice (nebulosa actual)
  const ind = { y0: 2.0, deep: mkDeep(8), stars: mkStars(20), parts: [] };
  PAGES.forEach((p, k) => { const c = NCL[k], ad = vals[p.key].v * vals[p.key].t, n = Math.max(3, Math.round(6 + (ad / maxAD) * 34)); for (let i = 0; i < n; i++) { const rr = Math.pow(rnd(), 1.7) * 0.17, a = rnd() * 6.283; const ox = Math.cos(a) * rr, oy = Math.sin(a) * rr; const d = Math.hypot(ox, oy) / 0.18; const ci = d < 0.4 ? 1 : d < 0.75 ? 2 : 3; ind.parts.push({ x: c[0] + ox, y: c[1] + oy, z: gau() * 0.18, ci, r: 0.016 + rnd() * 0.04, tw: rnd() * 6.283, bs: 0.4 + rnd() * 0.5 }); } });
  // Recorridos (asteroides) — pesos desde transiciones reales
  const rtr = {}; RK.forEach((k) => { rtr[k] = []; });
  trans.forEach((tr) => { if (!rtr[tr.d]) return; const dev = !SPINE.some((e) => e[0] === tr.d && e[1] === tr.h); rtr[tr.d].push({ to: tr.h, w: Math.max(1, tr.w), dev }); });
  const rec = { y0: 0.6, deep: mkDeep(8), stars: mkStars(20), rtr, ast: [] };
  for (let i = 0; i < 9; i++) { const a = {}; rspawn(rtr, a); a.t = rnd(); rec.ast.push(a); }
  return { visitas: vis, tiempo: tie, indice: ind, recorridos: rec };
}

function startDashboard(root, visualMode, models) {
  const AC = ACCENTS[visualMode] || ACCENTS.boldo;
  const spr = buildSprites(AC);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvases = Array.prototype.slice.call(root.querySelectorAll('canvas[data-viz]')).map((cv) => ({ cv, ctx: cv.getContext('2d'), key: cv.getAttribute('data-viz') }));
  function size() { canvases.forEach((o) => { o.W = o.cv.clientWidth; o.H = o.cv.clientHeight; o.cv.width = Math.round(o.W * dpr); o.cv.height = Math.round(o.H * dpr); o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }); }
  size();
  window.addEventListener('resize', size);
  let raf = 0, last = 0, stopped = false;
  function loop(now) {
    if (stopped) return;
    if (!last) last = now; const dt = Math.min(48, now - last); last = now;
    canvases.forEach((o) => {
      const ctx = o.ctx; ctx.clearRect(0, 0, o.W, o.H); ctx.fillStyle = PANEL; ctx.fillRect(0, 0, o.W, o.H);
      if (o.key === 'visitas') drawVisitas(models.visitas, ctx, o.W, o.H, now, AC, spr);
      else if (o.key === 'tiempo') drawTiempo(models.tiempo, ctx, o.W, o.H, now, AC, spr);
      else if (o.key === 'indice') drawIndice(models.indice, ctx, o.W, o.H, now, AC, spr);
      else if (o.key === 'recorridos') drawRec(models.recorridos, ctx, o.W, o.H, now, dt, AC, spr);
    });
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  return function cleanup() { stopped = true; cancelAnimationFrame(raf); window.removeEventListener('resize', size); };
}

export function SupervisionPage({ visualMode = 'boldo' }) {
  const rootRef = useRef(null);
  const [st, setSt] = useState({ loading: true, real: false, vals: null, trans: null, totals: null });

  useEffect(() => {
    let alive = true;
    Promise.all([getResumenTablero(), getTransiciones()])
      .then(([res, tr]) => {
        if (!alive) return;
        const paginas = (res && res.paginas) || [];
        const real = paginas.length > 0;
        const vals = {};
        PAGES.forEach((p) => {
          const row = paginas.find((x) => x.pageKey === p.key || x.route === p.route);
          vals[p.key] = real && row ? { v: row.visitas || 0, t: row.tiempoMedioS || 0 } : SAMPLE[p.key];
        });
        const trans = (real && tr && tr.length)
          ? tr.map((x) => ({ d: ROUTE_TO_KEY[x.desde], h: ROUTE_TO_KEY[x.hacia], w: x.veces })).filter((x) => x.d && x.h)
          : SAMPLE_TR;
        const totVis = real ? (res.visitas || 0) : PAGES.reduce((s, p) => s + SAMPLE[p.key].v, 0);
        const totTie = real ? (res.tiempoMedioS || 0) : 52;
        const totInd = real ? (res.indiceTotal || 0) : 488;
        const totW = trans.reduce((s, x) => s + x.w, 0) || 1;
        const ruta = trans.filter((x) => SPINE.some((e) => e[0] === x.d && e[1] === x.h)).reduce((s, x) => s + x.w, 0);
        const pctRuta = Math.round((ruta / totW) * 100);
        setSt({ loading: false, real, vals, trans, totals: { totVis, totTie, totInd, pctRuta } });
      })
      .catch(() => { if (alive) setSt({ loading: false, real: false, vals: null, trans: null, totals: null }); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (st.loading || !st.vals || !rootRef.current) return;
    const models = buildModels(st.vals, st.trans);
    const cleanup = startDashboard(rootRef.current, visualMode, models);
    return cleanup;
  }, [st, visualMode]);

  const t = st.totals || {};
  const cards = [
    { key: 'visitas', name: 'Visitas', value: t.totVis != null ? String(t.totVis) : '—', unit: 'visitas' },
    { key: 'tiempo', name: 'Tiempo medio', value: t.totTie != null ? String(t.totTie) : '—', unit: 's/visita' },
    { key: 'indice', name: 'Índice compuesto', value: t.totInd != null ? String(t.totInd) : '—', unit: 'aD_' },
    { key: 'recorridos', name: 'Recorridos', value: t.pctRuta != null ? t.pctRuta + '%' : '—', unit: 'sigue la ruta' },
  ];

  return (
    <div style={{ padding: '8px 4px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Tablero Constelar · navegación</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.7 }}>
            Analítica de navegación anónima (Ley 21.719){' '}
            {st.loading ? '· cargando…' : st.real ? '· datos reales' : '· datos de muestra (aún no hay trazas)'}
          </p>
        </div>
      </div>
      <div ref={rootRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {cards.map((c) => (
          <div key={c.key} style={{ background: 'rgba(0,0,0,0.04)', border: '0.5px solid rgba(12,48,37,.16)', borderRadius: 12, padding: 11, display: 'flex', flexDirection: 'column', gap: 9 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <div style={{ fontSize: 13, opacity: 0.65 }}>{c.name}</div>
                <div style={{ fontSize: 19, fontWeight: 600 }}>
                  {c.value} <span style={{ fontSize: 11, opacity: 0.6 }}>{c.unit}</span>
                </div>
              </div>
            </div>
            <div style={{ position: 'relative', borderRadius: 9, overflow: 'hidden', background: PANEL }}>
              <canvas data-viz={c.key} style={{ display: 'block', width: '100%', height: 200 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
