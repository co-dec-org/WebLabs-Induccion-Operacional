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
  updateInitialPassword,
} from './lib/dmtApi.js';

const baseNavItems = [
  { path: '/home', label: 'Home' },
  { path: '/induccion', label: 'Inducción' },
  { path: '/bitacora', label: 'Bitácora' },
  { path: '/marco-legal', label: 'Marco legal' },
  { path: '/recursos', label: 'Recursos' },
  { path: '/perfil', label: 'Perfil' },
];

const adminNavItems = [
  { path: '/admin-cuentas', label: 'Cuentas' },
  { path: '/admin-contenidos', label: 'Editor' },
];

const allNavItems = [...baseNavItems, ...adminNavItems];

const legalOperationalText =
  'Criterio legal-operacional: antes de producción se debe asegurar RLS, mínimo dato personal y prohibición de registrar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas, folios o causas, conforme Ley 21.719 y marco de monitoreo telemático.';

const evidenceTypes = ['Texto', 'Captura', 'Audio', 'Video', 'Adjunto'];
const deviceLabels = { desktop: 'Desktop', tablet: 'Tablet', phone: 'Phone' };
const roleLabels = {
  admin: 'Admin',
  supervisor: 'Supervisor',
  operador: 'Operador',
};

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
  return allNavItems.find((item) => item.path === path)?.label || 'Login';
}

function slidePath(number) {
  return `/slides/slide-${String(number).padStart(2, '0')}.png`;
}

function getUserDisplayName(user, profile) {
  if (profile?.full_name) return profile.full_name;
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
  return 'Juan González Tapia';
}

function getRole(profile) {
  return ['admin', 'supervisor', 'operador'].includes(profile?.role) ? profile.role : 'operador';
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
      setStatus(error.message || 'No fue posible iniciar sesión.');
    }
  }

  return (
    <main className="login-page theme-boldo">
      <section className="login-hero">
        <p>Departamento de Monitoreo Telemático</p>
        <h1>Sistema de Monitoreo Telemático</h1>
        <h2>Entrenamiento para operadores telemáticos</h2>
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
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Contraseña enviada a su correo"
          />
        </label>

        <button type="submit">Ingresar</button>
        <button type="button" className="disabled-access" disabled>
          Otro método de acceso
        </button>
        <p className="form-status">{status || 'Login fijo en vista Boldo.'}</p>
      </form>
    </main>
  );
}

