import { disabledPageMessage } from '../app/system-map/systemMap.js';

export function RestrictedPage() {
  return (
    <section className="page-grid">
      <article className="hero-panel">
        <p className="section-label">Acceso restringido</p>
        <h3>Módulo no disponible para este perfil</h3>
        <p>La visualización de este módulo depende del rol asignado en Supabase.</p>
      </article>
    </section>
  );
}

export function DisabledPage({ pageKey, navigate }) {
  return (
    <section className="page-grid">
      <article className="hero-panel">
        <p className="section-label">No disponible</p>
        <h3>Módulo no disponible en esta versión</h3>
        <p>
          {disabledPageMessage[pageKey] ||
            'Esta sección estará disponible en una etapa posterior del entrenamiento operacional.'}
        </p>
        <button onClick={() => navigate('/home')}>Volver a Inicio</button>
      </article>
    </section>
  );
}

// ---- Editor Visual: render de bloques desde la BD (con fallback al código actual) ----
