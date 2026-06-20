export const roles = ['operador', 'supervisor', 'admin'];

export const pageStatus = {
  login: 'enabled',
  inicio: 'enabled',
  induccion: 'enabled',
  bitacora: 'enabled',
  marco_legal: 'enabled',
  recursos: 'enabled',
  perfil: 'enabled',
  simulaciones: 'disabled',
  supervision: 'disabled',
  admin: 'enabled',
  editor_visual: 'enabled',
};

export const pageRoutes = {
  login: '/login',
  inicio: '/home',
  induccion: '/induccion',
  bitacora: '/bitacora',
  marco_legal: '/marco-legal',
  recursos: '/recursos',
  perfil: '/perfil',
  simulaciones: '/simulaciones',
  supervision: '/supervision',
  admin: '/admin-cuentas',
  editor_visual: '/admin-contenidos',
};

export const pageAliases = {
  admin: ['/admin'],
  editor_visual: ['/admin/editor-visual'],
};

export const pageLabels = {
  login: 'Login',
  inicio: 'Inicio',
  induccion: 'Inducción',
  bitacora: 'Bitácora',
  marco_legal: 'Marco legal',
  recursos: 'Recursos',
  perfil: 'Perfil',
  simulaciones: 'Simulaciones',
  supervision: 'Equipo',
  admin: 'Cuentas',
  editor_visual: 'Editor',
};

export const pageIcons = {
  inicio: '⌂',
  induccion: '▱',
  bitacora: '▣',
  marco_legal: '⚖',
  recursos: '▤',
  perfil: '○',
  simulaciones: '▷',
  supervision: '◇',
  admin: '◎',
  editor_visual: '✎',
};

export const navigationByRole = {
  operador: [
    'inicio',
    'induccion',
    'bitacora',
    'marco_legal',
    'recursos',
    'perfil',
    'simulaciones',
  ],
  supervisor: [
    'inicio',
    'induccion',
    'bitacora',
    'marco_legal',
    'recursos',
    'perfil',
    'simulaciones',
    'supervision',
  ],
  admin: [
    'inicio',
    'induccion',
    'bitacora',
    'marco_legal',
    'recursos',
    'perfil',
    'supervision',
    'admin',
    'editor_visual',
    'simulaciones',
  ],
};

export const pageAccess = {
  login: roles,
  inicio: roles,
  induccion: roles,
  bitacora: roles,
  marco_legal: roles,
  recursos: roles,
  perfil: roles,
  simulaciones: roles,
  supervision: ['supervisor', 'admin'],
  admin: ['admin'],
  editor_visual: ['admin'],
};

export const disabledPageMessage = {
  simulaciones:
    'Funcionalidad no disponible en esta versión. Módulo proyectado para una etapa posterior de entrenamiento operacional.',
  supervision:
    'Módulo de supervisión proyectado para una etapa posterior.',
};

export function normalizeRole(role) {
  return roles.includes(role) ? role : 'operador';
}

export function getPageKeyFromPath(path) {
  const directMatch = Object.entries(pageRoutes).find(
    ([, route]) => route === path,
  );

  if (directMatch) return directMatch[0];

  const aliasMatch = Object.entries(pageAliases).find(([, aliases]) =>
    aliases.includes(path),
  );

  return aliasMatch?.[0] || null;
}

export function getPageLabelFromPath(path) {
  const pageKey = getPageKeyFromPath(path);
  return pageKey ? pageLabels[pageKey] : 'Página no encontrada';
}

export function canAccessPage(role, pageKey) {
  const normalizedRole = normalizeRole(role);
  return pageAccess[pageKey]?.includes(normalizedRole) || false;
}

export function getNavigationForRole(role) {
  const normalizedRole = normalizeRole(role);

  return navigationByRole[normalizedRole].map((pageKey) => ({
    key: pageKey,
    path: pageRoutes[pageKey],
    label: pageLabels[pageKey],
    icon: pageIcons[pageKey],
    status: pageStatus[pageKey],
  }));
}