function PasswordChangePage({ user, profile, onComplete, onSignOut }) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 10) {
      setStatus('La nueva contraseña debe tener al menos 10 caracteres.');
      return;
    }

    if (password !== confirmation) {
      setStatus('Las contraseñas ingresadas no coinciden.');
      return;
    }

    try {
      setStatus('Actualizando contraseña...');
      await updateInitialPassword(password);
      onComplete();
    } catch (error) {
      setStatus(error.message || 'No fue posible actualizar la contraseña.');
    }
  }

  return (
    <main className="login-page theme-boldo">
      <section className="login-hero">
        <p>Primer acceso institucional</p>
        <h1>Actualice su contraseña</h1>
        <h2>Antes de ingresar al Home, debe definir una contraseña personal.</h2>
        <div className="login-legal">
          Por seguridad, la clave inicial solo habilita el primer acceso. Después del cambio,
          el usuario ingresa con su contraseña personal. No registre claves en Bitácora ni en
          notas de entrenamiento.
        </div>
      </section>

      <form className="login-card" onSubmit={handleSubmit}>
        <div>
          <p className="section-label">Cambio obligatorio</p>
          <h3>{getUserDisplayName(user, profile)}</h3>
        </div>

        <label>
          Nueva contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mínimo 10 caracteres"
            required
          />
        </label>

        <label>
          Confirmar contraseña
          <input
            type="password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="Repita la nueva contraseña"
            required
          />
        </label>

        <button type="submit">Guardar nueva contraseña</button>
        <button type="button" className="disabled-access" onClick={onSignOut}>
          Salir
        </button>
        <p className="form-status">{status || 'Esta capa aparece solo en el primer acceso.'}</p>
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
  const role = getRole(profile);
  const visibleNavItems = role === 'admin' ? [...baseNavItems, ...adminNavItems] : baseNavItems;

  return (
    <main className={`app-shell theme-${visualMode}`}>
      <aside className="side-nav">
        <div className="brand-block">
          <div className="crest">G</div>
          <div>
            <p>Departamento de Monitoreo Telemático</p>
            <h1>Web-Lab S.M.T.</h1>
          </div>
        </div>

        <nav className="primary-nav" aria-label="Navegación principal">
          {visibleNavItems.map((item) => (
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
          {role === 'supervisor' && (
            <button className="disabled-nav" disabled>
              Equipo
            </button>
          )}
        </nav>

        <div className="progress-block">
          <div>
            <span>Supabase</span>
            <strong>{isSupabaseConfigured ? 'OK' : 'Local'}</strong>
          </div>
          <p>Ambiente V1 con resguardo de datos y bitácora contextual.</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="top-bar">
          <div>
            <p>Sistema de Monitoreo Telemático</p>
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
              Ámbar
            </button>
          </div>

          <div className="user-chip">{displayName} · {roleLabels[role]}</div>
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
        <h3>Entrenamiento del operador telemático</h3>
        <p>
          La web-lab organiza lectura, avance y bitácora contextual para entrenar criterio
          operativo sin registrar datos sensibles reales.
        </p>
        <div className="action-row">
          <button onClick={() => navigate('/induccion')}>Continuar inducción</button>
          <button className="secondary" onClick={() => navigate('/marco-legal')}>
            Revisar marco legal
          </button>
        </div>
      </article>

      <article className="status-card">
        <span>14</span>
        <strong>Láminas disponibles</strong>
        <p>Contenido aprobado para lectura web y modo presentación.</p>
      </article>
      <article className="status-card">
        <span>Global</span>
        <strong>Bitácora contextual</strong>
        <p>Registra notas según página, módulo o lámina.</p>
      </article>
      <article className="status-card disabled-card">
        <span>Inhabilitado</span>
        <strong>Simulaciones</strong>
        <p>Módulo reservado para una etapa posterior.</p>
      </article>
    </section>
  );
}

function ProfileValidationPage({ visualMode, deviceType }) {
  return (
    <main className={`app-shell theme-${visualMode} validation-shell`}>
      <aside className="side-nav" aria-hidden="true">
        <div className="brand-block">
          <div className="crest">G</div>
          <div>
            <p>Departamento de Monitoreo Telemático</p>
            <h1>Web-Lab S.M.T.</h1>
          </div>
        </div>

        <nav className="primary-nav">
          {baseNavItems.map((item) => (
            <button key={item.path} className={item.path === '/home' ? 'active' : ''}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="top-bar" aria-hidden="true">
          <div>
            <p>Sistema de Monitoreo Telemático</p>
            <h2>Home</h2>
          </div>
          <div className="view-switch">
            <span>{deviceLabels[deviceType]}</span>
            <button className={visualMode === 'boldo' ? 'active' : ''}>Boldo</button>
            <button className={visualMode === 'ambar' ? 'active' : ''}>Ámbar</button>
          </div>
          <div className="user-chip">Validando usuario</div>
        </header>

        <div className="validation-home-backdrop" aria-hidden="true">
          <HomePage navigate={() => {}} />
        </div>

        <section className="validation-overlay" role="status" aria-live="polite">
          <p className="section-label">Acceso institucional</p>
          <h3>Validando perfil</h3>
          <p>Estamos verificando rol y estado de primer acceso antes de entrar al Home.</p>
        </section>
      </section>
    </main>
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
            Buscar lámina
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Concepto o módulo"
            />
          </label>
          <nav className="module-list" aria-label="Módulos de inducción">
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
            <span>Lámina {String(activeModule.number).padStart(2, '0')} de 14</span>
            <strong>{activeModule.title}</strong>
            <button className="presentation-button" onClick={() => setIsPresentationOpen(true)}>
              Modo presentación
            </button>
          </div>
          <figure className="slide-frame deck-slide">
            <img src={slidePath(activeModule.number)} alt={`Lámina ${activeModule.number}`} />
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
          <figure>
            <img src={slidePath(activeModule.number)} alt={`Lámina ${activeModule.number}`} />
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
        <p className="section-label">Bitácora de entrenamiento</p>
        <h3>Registros hechos desde la web</h3>
        <p>
          Consolida notas creadas desde capacitaciones, inducción y el resto de la web para
          facilitar análisis posterior.
        </p>
        <button onClick={reloadNotes}>Actualizar registros</button>
      </article>

      <section className="log-list-panel">
        {notes.length === 0 ? (
          <p className="empty-state">Sin registros aún.</p>
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
    ['Ley 21.378', 'Establece monitoreo telemático en Ley 20.066 y Ley 19.968.'],
    ['Decreto 19', 'Reglamento aplicable al monitoreo telemático en VIF y familia.'],
    ['Ley 20.066', 'Marco para prevenir, sancionar y erradicar violencia intrafamiliar.'],
    ['Ley 19.968', 'Tribunales de Familia, medidas cautelares y tramitación.'],
    ['Ley 20.603', 'Sistema de penas sustitutivas y control telemático penal.'],
    ['Ley 21.719', 'Protección de datos personales y minimización de tratamiento.'],
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
        <p>Láminas, plantillas de texto y criterios de uso para entrenamiento.</p>
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
  const role = getRole(profile);

  return (
    <section className="page-grid two-columns">
      <article className="hero-panel">
        <p className="section-label">Perfil</p>
        <h3>{getUserDisplayName(user, profile)}</h3>
        <p>{user?.email || 'usuario@gendarmeria.cl'}</p>
      </article>
      <article className="status-card">
        <span>Departamento</span>
        <strong>{profile?.department || 'Departamento de Monitoreo Telemático'}</strong>
      </article>
      <article className="status-card">
        <span>Rol V1</span>
        <strong>{roleLabels[role]}</strong>
      </article>
      <article className="status-card">
        <span>Preferencia visual</span>
        <strong>{deviceLabels[deviceType]} · {visualMode}</strong>
      </article>
    </section>
  );
}

function AdminAccountsPage() {
  return (
    <section className="page-grid">
      <article className="hero-panel">
        <p className="section-label">Admin · Cuentas</p>
        <h3>Administración de accesos</h3>
        <p>
          Módulo reservado para enrolamiento, actualización de perfiles y solicitudes de reset
          de acceso institucional.
        </p>
      </article>
      <article className="status-card">
        <span>Perfiles V1</span>
        <strong>Admin · Supervisor · Operador</strong>
        <p>Los permisos se aplican mediante Supabase Auth, perfiles y RLS.</p>
      </article>
      <article className="status-card">
        <span>Reset de acceso</span>
        <strong>Requiere flujo seguro</strong>
        <p>
          No se debe exponer `service_role` en el frontend. El reset debe ejecutarse desde
          Supabase Dashboard o desde una función backend protegida.
        </p>
      </article>
      <article className="status-card">
        <span>Dato mínimo</span>
        <strong>Correo institucional y rol</strong>
        <p>No registrar datos reales de víctimas, PSC, causas, folios ni ubicaciones.</p>
      </article>
    </section>
  );
}

function AdminContentPage() {
  return (
    <section className="page-grid two-columns">
      <article className="hero-panel">
        <p className="section-label">Admin · Editor</p>
        <h3>Textos de láminas</h3>
        <p>
          Módulo para revisar y actualizar textos pedagógicos asociados a cada lámina. Las
          imágenes aprobadas se mantienen como fuente visual; los textos editables viven en
          Supabase.
        </p>
      </article>
      <section className="resource-list">
        {modules.map((module) => (
          <article key={module.number}>
            <span>Lámina {String(module.number).padStart(2, '0')}</span>
            <strong>{module.title}</strong>
            <p>{module.objective}</p>
          </article>
        ))}
      </section>
    </section>
  );
}

function RestrictedPage() {
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
          Bitácora
        </button>
      </aside>
    );
  }

  return (
    <aside className={`floating-log ${large ? 'large' : 'compact'}`}>
      <header>
        <div>
          <span>Bitácora contextual</span>
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
          placeholder="Registrar observación, duda o criterio de análisis."
        />
      </label>
      <button className="save-note" onClick={handleSave}>Guardar registro</button>
      <p>{status || 'No ingresar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas, folios ni causas.'}</p>
    </aside>
  );
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
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
  const role = getRole(profile);

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
    if (!user?.id) {
      setProfileLoaded(true);
      return;
    }

    setProfileLoaded(false);
    getProfile(user.id)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setProfileLoaded(true));
    listContextualNotes(user.id).then(setNotes).catch(() => setNotes([]));
  }, [user?.id]);

  function navigate(path) {
    window.history.pushState({}, '', path);
    setRoute(path);
  }

  async function handleLogin(email, password) {
    const nextSession = await signInWithInstitutionalEmail(email, password);
    setSession(nextSession);
    if (nextSession?.user?.id) {
      setProfileLoaded(false);
      getProfile(nextSession.user.id)
        .then(setProfile)
        .catch(() => setProfile(null))
        .finally(() => setProfileLoaded(true));
    }
    navigate('/home');
  }

  async function handleSignOut() {
    await signOut();
    setSession(null);
    setProfile(null);
    setProfileLoaded(false);
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

  if (!profileLoaded) {
    return <ProfileValidationPage visualMode={visualMode} deviceType={deviceType} />;
  }

  if (profile?.must_change_password) {
    return (
      <PasswordChangePage
        user={user}
        profile={profile}
        onSignOut={handleSignOut}
        onComplete={() => {
          setProfile({ ...profile, must_change_password: false });
          navigate('/home');
        }}
      />
    );
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
  if (route === '/admin-cuentas') {
    page = role === 'admin' ? <AdminAccountsPage /> : <RestrictedPage />;
  }
  if (route === '/admin-contenidos') {
    page = role === 'admin' ? <AdminContentPage /> : <RestrictedPage />;
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
