import React from 'react';
import { disabledPageMessage, getNavigationForRole } from '../app/system-map/systemMap.js';
import { getRole, getUserDisplayName, routeLabel } from '../lib/uiHelpers.js';

export function AppShell({
  route,
  navigate,
  visualMode,
  updateVisualMode,
  deviceType,
  user,
  profile,
  onSignOut,
  children,
}) {
  const displayName = getUserDisplayName(user, profile);
  const role = getRole(profile);
  const [navOpen, setNavOpen] = React.useState(false);
  // El cajón se cierra solo al cambiar de ruta (navegación) o de dispositivo.
  React.useEffect(() => {
    setNavOpen(false);
  }, [route, deviceType]);

  return (
    <main
      className={`app-shell theme-${visualMode} route-${route.replace('/', '') || 'login'}${
        navOpen ? ' nav-open' : ''
      }`}
    >
      <button
        type="button"
        className="nav-toggle"
        aria-label="Abrir menú de navegación"
        aria-expanded={navOpen}
        onClick={() => setNavOpen((open) => !open)}
      >
        <span aria-hidden="true">☰</span>
      </button>
      <div
        className="nav-backdrop"
        hidden={!navOpen}
        aria-hidden="true"
        onClick={() => setNavOpen(false)}
      />
      <aside className={`side-nav${navOpen ? ' open' : ''}`}>
        <button
          type="button"
          className="nav-close"
          aria-label="Cerrar menú"
          onClick={() => setNavOpen(false)}
        >
          <span aria-hidden="true">✕</span>
        </button>
        <div className="brand-block">
          <div className="crest" aria-hidden="true" />
          <div>
            <h1>Web-Lab S.M.T.</h1>
            <p>Departamento de Monitoreo Telemático</p>
          </div>
        </div>

        <label className="side-search">
          <span>⌕</span>
          <input placeholder="Buscar concepto" />
        </label>

        <nav className="primary-nav" aria-label="Navegación principal">
          {getNavigationForRole(role).map((item) => {
            const isDisabled = item.status === 'disabled';
            return (
              <button
                key={item.key}
                className={`${route === item.path ? 'active' : ''}${isDisabled ? ' disabled-nav' : ''}`.trim()}
                onClick={
                  isDisabled
                    ? undefined
                    : () => {
                        navigate(item.path);
                        setNavOpen(false);
                      }
                }
                disabled={isDisabled}
                aria-disabled={isDisabled || undefined}
                title={isDisabled ? disabledPageMessage[item.key] : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="progress-block">
          <div>
            <span>Centro de Formación</span>
            <strong>y Desarrollo</strong>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="top-bar">
          <div>
            <p>Sistema de Monitoreo Telemático</p>
            <h2>{routeLabel(route)}</h2>
          </div>

          <div className="top-actions">
            <div className="user-chip">◎ {displayName}</div>
            <span className="bell-icon">♧</span>
          </div>

          <div className="view-switch" aria-label="Selector de vista">
            <span>Vista:</span>
            <button
              className={visualMode === 'boldo' ? 'active' : ''}
              onClick={() => updateVisualMode('boldo')}
            >
              Boldo
            </button>
            <button
              className={visualMode === 'ambar' ? 'active' : ''}
              onClick={() => updateVisualMode('ambar')}
            >
              Ámbar
            </button>
          </div>
          <button className="ghost-button" onClick={onSignOut}>
            Salir
          </button>
        </header>

        {children}
      </section>
      <footer className="app-footer">
        <span>Gendarmería de Chile</span>
        <span>Departamento de Monitoreo Telemático</span>
        <span>Ley 21.378</span>
        <span>Decreto 19</span>
        <span>Ley 20.066</span>
        <span>Ley 19.968</span>
        <span>Ley 20.603</span>
        <span>Ley 21.719</span>
      </footer>
    </main>
  );
}
