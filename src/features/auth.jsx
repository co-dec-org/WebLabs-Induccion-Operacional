import { useState } from 'react';
import { GendarmeriaLogo } from '../components/GendarmeriaLogo.jsx';
import { HomePage } from './pages.jsx';
import { updateInitialPassword } from '../lib/dmtApi.js';
import { baseNavItems, deviceLabels, legalOperationalText } from '../lib/uiConstants.js';
import { getUserDisplayName } from '../lib/uiHelpers.js';

export function LoginPage({ onLogin }) {
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
        <GendarmeriaLogo />
        <nav aria-label="Centro de Formación y Desarrollo">
          <span>Centro de Formación y Desarrollo</span>
        </nav>
      </header>

      <section className="login-content">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-heading">
            <GendarmeriaLogo compact />
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
          <div className="login-legal right-legal">{legalOperationalText}</div>
          <div className="document-figure" aria-hidden="true" />
        </aside>
      </section>

      <footer className="login-footer">
        <GendarmeriaLogo compact />
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

export function PasswordChangePage({ user, profile, onComplete, onSignOut }) {
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

export function ProfileValidationPage({ visualMode, deviceType }) {
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
