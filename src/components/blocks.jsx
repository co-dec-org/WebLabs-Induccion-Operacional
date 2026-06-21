import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { getPageContent } from '../lib/dmtApi.js';

// ===== Biblioteca de bloques — reutilizan el CSS aprobado y son responsive =====
// .page-grid (contenedor) es 3 columnas en desktop y 1 columna en móvil.
// .hero-panel = panel oscuro full-width. .status-card = tarjeta clara.

export function HeroBlock({ props }) {
  return (
    <article className="hero-panel">
      {props.eyebrow ? <p className="section-label">{props.eyebrow}</p> : null}
      <h3>{props.title}</h3>
      {props.subtitle ? <p>{props.subtitle}</p> : null}
      {props.body ? <p>{props.body}</p> : null}
    </article>
  );
}

export function TituloBlock({ props }) {
  return (
    <article className="status-card" style={{ gridColumn: 'span 3' }}>
      {props.eyebrow ? <span>{props.eyebrow}</span> : null}
      <strong style={{ fontSize: 22, lineHeight: 1.2 }}>{props.title}</strong>
      {props.subtitle ? <p>{props.subtitle}</p> : null}
    </article>
  );
}

export function TarjetaBlock({ props }) {
  return (
    <article className="status-card">
      {props.eyebrow ? <span>{props.eyebrow}</span> : null}
      <strong>{props.title}</strong>
      {props.body ? <p>{props.body}</p> : null}
    </article>
  );
}

export function AcordeonBlock({ props }) {
  return (
    <article className="status-card" style={{ gridColumn: 'span 3' }}>
      <details>
        <summary style={{ cursor: 'pointer', fontWeight: 700 }}>
          {props.title || 'Sección'}
        </summary>
        {props.body ? (
          <div className="legal-note" style={{ marginTop: 10 }}>{props.body}</div>
        ) : null}
      </details>
    </article>
  );
}

export function CtaBlock({ props }) {
  return (
    <article className="hero-panel">
      <h3>{props.title}</h3>
      {props.subtitle ? <p>{props.subtitle}</p> : null}
      {props.buttonLabel ? <button>{props.buttonLabel}</button> : null}
    </article>
  );
}

function renderBlock(block) {
  const props = block.props || {};
  switch (block.block_type) {
    case 'titulo':
      return <TituloBlock key={block.id} props={props} />;
    case 'tarjeta':
      return <TarjetaBlock key={block.id} props={props} />;
    case 'acordeon':
      return <AcordeonBlock key={block.id} props={props} />;
    case 'cta':
      return <CtaBlock key={block.id} props={props} />;
    case 'hero':
    default:
      return <HeroBlock key={block.id} props={props} />;
  }
}

export function BlockRenderer({ blocks }) {
  return <section className="page-grid">{blocks.map(renderBlock)}</section>;
}

// Intenta renderizar la página desde la BD; si solo hay contenido "seed"
// o algo falla, muestra el fallback (la página actual codificada). Cero riesgo.
export function EditablePage({ pageKey, fallback }) {
  const [blocks, setBlocks] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoaded(false);
    getPageContent(pageKey).then((res) => {
      if (!alive) return;
      setBlocks(res?.blocks ?? null);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [pageKey]);

  if (!loaded) return fallback;

  const visibles = (blocks || []).filter((b) => b.is_visible !== false);
  const hasRealContent = visibles.some((b) => !(b.props && b.props.seed === true));
  if (!hasRealContent) return fallback;

  return <BlockRenderer blocks={visibles} />;
}


// ===== Preview responsive: iframe por perfil de pantalla =====
// Usa un iframe con el ancho de cada perfil para que las @media queries
// del CSS respondan de verdad (un contenedor no dispara media queries).
const SCREEN_PROFILES = [
  { key: 'phone', label: 'Phone', w: 390 },
  { key: 'tablet', label: 'Tablet', w: 768 },
  { key: 'desktop', label: 'Desktop', w: 1180 },
  { key: 'desktophd', label: 'Desktop HD', w: 1440 },
];

export function ResponsivePreview({ blocks }) {
  const [profile, setProfile] = useState('desktop');
  const [theme, setTheme] = useState('boldo');
  const hiddenRef = useRef(null);
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const styleTags = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent)
      .join('\n');
    const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((l) => `<link rel="stylesheet" href="${l.href}">`)
      .join('');
    const inner = hiddenRef.current ? hiddenRef.current.innerHTML : '';
    setSrcDoc(
      `<!doctype html><html><head><meta charset="utf-8">${linkTags}` +
      `<style>${styleTags}\nbody{margin:0;background:var(--surface);} .preview-pad{padding:18px;}</style>` +
      `</head><body class="theme-${theme}"><div class="preview-pad">${inner}</div></body></html>`
    );
  }, [blocks, theme, profile]);

  const width = (SCREEN_PROFILES.find((p) => p.key === profile) || {}).w || 1180;
  const tabBtn = (active) => (active ? '' : 'ghost-button');

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>Pantalla:</span>
        {SCREEN_PROFILES.map((p) => (
          <button key={p.key} className={tabBtn(profile === p.key)} onClick={() => setProfile(p.key)}>
            {p.label}
          </button>
        ))}
        <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 12 }}>Tema:</span>
        <button className={tabBtn(theme === 'boldo')} onClick={() => setTheme('boldo')}>Boldo</button>
        <button className={tabBtn(theme === 'ambar')} onClick={() => setTheme('ambar')}>Ámbar</button>
      </div>

      <div ref={hiddenRef} aria-hidden="true" style={{ position: 'absolute', left: -99999, top: 0, width: 1180, visibility: 'hidden' }}>
        <BlockRenderer blocks={blocks} />
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid var(--line)', borderRadius: 12, background: 'var(--surface)' }}>
        <iframe
          title="Vista previa responsive"
          srcDoc={srcDoc}
          style={{ width, height: 640, maxWidth: '100%', border: 0, display: 'block', margin: '0 auto' }}
        />
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
        Vista a {width}px. En Phone/Tablet las tarjetas se apilan; en Desktop van en fila.
      </p>
    </div>
  );
}
