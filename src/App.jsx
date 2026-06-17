import { useEffect, useMemo, useState } from 'react';
import { modules, templates } from './data/modules.js';
import { isSupabaseConfigured } from './lib/supabaseClient.js';
import {
  getCurrentSession,
  getProfile,
  listContextualNotes,
  saveContextualNote,
  saveVisualPreference,
  signInWithInstitutionalEmail,
  signOut,
} from './lib/dmtApi.js';

const navItems = [
  { path: '/home', label: 'Home' },
  { path: '/induccion', label: 'Induccion' },
  { path: '/bitacora', label: 'Bitacora' },
  { path: '/marco-legal', label: 'Marco legal' },
  { path: '/recursos', label: 'Recursos' },
  { path: '/perfil', label: 'Perfil' },
];

const legalOperationalText =
  'Criterio legal-operacional: antes de produccion se debe asegurar RLS, minimo dato personal y prohibicion de registrar datos reales de victimas, PSC, domicilios, telefonos, coordenadas, folios o causas, conforme Ley 21.719 y marco de monitoreo telematico.';

const evidenceTypes = ['Texto', 'Captura', 'Audio', 'Video', 'Adjunto'];
const deviceLabels = { desktop: 'Desktop', tablet: 'Tablet', phone: 'Phone' };

function getDeviceType() {
  if (window.innerWidth < 768) return 'phone';
  if (window.innerWidth < 1180) return 'tablet';
  return 'desktop';
}

function getRoute() {
  const path = window.location.pathname;
  return path === '/' ? '/login' : path;
}

function routeLabel(path) {
  return navItems.find((item) => item.path === path)?.label || 'Login';
}

function slidePath(number) {
  return `/slides/slide-${String(number).padStart(2, '0')}.png`;
}

function getUserDisplayName(user, profile) {
  if (profile?.full_name) return profile.full_name;
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
  return 'Juan Gonzalez Tapia';
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('usuario@gendarmeria.cl');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('Validando acceso institucional...');
    try {
      await onLogin(email, password);
    } catch (error) {
      setStatus(error.message || 'No fue posible iniciar sesion.');
    }
  }

  return (
    <main className="login-page theme-boldo">
      <section className="login-hero">
        <p>Departamento de Monitoreo Telematico</p>
        <h1>Sistema de Monitoreo Telematico</h1>
        <h2>Entrenamiento para operadores telematicos</h2>
        <div className="login-legal">{legalOperationalText}</div>
      </section>

      <form className="login-card" onSubmit={handleSubmit}>
        <div>
          <p className="section-label">Acceso institucional</p>
          <h3>Web-Lab S.M.T.</h3>
        </div>

        <label>
          Correo institucional
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="usuario@gendarmeria.cl"
            required
          />
        </label>

        <label>
          Contrasena
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Contrasena enviada a su correo"
          />
        </label>

        <button type="submit">Ingresar</button>
        <button type="button" className="disabled-access" disabled>
          Otro metodo de acceso
        </button>
        <p className="form-status">{status || 'Login fijo en vista Boldo.'}</p>
      </form>
    </main>
  );
}

