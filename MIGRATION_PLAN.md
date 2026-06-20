# Migration Plan

Este documento define el plan de migración técnica para evolucionar Web-Labs Inducción Operacional sin romper la versión funcional actual.

## Principio general

La migración debe realizarse por fases, manteniendo siempre una versión funcional respaldada y desplegable.

La rama de trabajo para esta etapa es:

feature/architecture-system-map

## Fase 1: Auditoría técnica y respaldo

Objetivos:

- congelar versión funcional actual;
- crear release/tag de respaldo;
- crear rama de arquitectura;
- cargar mockups oficiales;
- crear documentación base.

Estado: en ejecución.

## Fase 2: System Map

Objetivos:

- centralizar roles;
- centralizar rutas;
- centralizar navegación;
- centralizar estados de página;
- definir reglas de acceso por rol;
- dejar Simulaciones como página visible, pero deshabilitada.

Archivo inicial:

src/app/system-map/systemMap.js

## Fase 3: Refactor de rutas y navegación

Objetivos:

- evitar navegación manual duplicada;
- derivar menú desde System Map;
- proteger rutas según rol;
- proteger rutas según estado de página;
- impedir acceso directo por URL a páginas no autorizadas.

Componentes sugeridos:

- ProtectedRoute
- RoleGate
- PageStatusGate
- DisabledPageNotice

## Fase 4: Separación de componentes

Objetivos:

- reducir concentración en App.jsx;
- separar layout institucional;
- separar componentes comunes;
- separar páginas por feature.

Estructura sugerida:

src/components/
src/features/
src/app/
src/lib/
src/styles/

## Fase 5: Sistema de diseño

Objetivos:

- separar tokens visuales;
- separar temas Boldo y Ámbar;
- asegurar Boldo monótono;
- asegurar responsive;
- mantener consistencia con mockups oficiales.

Archivos sugeridos:

- tokens.css
- themes.css
- responsive.css
- components.css

## Fase 6: Supabase y RLS

Objetivos:

- revisar tablas existentes;
- validar políticas RLS;
- asegurar que ningún dato quede público;
- separar permisos de operador, supervisor y admin;
- proteger notas, perfiles, borradores y auditoría.

## Fase 7: Bitácora contextual robusta

Objetivos:

- registrar notas formativas por usuario;
- asociar nota a página y contexto;
- registrar tema visual y dispositivo;
- evitar datos reales sensibles;
- aplicar RLS por usuario.

## Fase 8: Editor Visual Web Lab

Objetivos:

- permitir edición visual de páginas y bloques;
- manejar borradores;
- manejar preview;
- manejar publicación;
- manejar restauración de versiones.

Restricción:

El editor no debe permitir modificar autenticación, RLS, Supabase client, variables de entorno, service role ni lógica crítica.

## Fase 9: Versionado y publicación

Objetivos:

- crear historial de versiones;
- registrar eventos de publicación;
- permitir restaurar versión anterior;
- auditar cambios administrativos.

## Fase 10: QA visual, funcional y legal-operacional

Objetivos:

- validar contra mockups;
- validar login/logout;
- validar primer acceso;
- validar permisos por rol;
- validar Simulaciones deshabilitada;
- validar Boldo/Ámbar;
- validar responsive;
- validar RLS;
- validar ausencia de datos reales sensibles.

## Criterio legal-operacional

La plataforma es formativa. No debe registrar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas, folios, causas ni antecedentes identificables.

La migración debe respetar minimización de datos, finalidad formativa, acceso restringido y trazabilidad básica.
