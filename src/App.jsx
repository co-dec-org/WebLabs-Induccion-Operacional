import React, { useEffect, useMemo, useState } from 'react';
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
  { path: '/home', label: 'Inicio' },
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

const navIcons = {
  '/home': '⌂',
  '/induccion': '▱',
  '/bitacora': '▣',
  '/marco-legal': '⚖',
  '/recursos': '▤',
  '/perfil': '○',
  '/admin-cuentas': '◎',
  '/admin-contenidos': '✎',
};

const inductionMenu = [
  'Inducción operacional',
  'Rol del operador',
  'Tipos de eventos',
  'Flujo de decisión',
  'Procedimiento general',
  'Comunicación y escalamiento',
  'Lógica operacional general',
  'Registro y trazabilidad',
  'Marco legal-operacional',
  'Protección de datos',
  'Lenguaje y buenas prácticas',
  'Criterios de riesgo',
  'Coordinación interinstitucional',
  'Cierre de inducción',
];

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
  const labels = {
    '/home': 'Inicio',
    '/induccion': 'Inducción Operacional',
    '/bitacora': 'Bitácora de Entrenamiento',
    '/marco-legal': 'Marco Legal',
    '/recursos': 'Recursos',
    '/perfil': 'Perfil',
    '/admin-cuentas': 'Cuentas',
    '/admin-contenidos': 'Editor',
  };
  return labels[path] || 'Login';
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
      <header className="login-header">
        <div className="login-brand">
          <div className="institutional-logo" aria-hidden="true"><span className="logo-shield">G</span></div>
          <div>
            <strong>Gendarmería de Chile</strong>
            <span>Departamento de Monitoreo Telemático</span>
          </div>
        </div>
        <nav aria-label="Centro de formación institucional">
          <span>Centro de Formación y Desarrollo</span>
        </nav>
      </header>

      <section className="login-content">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-heading">
            <div className="institutional-logo large" aria-hidden="true"><span className="logo-shield">G</span></div>
            <p className="section-label">Acceso institucional</p>
            <h1>Web-Lab de Entrenamiento Operacional S.M.T.</h1>
            <h2>Sistema de Monitoreo Telemático</h2>
            <p>Entrenamiento para operadores telemáticos</p>
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
              placeholder="Contraseña enviada al correo institucional"
            />
          </label>

          <label className="remember-row">
            <input type="checkbox" />
            <span>Recordarme en este dispositivo</span>
          </label>

          <button type="submit">Ingresar</button>
          <button type="button" className="forgot-button">
            ¿Olvidaste tu contraseña?
          </button>
          <div className="access-divider"><span>o</span></div>
          <button type="button" className="disabled-access" disabled>
            Otro método de acceso
          </button>
          <p className="form-status">{status || 'Login fijo en vista Boldo.'}</p>
        </form>

        <aside className="login-hero">
          <article>
            <div className="feature-icon">◎</div>
            <div>
              <h3>Acceso a entorno de formación</h3>
              <p>Plataforma educativa para el desarrollo de competencias operacionales.</p>
            </div>
          </article>
          <article>
            <div className="feature-icon">▤</div>
            <div>
              <h3>Material educativo y lectura guiada</h3>
              <p>Recursos diseñados para aprendizaje, práctica y toma de decisiones.</p>
            </div>
          </article>
          <div className="document-figure" aria-hidden="true" />
        </aside>
      </section>

      <footer className="login-footer">
        <span>Gendarmería de Chile</span>
        <span>Departamento de Monitoreo Telemático</span>
        <span>Ley 21.378</span>
        <span>Decreto 19</span>
        <span>Ley 20.066</span>
        <span>Ley 19.968</span>
        <span>Ley 20.603</span>
        <span>Ley 21.719</span>
      </footer>
      <div className="login-legal">{legalOperationalText}</div>
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
    <main className="password-page theme-boldo">
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
    <main className={`app-shell theme-${visualMode} route-${route.replace('/', '') || 'login'}`}>
      <aside className="side-nav">
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
          {visibleNavItems.map((item) => (
            <React.Fragment key={item.path}>
              <button
                className={route === item.path ? 'active' : ''}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{navIcons[item.path]}</span>
                {item.label}
              </button>
              {item.path === '/induccion' && (
                <button className="disabled-nav" disabled>
                  <span className="nav-icon">▷</span>
                  Simulaciones
                </button>
              )}
            </React.Fragment>
          ))}
          {role === 'supervisor' && (
            <button className="disabled-nav" disabled>
              <span className="nav-icon">◇</span>
              Equipo
            </button>
          )}
        </nav>

        <div className="progress-block">
          <div className="help-block">
            <span>Centro de Formación</span>
            <strong>y Desarrollo</strong>
          </div>
          <div className="sidebar-institution">
            <span>Gendarmería de Chile</span>
            <small>Departamento de Monitoreo Telemático</small>
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

