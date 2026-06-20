import React from 'react';
import { useEffect, useState } from 'react';
import { getPageContent } from '../lib/dmtApi.js';

export function HeroBlock({ props }) {
  return (
    <article className="hero-panel">
      <p className="section-label">{props.eyebrow || 'Web Lab S.M.T.'}</p>
      <h3>{props.title}</h3>
      {props.subtitle ? <p>{props.subtitle}</p> : null}
      {props.body ? <p>{props.body}</p> : null}
    </article>
  );
}

export function BlockRenderer({ blocks }) {
  return (
    <section className="page-grid">
      {blocks.map((block) => {
        switch (block.block_type) {
          case 'hero':
            return <HeroBlock key={block.id} props={block.props || {}} />;
          default:
            return null;
        }
      })}
    </section>
  );
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
