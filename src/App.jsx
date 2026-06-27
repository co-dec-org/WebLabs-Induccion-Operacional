import React from 'react';
import { useEffect, useState } from 'react';
import { canAccessPage, getPageKeyFromPath, pageStatus } from './app/system-map/systemMap.js';
import { AppShell } from './components/AppShell.jsx';
import { FloatingLog } from './components/FloatingLog.jsx';
import { EditablePage } from './components/blocks.jsx';
import { DisabledPage, RestrictedPage } from './components/gates.jsx';
import { AdminAccountsPage, AdminContentPage } from './features/admin.jsx';
import { LoginPage, PasswordChangePage, ProfileValidationPage } from './features/auth.jsx';
import { InduccionPage } from './features/induccion.jsx';
import { SupervisionPage } from './features/supervision.jsx';
import { BitacoraPage, HomePage, MarcoLegalPage, PerfilPage, RecursosPage } from './features/pages.jsx';
import { getCurrentSession, getProfile, listContextualNotes, saveVisualPreference, signInWithInstitutionalEmail, signOut } from './lib/dmtApi.js';
import { getDeviceType, getRole, getRoute } from './lib/uiHelpers.js';
import { trackLeave, trackView } from './lib/navTrace.js';

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

  // Telemetría de navegación ANÓNIMA (Ley 21.719: sin PII). Best-effort: si falla,
  // nunca afecta la UI. Registra 'leave' de la ruta previa y 'view' de la nueva.
  const navPrevRouteRef = React.useRef(null);
  const navEnterAtRef = React.useRef(Date.now());

  useEffect(() => {
    if (!user || route === '/login') return;
    const ctx = { deviceType, theme: visualMode, role };
    const prev = navPrevRouteRef.current;
    const now = Date.now();
    if (prev && prev !== route) {
      trackLeave({ route: prev, durationMs: now - navEnterAtRef.current, ...ctx });
    }
    trackView({ route, referrerRoute: prev, ...ctx });
    navPrevRouteRef.current = route;
    navEnterAtRef.current = now;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, user]);

  useEffect(() => {
    function onUnload() {
      if (!user || !navPrevRouteRef.current) return;
      trackLeave({
        route: navPrevRouteRef.current,
        durationMs: Date.now() - navEnterAtRef.current,
        deviceType,
        theme: visualMode,
        role,
      });
    }
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, visualMode, role, deviceType]);

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
  if (route === '/home') page = <EditablePage pageKey="inicio" fallback={<HomePage navigate={navigate} />} />;
  if (route === '/induccion') page = <InduccionPage done={done} setDone={setDone} />;
  if (route === '/bitacora') page = <EditablePage pageKey="bitacora" fallback={<BitacoraPage notes={notes} reloadNotes={reloadNotes} />} />;
  if (route === '/marco-legal') page = <EditablePage pageKey="marco_legal" fallback={<MarcoLegalPage />} />;
  if (route === '/recursos') page = <EditablePage pageKey="recursos" fallback={<RecursosPage />} />;
  if (route === '/perfil') {
    page = (
      <EditablePage
        pageKey="perfil"
        fallback={
          <PerfilPage user={user} profile={profile} deviceType={deviceType} visualMode={visualMode} />
        }
      />
    );
  }
  if (route === '/admin-cuentas') page = <AdminAccountsPage />;
  if (route === '/admin-contenidos') page = <AdminContentPage user={user} />;
  if (route === '/supervision') page = <SupervisionPage visualMode={visualMode} />;

  // Gates sistemáticos (la sesión ya se validó arriba):
  //  - PageStatusGate: una página 'disabled' no es accesible ni por URL directa.
  //  - RoleGate: el rol debe figurar en pageAccess de esa página.
  const currentPageKey = getPageKeyFromPath(route);
  if (currentPageKey && pageStatus[currentPageKey] === 'disabled') {
    page = <DisabledPage pageKey={currentPageKey} navigate={navigate} />;
  } else if (currentPageKey && !canAccessPage(role, currentPageKey)) {
    page = <RestrictedPage />;
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
      {route !== '/admin-contenidos' && route !== '/admin-cuentas' && (
        <FloatingLog route={route} user={user} onSaved={reloadNotes} />
      )}
    </>
  );
}

export default App;
