# Changelog

Registro de cambios relevantes del proyecto Web-Labs Inducción Operacional.

## [v0.1-web-labs-funcional] - 2026-06-19

### Agregado

- Versión funcional inicial respaldada mediante release/tag.
- Rama de trabajo creada: feature/architecture-system-map.
- Carpeta oficial de mockups creada en docs/mockups/.
- Mockups oficiales cargados como referencia visual.
- Documentación base creada:
  - ARCHITECTURE.md
  - SYSTEM_MAP.md
  - ROLES_RLS.md
  - DESIGN_SYSTEM.md
  - MOCKUPS.md
  - QA_VISUAL.md
  - MIGRATION_PLAN.md
  - DECISION_LOG.md
  - CHANGELOG.md
- System Map inicial creado en src/app/system-map/systemMap.js.

### Definido

- Roles oficiales:
  - operador
  - supervisor
  - admin
- Estados de página:
  - enabled
  - disabled
  - coming_soon
  - hidden
  - draft
  - archived
- Simulaciones queda visible, pero deshabilitada en v0.1.
- Mockups oficiales quedan como referencia de QA, no como imágenes estáticas productivas.
- Tema Boldo debe ser monótono, institucional y sin acentos ámbar.
- Tema Ámbar queda reservado para laboratorio y entrenamiento.

### Seguridad y criterio legal-operacional

- La plataforma se define como entorno formativo.
- No debe registrar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas, folios, causas ni antecedentes identificables.
- La navegación visual no reemplaza permisos reales ni RLS en Supabase.
