import React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { modules } from '../data/modules.js';
import { inductionMenu } from '../lib/uiConstants.js';

// Escala la lámina de diseño (lienzo fijo 800×450) para que quepa exactamente
// en su contenedor, sin deformar ni romper el contenido interno. Devuelve un
// callback ref reutilizable por el visor y el modo presentación (soporta el
// montaje/desmontaje del overlay). Recalcula al cambiar el tamaño del marco.
const SLIDE_W = 800;
const SLIDE_H = 450;
function useSlideScaleRef() {
  const cleanup = useRef(null);
  return useCallback((el) => {
    if (cleanup.current) {
      cleanup.current();
      cleanup.current = null;
    }
    if (!el) return;
    const apply = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const scale = Math.min(w / SLIDE_W, h / SLIDE_H) || w / SLIDE_W;
      el.style.setProperty('--deck-scale', String(scale));
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    cleanup.current = () => observer.disconnect();
  }, []);
}

export function WebSlide({ module }) {
  if (module.number === 7) {
    const steps = [
      ['1', '!', 'Verificar riesgo'],
      ['2', '✓', 'Clasificar evento'],
      ['3', '☎', 'Contactar'],
      ['4', '↱', 'Escalar'],
      ['5', '▤', 'Documentar'],
    ];

    return (
      <article className="web-slide logic-slide">
        <span className="slide-shield" />
        <p>Inducción operacional</p>
        <h2>Lógica operacional general</h2>
        <h3>Secuencia base para el tratamiento de una alarma</h3>
        <div className="gold-line" />
        <div className="operator-cycle">
          {steps.map(([number, icon, label], index) => (
            <div className="cycle-step" key={number}>
              <span>{number}</span>
              <i>{icon}</i>
              <strong>{label}</strong>
              {index < steps.length - 1 && <b>···›</b>}
            </div>
          ))}
        </div>
        <div className="key-slide-message">
          <i>●</i>
          <strong>Primero se comprende el evento;<br />luego se decide la respuesta.</strong>
        </div>
      </article>
    );
  }

  if (module.number === 1) {
    return (
      <article className="web-slide cover-slide">
        <span className="slide-shield" />
        <h2>Inducción<br />Operacional</h2>
        <h3>Sistema de Monitoreo Telemático</h3>
        <div className="gold-line" />
        <p>Entrenamiento para operadores telemáticos</p>
        <footer>
          <strong>Gendarmería de Chile</strong>
          <span>Departamento de Monitoreo Telemático</span>
        </footer>
      </article>
    );
  }

  return (
    <article className="web-slide generic-slide">
      <span className="slide-shield" />
      <p>Inducción operacional</p>
      <h2>{module.title}</h2>
      <h3>{module.subtitle}</h3>
      <div className="gold-line" />
      <div className="generic-slide-message">
        <strong>{module.keyMessage}</strong>
      </div>
      <footer>
        <span>Sistema de Monitoreo Telemático</span>
        <span>Ley 21.378</span>
      </footer>
    </article>
  );
}

export function InduccionPage({ done, setDone }) {
  const [active, setActive] = useState(1);
  const [query, setQuery] = useState('');
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const deckFrameRef = useSlideScaleRef();
  const presFrameRef = useSlideScaleRef();

  const activeModule = modules.find((module) => module.number === active) || modules[0];
  const filteredModules = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return modules;
    return modules.filter((module) =>
      [module.title, module.subtitle, module.objective, module.keyMessage, ...module.keywords]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [query]);

  function toggleDone(number) {
    const next = done.includes(number)
      ? done.filter((item) => item !== number)
      : [...done, number].sort((a, b) => a - b);
    setDone(next);
    localStorage.setItem('dmt-progress', JSON.stringify(next));
  }

  return (
    <>
      <section className="induccion-layout">
        <aside className="module-browser">
          <label className="search-box light">
            Buscar lámina
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Concepto o módulo"
            />
          </label>
          <p className="module-list-label">Módulos de inducción</p>
          <nav className="module-list" aria-label="Módulos de inducción">
            {filteredModules.map((module) => (
              <button
                key={module.number}
                className={module.number === active ? 'module-link active' : 'module-link'}
                onClick={() => setActive(module.number)}
              >
                <span>{String(module.number).padStart(2, '0')}</span>
                <strong>{inductionMenu[module.number - 1] || module.title}</strong>
              </button>
            ))}
          </nav>
        </aside>

        <article className="deck-stage">
          <div className="deck-toolbar">
            <span>Lámina {String(activeModule.number).padStart(2, '0')} de 14</span>
            <strong>{activeModule.title}</strong>
            <button className="list-toggle" type="button">☷</button>
            <button className="presentation-button" onClick={() => setIsPresentationOpen(true)}>
              Modo presentación
            </button>
          </div>
          <figure className="slide-frame deck-slide" ref={deckFrameRef}>
            <WebSlide module={activeModule} />
          </figure>
          <div className="deck-controls">
            <button onClick={() => setActive(Math.max(1, active - 1))}>Anterior</button>
            <button
              className={done.includes(activeModule.number) ? 'done-button complete' : 'done-button'}
              onClick={() => toggleDone(activeModule.number)}
            >
              {done.includes(activeModule.number) ? 'Lámina revisada' : 'Marcar revisada'}
            </button>
            <button onClick={() => setActive(Math.min(modules.length, active + 1))}>
              Siguiente
            </button>
          </div>
          <nav className="thumbnail-strip" aria-label="Miniaturas de láminas">
            {modules.map((module) => (
              <button
                key={module.number}
                className={module.number === active ? 'active' : ''}
                onClick={() => setActive(module.number)}
              >
                <div className="thumb-preview"><WebSlide module={module} /></div>
                <span>{String(module.number).padStart(2, '0')}</span>
              </button>
            ))}
          </nav>
        </article>

        <aside className="module-summary">
          <p className="section-label">Módulo {activeModule.number}/14</p>
          <h3>{activeModule.title}</h3>
          <p className="subtitle">{activeModule.subtitle}</p>
          <p>{activeModule.objective}</p>
          <blockquote>{activeModule.keyMessage}</blockquote>
          <div className="legal-note">
            <span>Ley 21.378</span>
            <span>Decreto 19</span>
            <span>Ley 20.066</span>
            <span>Ley 19.968</span>
            <span>Ley 20.603</span>
            <span>Ley 21.719</span>
          </div>
          <article className="privacy-card">
            <span>Nota de privacidad</span>
            <p>Material educativo. Usar solo casos simulados, anonimizados o autorizados.</p>
          </article>
        </aside>
      </section>

      {isPresentationOpen && (
        <section className="presentation-overlay">
          <header>
            <div>
              <span>Lámina {String(activeModule.number).padStart(2, '0')} de 14</span>
              <strong>{activeModule.title}</strong>
            </div>
            <button onClick={() => setIsPresentationOpen(false)}>Salir</button>
          </header>
          <figure ref={presFrameRef}>
            <WebSlide module={activeModule} />
          </figure>
          <footer>
            <button onClick={() => setActive(Math.max(1, active - 1))}>Anterior</button>
            <button onClick={() => setActive(Math.min(modules.length, active + 1))}>
              Siguiente
            </button>
          </footer>
        </section>
      )}
    </>
  );
}