function PageTitle({ title }) {
  return (
    <header className="page-title">
      <p>Sistema de Monitoreo Telemático</p>
      <h2>{title}</h2>
    </header>
  );
}

function HomePage({ navigate }) {
  const learningSteps = [
    ['1', 'Comprender el evento', '70% completado'],
    ['2', 'Analizar riesgo', '45% completado'],
    ['3', 'Decidir acción', '25% completado'],
    ['4', 'Registrar evidencia', '10% completado'],
  ];

  return (
    <section className="home-approved">
      <PageTitle title="Inicio" />
      <div className="home-top-grid">
        <article className="approved-panel welcome-panel">
          <div className="circle-icon">▱</div>
          <div>
            <h3>Bienvenido al entorno de formación S.M.T.</h3>
            <strong>Entrenamiento para operadores telemáticos</strong>
            <p>Material educativo, simulaciones operacionales y revisión legal-operacional para formación interna.</p>
          </div>
          <div className="panel-illustration" aria-hidden="true" />
        </article>

        <article className="approved-panel learning-route">
          <h3>Tu ruta de aprendizaje</h3>
          <div className="route-steps">
            {learningSteps.map(([number, title, progress]) => (
              <div className="route-step" key={number}>
                <span>{number}</span>
                <div className="route-icon">▤</div>
                <strong>{title}</strong>
                <small>{progress}</small>
                <i style={{ width: progress.split('%')[0] + '%' }} />
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="home-card-grid">
        <article className="approved-card">
          <div className="circle-icon small">▱</div>
          <h4>Inducción operacional</h4>
          <p>Conoce los fundamentos del Sistema de Monitoreo Telemático, flujos de trabajo y buenas prácticas operativas.</p>
          <button onClick={() => navigate('/induccion')}>Continuar módulo →</button>
        </article>
        <article className="approved-card disabled-card">
          <div className="circle-icon small">▷</div>
          <h4>Simulaciones</h4>
          <p>Práctica con escenarios simulados y retroalimentación para mejorar tu toma de decisiones operacionales.</p>
          <button disabled>No disponible →</button>
        </article>
        <article className="approved-card">
          <div className="circle-icon small">▣</div>
          <h4>Bitácora de entrenamiento</h4>
          <p>Registra tus actividades, evaluaciones y reflexiones para fortalecer tu aprendizaje continuo.</p>
          <button onClick={() => navigate('/bitacora')}>Abrir bitácora →</button>
        </article>
        <article className="approved-card">
          <div className="circle-icon small">⚖</div>
          <h4>Marco legal-operacional</h4>
          <p>Consulta la normativa aplicable y los criterios que sustentan la toma de decisiones operacionales.</p>
          <button onClick={() => navigate('/marco-legal')}>Ver marco legal →</button>
        </article>
      </div>

      <div className="home-bottom-grid">
        <article className="approved-panel evidence-summary">
          <h3>Resumen de tu bitácora</h3>
          <p>Capacidades disponibles para registrar y documentar tus actividades.</p>
          <div>
            {evidenceTypes.map((type) => (
              <span key={type}>{type === 'Audio' ? 'Audio 1 min' : type === 'Video' ? 'Video 30 seg' : type}</span>
            ))}
          </div>
        </article>
        <article className="approved-panel privacy-reminder">
          <div className="circle-icon">✓</div>
          <div>
            <h3>Usar solo casos simulados, anonimizados o autorizados.</h3>
            <p>Protegemos la información y la dignidad de las personas.</p>
          </div>
        </article>
      </div>
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

function WebSlide({ module }) {
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
      <PageTitle title="Inducción Operacional" />
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
          <figure className="slide-frame deck-slide">
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
          <figure>
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

function BitacoraPage({ notes, reloadNotes }) {
  const displayNotes = notes.length
    ? notes
    : [
        {
          id: 'demo-1',
          created_at: 'Hoy 18:42',
          page: 'Inducción',
          context_label: 'Lámina 07 · Lógica operacional general',
          evidence_type: 'Nota',
          note: 'Duda sobre cuándo clasificar, contactar o escalar según continuidad y contexto.',
        },
        {
          id: 'demo-2',
          created_at: 'Hoy 18:15',
          page: 'Inducción',
          context_label: 'Lámina 04 · Principios operacionales',
          evidence_type: 'Captura',
          note: 'Registro de lectura revisado.',
        },
        {
          id: 'demo-3',
          created_at: 'Ayer 21:10',
          page: 'Marco legal',
          context_label: 'Ley 21.378',
          evidence_type: 'Nota',
          note: 'Síntesis revisada.',
        },
      ];
  const selected = displayNotes[0];

  return (
    <section className="bitacora-approved">
      <PageTitle title="Bitácora de Entrenamiento" />
      <article className="summary-strip">
        <div className="circle-icon">▣</div>
        <div>
          <h3>Notas contextuales del operador</h3>
          <p>Registros creados desde la caja flotante según la página, lámina o módulo consultado.</p>
        </div>
        <strong><span>{displayNotes.length}</span> registros</strong>
        <strong><span>5</span> páginas fuente</strong>
        <strong><span>4</span> con evidencia</strong>
        <strong>Última nota:<br />{selected.page} / Lámina 07</strong>
      </article>

      <div className="bitacora-tools">
        <label className="search-box light">
          <input placeholder="Buscar en mis notas" />
        </label>
        {['Todas', 'Inducción', 'Home', 'Marco legal', 'Recursos', 'Bitácora'].map((filter) => (
          <button key={filter} className={filter === 'Todas' ? 'active' : ''}>{filter}</button>
        ))}
        <button className="manual-note" onClick={reloadNotes}>Nueva nota manual</button>
      </div>

      <div className="bitacora-grid">
        <section className="records-panel">
          <h3>Registros capturados</h3>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Página fuente</th>
                <th>Contexto</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {displayNotes.map((note, index) => (
                <tr key={note.id} className={index === 0 ? 'selected' : ''}>
                  <td>{note.created_at?.startsWith('20') ? 'Hoy' : note.created_at || 'Hoy'}</td>
                  <td>{note.page || 'Inducción'}</td>
                  <td>{note.context_label || 'Registro contextual'}</td>
                  <td>{note.evidence_type || 'Nota'}</td>
                  <td><span className={index % 2 === 0 ? 'badge draft' : 'badge reviewed'}>{index % 2 === 0 ? 'Borrador' : 'Revisado'}</span></td>
                  <td><button>Abrir ›</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Mostrando 1 a {displayNotes.length} de {displayNotes.length} registros</p>
        </section>

        <aside className="record-detail">
          <h3>Detalle del registro</h3>
          <strong>{selected.page} / Lámina 07</strong>
          <span>Creado hoy, 18:42</span>
          <label>
            Nota de lectura
            <textarea readOnly value={selected.note || ''} />
          </label>
          <div className="tag-row">
            <span>Nota</span>
            <span>Borrador</span>
            <span>Sin datos reales</span>
          </div>
          <button>Editar nota</button>
          <button>Marcar revisado</button>
          <button>Exportar</button>
        </aside>
      </div>

      <p className="privacy-banner">No ingresar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas ni folios.</p>
    </section>
  );
}

function MarcoLegalPage() {
  const laws = [
    ['Ley 21.378', 'Monitoreo telemático en Ley 20.066 y Ley 19.968', 'Establece el monitoreo telemático como medida cautelar o de protección.'],
    ['Decreto 19', 'Reglamento de la Ley 21.378', 'Aprueba el reglamento que regula la implementación y operación del sistema.'],
    ['Ley 20.066', 'Violencia intrafamiliar y protección de víctimas', 'Define la violencia intrafamiliar y establece medidas de protección y sanción.'],
    ['Ley 19.968', 'Tribunales de Familia y medidas cautelares', 'Regula competencia, procedimientos y medidas cautelares en familia.'],
    ['Ley 20.603', 'Penas sustitutivas y reforma penal', 'Modifica el sistema de penas y establece penas sustitutivas y medidas alternativas.'],
    ['Ley 21.719', 'Protección de datos personales', 'Regula el tratamiento y protección de datos personales en el sector público.'],
  ];

  return (
    <section className="legal-approved">
      <PageTitle title="Marco Legal" />
      <div className="legal-grid">
        <section>
          <article className="approved-panel legal-hero">
            <div className="circle-icon">⚖</div>
            <div>
              <h3>Base normativa del Sistema de Monitoreo Telemático</h3>
              <p>Consulta guiada del marco legal-operacional aplicable a formación, protección de víctimas, medidas cautelares, monitoreo telemático y tratamiento responsable de datos.</p>
            </div>
          </article>
          <label className="wide-search">
            <input placeholder="Buscar norma o concepto" />
            <button>Filtrar</button>
          </label>
          <div className="law-list">
            {laws.map(([title, summary, body], index) => (
              <article key={title}>
                <span>{index + 1}</span>
                <div>
                  <strong>{title} — {summary}</strong>
                  <p>{body}</p>
                </div>
                <button>Ver síntesis ↗</button>
              </article>
            ))}
          </div>
        </section>
        <aside className="legal-side">
          <article className="approved-panel">
            <h3>Lectura operacional</h3>
            <div className="side-row"><span>♢</span><p><strong>Finalidad protectora</strong>El marco legal tiene como fin la protección integral de las víctimas.</p></div>
            <div className="side-row"><span>◎</span><p><strong>Criterio de actuación</strong>Actuar con proporcionalidad, oportunidad y respeto a procedimientos vigentes.</p></div>
            <div className="side-row"><span>▣</span><p><strong>Trazabilidad y datos</strong>Registrar con trazabilidad mínima y proteger la información conforme a la ley.</p></div>
          </article>
          <article className="approved-panel">
            <h3>Relación normativa</h3>
            <div className="norm-flow"><span>Ley</span><b>→</b><span>Reglamento</span><b>→</b><span>Protocolo</span><b>→</b><span>Operador</span></div>
          </article>
          <article className="approved-panel privacy-callout">No usar esta web para ingresar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas ni folios.</article>
        </aside>
      </div>
      <p className="privacy-banner">Material educativo · No reemplaza instrucciones oficiales ni sistemas institucionales.</p>
    </section>
  );
}

function RecursosPage() {
  const resources = [
    ['Láminas de inducción', '14 módulos aprobados', 'Abrir'],
    ['Plantillas de registro', 'Textos de entrenamiento para notas operacionales', 'Ver plantillas'],
    ['Glosario S.M.T.', 'Conceptos: trazo válido, zona de exclusión, CENCO, PSC', 'Consultar'],
    ['Marco legal resumido', 'Ley 21.378, Decreto 19 y normas asociadas', 'Revisar'],
    ['Guía de privacidad', 'Uso de datos simulados, anonimizados o autorizados', 'Leer'],
    ['Material de apoyo', 'Recursos complementarios para capacitación', 'Explorar'],
  ];

  return (
    <section className="resources-approved">
      <PageTitle title="Recursos" />
      <div className="resources-grid">
        <section>
          <article className="approved-panel legal-hero">
            <div className="circle-icon">▤</div>
            <div>
              <h3>Biblioteca de apoyo para la formación S.M.T.</h3>
              <p>Materiales de consulta, plantillas y documentos de apoyo para reforzar criterio legal-operacional y trazabilidad educativa.</p>
            </div>
          </article>
          <label className="wide-search">
            <input placeholder="Buscar recurso o concepto" />
          </label>
          <div className="filter-row">
            {['Todos', 'Láminas', 'Protocolos', 'Plantillas', 'Glosario', 'Documentos', 'Enlaces'].map((filter) => (
              <button key={filter} className={filter === 'Todos' ? 'active' : ''}>{filter}</button>
            ))}
          </div>
          <div className="resource-grid">
            {resources.map(([title, body, action]) => (
              <article key={title} className="approved-card">
                <div className="circle-icon small">▤</div>
                <h4>{title}</h4>
                <p>{body}</p>
                <button>{action} ›</button>
              </article>
            ))}
          </div>
        </section>
        <aside className="legal-side">
          <article className="approved-panel">
            <h3>Uso recomendado</h3>
            <div className="side-row"><span>▤</span><p><strong>Consulta durante lectura</strong>Accede a contenidos clave mientras avanzas en la inducción.</p></div>
            <div className="side-row"><span>▣</span><p><strong>Apoyo para bitácora</strong>Usa plantillas y guías para registrar tus notas.</p></div>
            <div className="side-row"><span>♢</span><p><strong>Material autorizado</strong>Todo el material disponible está validado para uso formativo institucional.</p></div>
          </article>
          <article className="approved-panel selected-resource">
            <h3>Recurso seleccionado</h3>
            <strong>Láminas de inducción</strong>
            <p>14 módulos aprobados</p>
            <dl><dt>Tipo</dt><dd>Presentación</dd><dt>Estado</dt><dd>Aprobado</dd><dt>Última revisión</dt><dd>15/05/2025</dd></dl>
          </article>
          <article className="approved-panel privacy-callout">No subir ni registrar capturas reales identificables de Tracker, IFT u otros sistemas oficiales.</article>
        </aside>
      </div>
    </section>
  );
}

function PerfilPage({ user, profile, deviceType, visualMode }) {
  const role = getRole(profile);
  const displayName = getUserDisplayName(user, profile);

  return (
    <section className="profile-approved">
      <PageTitle title="Perfil" />
      <div className="profile-grid">
        <section>
          <article className="approved-panel profile-card">
            <div className="circle-icon profile-avatar">○</div>
            <div>
              <h3>{displayName}</h3>
              <p>Operador en formación</p>
              <p>{profile?.department || 'Departamento de Monitoreo Telemático'}</p>
              <p>Correo institucional: {user?.email || 'usuario@gendarmeria.cl'}</p>
            </div>
            <span className="profile-shield">✓</span>
          </article>

          <h3 className="section-heading">Preferencias de sesión</h3>
          <div className="profile-card-grid">
            <article className="approved-card compact">
              <h4>Vista por dispositivo</h4>
              <p>Desktop <span>{visualMode}</span></p>
              <p>Tablet <span>Boldo</span></p>
              <p>Phone <span>Boldo</span></p>
            </article>
            <article className="approved-card compact">
              <h4>Recordarme en este dispositivo</h4>
              <p>Mantener sesión activa en este equipo de forma segura.</p>
              <b className="toggle-on" />
            </article>
            <article className="approved-card compact">
              <h4>Última sesión visual</h4>
              <p>Hoy, 18:42</p>
              <p>{deviceLabels[deviceType]} · {visualMode}</p>
            </article>
          </div>

          <h3 className="section-heading">Avance formativo</h3>
          <div className="profile-card-grid">
            <article className="approved-card compact"><h4>Inducción</h4><p>4/14 láminas revisadas</p><progress value="29" max="100" /></article>
            <article className="approved-card compact"><h4>Bitácora</h4><p>12 notas contextuales</p><progress value="60" max="100" /></article>
            <article className="approved-card compact"><h4>Marco legal</h4><p>3 síntesis revisadas</p><progress value="50" max="100" /></article>
          </div>

          <div className="profile-card-grid bottom">
            <article className="approved-panel privacy-callout">No ingresar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas ni folios.</article>
            <article className="approved-panel account-actions">
              <h3>Acciones de cuenta</h3>
              <button>Cambiar contraseña enviada al correo institucional</button>
              <button>Cerrar sesión</button>
            </article>
          </div>
        </section>

        <aside className="legal-side">
          <article className="approved-panel activity-panel">
            <h3>Resumen de actividad</h3>
            {['Inducción / Lámina 07', 'Marco legal', 'Recursos'].map((item, index) => (
              <div className="side-row" key={item}>
                <span>{index === 0 ? '▤' : index === 1 ? '⚖' : '▱'}</span>
                <p><strong>{item}</strong>{index === 0 ? 'Nota creada · Hoy, 18:42' : index === 1 ? 'Síntesis revisada · Hoy, 16:10' : 'Plantilla consultada · Ayer, 21:35'}</p>
              </div>
            ))}
            <button>Ver toda la actividad →</button>
          </article>
          <article className="approved-panel">
            <h3>Consejo de uso</h3>
            <div className="side-row"><span>●</span><p>Usa la Bitácora para registrar notas contextuales desde cualquier página. Te ayudará a consolidar tu criterio operacional.</p></div>
          </article>
        </aside>
      </div>
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
  const [position, setPosition] = useState(null);
  const dragRef = useMemo(() => ({ current: null }), []);

  function getPanelStyle() {
    if (!position) return {};
    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
      right: 'auto',
      bottom: 'auto',
    };
  }

  function beginDrag(event) {
    if (event.button !== undefined && event.button !== 0) return;
    const rect = event.currentTarget.closest('.floating-log')?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function moveDrag(event) {
    if (!dragRef.current) return;
    const width = large ? 440 : 340;
    const height = open ? (large ? 460 : 360) : 74;
    const x = Math.min(Math.max(16, event.clientX - dragRef.current.offsetX), window.innerWidth - width - 16);
    const y = Math.min(Math.max(16, event.clientY - dragRef.current.offsetY), window.innerHeight - height - 16);
    setPosition({ x, y });
  }

  function endDrag(event) {
    dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

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
      <aside className="floating-log collapsed" style={getPanelStyle()}>
        <button
          className="floating-log-launcher"
          onClick={() => setOpen(true)}
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          title="Arrastrar para mover. Clic para abrir notas."
        >
          Notas
        </button>
      </aside>
    );
  }

  return (
    <aside className={`floating-log ${large ? 'large' : 'compact'}`} style={getPanelStyle()}>
      <header
        className="floating-log-drag-handle"
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        title="Arrastrar panel de notas"
      >
        <div>
          <span>Notas contextuales</span>
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
      <button className="save-note" onClick={handleSave}>Guardar nota</button>
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
    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem('dmt-progress');
      return [];
    }
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
