import React from 'react';
import { useEffect, useState } from 'react';
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