function AppShell({
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

  return (
    <main className={`app-shell theme-${visualMode}`}>
      <aside className="side-nav">
        <div className="brand-block">
          <div className="crest">G</div>
          <div>
            <p>Departamento de Monitoreo Telematico</p>
            <h1>Web-Lab S.M.T.</h1>
          </div>
        </div>

        <nav className="primary-nav" aria-label="Navegacion principal">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={route === item.path ? 'active' : ''}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
          <button className="disabled-nav" disabled>
            Simulaciones
          </button>
        </nav>

        <div className="progress-block">
          <div>
            <span>Supabase</span>
            <strong>{isSupabaseConfigured ? 'OK' : 'Local'}</strong>
          </div>
          <p>Ambiente V1 con resguardo de datos y bitacora contextual.</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="top-bar">
          <div>
            <p>Sistema de Monitoreo Telematico</p>
            <h2>{routeLabel(route)}</h2>
          </div>

          <div className="view-switch" aria-label="Selector de vista">
            <span>{deviceLabels[deviceType]}</span>
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
              Ambar
            </button>
          </div>

          <div className="user-chip">{displayName}</div>
          <button className="ghost-button" onClick={onSignOut}>
            Salir
          </button>
        </header>

        {children}
      </section>
    </main>
  );
}

function HomePage({ navigate }) {
  return (
    <section className="page-grid">
      <article className="hero-panel">
        <p className="section-label">Onboarding operativo</p>
        <h3>Entrenamiento del operador telematico</h3>
        <p>
          La web-lab organiza lectura, avance y bitacora contextual para entrenar criterio
          operativo sin registrar datos sensibles reales.
        </p>
        <div className="action-row">
          <button onClick={() => navigate('/induccion')}>Continuar induccion</button>
          <button className="secondary" onClick={() => navigate('/marco-legal')}>
            Revisar marco legal
          </button>
        </div>
      </article>

      <article className="status-card">
        <span>14</span>
        <strong>Laminas disponibles</strong>
        <p>Contenido aprobado para lectura web y modo presentacion.</p>
      </article>
      <article className="status-card">
        <span>Global</span>
        <strong>Bitacora contextual</strong>
        <p>Registra notas segun pagina, modulo o lamina.</p>
      </article>
      <article className="status-card disabled-card">
        <span>Inhabilitado</span>
        <strong>Simulaciones</strong>
        <p>Modulo reservado para una etapa posterior.</p>
      </article>
    </section>
  );
}

function InduccionPage({ done, setDone }) {
  const [active, setActive] = useState(1);
  const [query, setQuery] = useState('');
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

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
            Buscar lamina
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Concepto o modulo"
            />
          </label>
          <nav className="module-list" aria-label="Modulos de induccion">
            {filteredModules.map((module) => (
              <button
                key={module.number}
                className={module.number === active ? 'module-link active' : 'module-link'}
                onClick={() => setActive(module.number)}
              >
                <span>{String(module.number).padStart(2, '0')}</span>
                <strong>{module.title}</strong>
              </button>
            ))}
          </nav>
        </aside>

        <article className="deck-stage">
          <div className="deck-toolbar">
            <span>Lamina {String(activeModule.number).padStart(2, '0')} de 14</span>
            <strong>{activeModule.title}</strong>
            <button className="presentation-button" onClick={() => setIsPresentationOpen(true)}>
              Modo presentacion
            </button>
          </div>
          <figure className="slide-frame deck-slide">
            <img src={slidePath(activeModule.number)} alt={`Lamina ${activeModule.number}`} />
          </figure>
          <div className="deck-controls">
            <button onClick={() => setActive(Math.max(1, active - 1))}>Anterior</button>
            <button
              className={done.includes(activeModule.number) ? 'done-button complete' : 'done-button'}
              onClick={() => toggleDone(activeModule.number)}
            >
              {done.includes(activeModule.number) ? 'Lamina revisada' : 'Marcar revisada'}
            </button>
            <button onClick={() => setActive(Math.min(modules.length, active + 1))}>
              Siguiente
            </button>
          </div>
        </article>

        <aside className="module-summary">
          <p className="section-label">Modulo {activeModule.number}/14</p>
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
        </aside>
      </section>

      {isPresentationOpen && (
        <section className="presentation-overlay">
          <header>
            <div>
              <span>Lamina {String(activeModule.number).padStart(2, '0')} de 14</span>
              <strong>{activeModule.title}</strong>
            </div>
            <button onClick={() => setIsPresentationOpen(false)}>Salir</button>
          </header>
          <figure>
            <img src={slidePath(activeModule.number)} alt={`Lamina ${activeModule.number}`} />
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

function BitacoraPage({ notes, reloadNotes }) {
  return (
    <section className="page-grid two-columns">
      <article className="hero-panel">
        <p className="section-label">Bitacora de entrenamiento</p>
        <h3>Registros hechos desde la web</h3>
        <p>
          Consolida notas creadas desde capacitaciones, induccion y el resto de la web para
          facilitar analisis posterior.
        </p>
        <button onClick={reloadNotes}>Actualizar registros</button>
      </article>

      <section className="log-list-panel">
        {notes.length === 0 ? (
          <p className="empty-state">Sin registros aun.</p>
        ) : (
          notes.map((note) => (
            <article key={note.id}>
              <span>{note.page || 'Contexto'} · {note.evidence_type || 'Texto'}</span>
              <strong>{note.context_label || 'Registro contextual'}</strong>
              <p>{note.note}</p>
            </article>
          ))
        )}
      </section>
    </section>
  );
}

function MarcoLegalPage() {
  const laws = [
    ['Ley 21.378', 'Establece monitoreo telematico en Ley 20.066 y Ley 19.968.'],
    ['Decreto 19', 'Reglamento aplicable al monitoreo telematico en VIF y familia.'],
    ['Ley 20.066', 'Marco para prevenir, sancionar y erradicar violencia intrafamiliar.'],
    ['Ley 19.968', 'Tribunales de Familia, medidas cautelares y tramitacion.'],
    ['Ley 20.603', 'Sistema de penas sustitutivas y control telematico penal.'],
    ['Ley 21.719', 'Proteccion de datos personales y minimizacion de tratamiento.'],
  ];

  return (
    <section className="page-grid">
      <article className="hero-panel">
        <p className="section-label">Marco legal-operacional</p>
        <h3>Norma, reglamento y criterio de datos</h3>
        <p>{legalOperationalText}</p>
      </article>
      {laws.map(([title, body]) => (
        <article className="status-card" key={title}>
          <span>{title}</span>
          <strong>{body}</strong>
        </article>
      ))}
    </section>
  );
}

function RecursosPage() {
  return (
    <section className="page-grid two-columns">
      <article className="hero-panel">
        <p className="section-label">Recursos</p>
        <h3>Material de apoyo del operador</h3>
        <p>Laminas, plantillas de texto y criterios de uso para entrenamiento.</p>
      </article>
      <section className="resource-list">
        {templates.map((template) => (
          <article key={template.title}>
            <span>{template.category}</span>
            <strong>{template.title}</strong>
            <p>{template.body}</p>
          </article>
        ))}
      </section>
    </section>
  );
}

function PerfilPage({ user, profile, deviceType, visualMode }) {
  return (
    <section className="page-grid two-columns">
      <article className="hero-panel">
        <p className="section-label">Perfil</p>
        <h3>{getUserDisplayName(user, profile)}</h3>
        <p>{user?.email || 'usuario@gendarmeria.cl'}</p>
      </article>
      <article className="status-card">
        <span>Departamento</span>
        <strong>{profile?.department || 'Departamento de Monitoreo Telematico'}</strong>
      </article>
      <article className="status-card">
        <span>Rol V1</span>
        <strong>{profile?.role || 'Operador / Entrenamiento'}</strong>
      </article>
      <article className="status-card">
        <span>Preferencia visual</span>
        <strong>{deviceLabels[deviceType]} · {visualMode}</strong>
      </article>
    </section>
  );
}

function FloatingLog({ route, user, onSaved }) {
  const [open, setOpen] = useState(false);
  const [large, setLarge] = useState(false);
  const [note, setNote] = useState('');
  const [evidenceType, setEvidenceType] = useState('Texto');
  const [status, setStatus] = useState('');

  async function handleSave() {
    if (!note.trim()) {
      setStatus('Ingrese una nota antes de guardar.');
      return;
    }

    try {
      await saveContextualNote({
        userId: user?.id,
        page: routeLabel(route),
        contextLabel: route,
        note,
        evidenceType,
      });
      setNote('');
      setStatus('Registro guardado.');
      onSaved();
    } catch (error) {
      setStatus(error.message || 'No fue posible guardar.');
    }
  }

  if (!open) {
    return (
      <aside className="floating-log collapsed">
        <button className="floating-log-launcher" onClick={() => setOpen(true)}>
          Bitacora
        </button>
      </aside>
    );
  }

  return (
    <aside className={`floating-log ${large ? 'large' : 'compact'}`}>
      <header>
        <div>
          <span>Bitacora contextual</span>
          <strong>{routeLabel(route)}</strong>
        </div>
        <div className="floating-log-actions">
          <button onClick={() => setLarge(!large)}>{large ? 'Achicar' : 'Agrandar'}</button>
          <button onClick={() => setOpen(false)}>Minimizar</button>
        </div>
      </header>
      <label>
        Tipo de evidencia
        <select value={evidenceType} onChange={(event) => setEvidenceType(event.target.value)}>
          {evidenceTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>
      <label>
        Nota
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Registrar observacion, duda o criterio de analisis."
        />
      </label>
      <button className="save-note" onClick={handleSave}>Guardar registro</button>
      <p>{status || 'No ingresar datos reales de victimas, PSC, domicilios, telefonos, coordenadas, folios ni causas.'}</p>
    </aside>
  );
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [deviceType] = useState(getDeviceType);
  const [visualMode, setVisualMode] = useState(() => {
    const saved = localStorage.getItem(`dmt-visual-mode-${getDeviceType()}`);
    return saved === 'ambar' ? 'ambar' : 'boldo';
  });
  const [done, setDone] = useState(() => {
    const saved = localStorage.getItem('dmt-progress');
    return saved ? JSON.parse(saved) : [];
  });

  const user = session?.user || null;

  useEffect(() => {
    getCurrentSession().then(setSession);
  }, []);

  useEffect(() => {
    function onPopState() {
      setRoute(getRoute());
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    getProfile(user.id).then(setProfile).catch(() => setProfile(null));
    listContextualNotes(user.id).then(setNotes).catch(() => setNotes([]));
  }, [user?.id]);

  function navigate(path) {
    window.history.pushState({}, '', path);
    setRoute(path);
  }

  async function handleLogin(email, password) {
    const nextSession = await signInWithInstitutionalEmail(email, password);
    setSession(nextSession);
    navigate('/home');
  }

  async function handleSignOut() {
    await signOut();
    setSession(null);
    setProfile(null);
    navigate('/login');
  }

  async function reloadNotes() {
    const nextNotes = await listContextualNotes(user?.id);
    setNotes(nextNotes);
  }

  async function updateVisualMode(nextMode) {
    setVisualMode(nextMode);
    await saveVisualPreference({ userId: user?.id, deviceType, visualMode: nextMode });
  }

  if (!user || route === '/login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  let page = <HomePage navigate={navigate} />;
  if (route === '/induccion') page = <InduccionPage done={done} setDone={setDone} />;
  if (route === '/bitacora') page = <BitacoraPage notes={notes} reloadNotes={reloadNotes} />;
  if (route === '/marco-legal') page = <MarcoLegalPage />;
  if (route === '/recursos') page = <RecursosPage />;
  if (route === '/perfil') {
    page = (
      <PerfilPage
        user={user}
        profile={profile}
        deviceType={deviceType}
        visualMode={visualMode}
      />
    );
  }

  return (
    <>
      <AppShell
        route={route}
        navigate={navigate}
        visualMode={visualMode}
        updateVisualMode={updateVisualMode}
        deviceType={deviceType}
        user={user}
        profile={profile}
        onSignOut={handleSignOut}
      >
        {page}
      </AppShell>
      <FloatingLog route={route} user={user} onSaved={reloadNotes} />
    </>
  );
}

export default App;
