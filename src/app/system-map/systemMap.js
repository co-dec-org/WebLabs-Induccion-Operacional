export const roles = ["operador", "supervisor", "admin"];

export const pageStatus = {
  inicio: "enabled",
  induccion: "enabled",
  simulaciones: "disabled",
  marco_legal: "enabled",
  recursos: "enabled",
  bitacora: "enabled",
  perfil: "enabled",
  supervision: "enabled",
  admin: "enabled",
  editor_visual: "draft"
};

export const navigationByRole = {
  operador: [
    "inicio",
    "induccion",
    "simulaciones",
    "marco_legal",
    "recursos",
    "bitacora",
    "perfil"
  ],
  supervisor: [
    "inicio",
    "induccion",
    "simulaciones",
    "marco_legal",
    "recursos",
    "bitacora",
    "perfil",
    "supervision"
  ],
  admin: [
    "inicio",
    "induccion",
    "simulaciones",
    "marco_legal",
    "recursos",
    "bitacora",
    "perfil",
    "supervision",
    "admin",
    "editor_visual"
  ]
};

export const pageRoutes = {
  inicio: "/home",
  induccion: "/induccion",
  simulaciones: "/simulaciones",
  marco_legal: "/marco-legal",
  recursos: "/recursos",
  bitacora: "/bitacora",
  perfil: "/perfil",
  supervision: "/supervision",
  admin: "/admin",
  editor_visual: "/admin/editor-visual"
};

export const disabledPageMessage = {
  simulaciones:
    "Funcionalidad no disponible en esta versión. Módulo proyectado para una etapa posterior de entrenamiento operacional."
};
