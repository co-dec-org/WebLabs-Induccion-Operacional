# Informe de avance — DMT Web-Lab (Inducción Operacional)

> Proyecto: `co-dec-org/WebLabs-Induccion-Operacional` · Plataforma formativa del Departamento de
> Monitoreo Telemático (Gendarmería de Chile). React + Vite + Supabase + Vercel.
> Fecha de corte: **26 de junio de 2026** · Rama `main`, HEAD `664ef1e`.

---

## 1. Dónde estamos (resumen ejecutivo)

La plataforma está **funcional y desplegada** en Vercel, con las fases de remediación legal, navegación,
modularización y editor visual **completas**. El trabajo activo se concentra ahora en dos frentes: la
**telemetría de navegación anónima** (tabla creada, falta cablear el cliente y alimentar datos reales) y
el **sistema de visualización "Constelar"** de los 4 indicadores de navegación (3 de 4 aprobados; el
último —Visitas— está propuesto y en revisión).

En lo arquitectónico, la base documental (ARCHITECTURE, SYSTEM_MAP, ROLES_RLS, DESIGN_SYSTEM,
MIGRATION_PLAN) está definida y el código ya fue modularizado. Quedan pendientes la extracción fina de
algunos componentes objetivo, la Bitácora contextual robusta, el módulo Simulaciones (proyectado) y el
ciclo de QA visual/legal formal contra los mockups.

**Estado de la carpeta del proyecto (importante):** tras la mudanza solicitada existen **dos copias
divergentes** y conviene consolidarlas (ver §7). Nada se perdió: el proyecto completo está en
`Desktop/En Orbita/DMT Web Lab`; en `Google Drive/.../Claude Cowork/DMT Web Lab` quedó solo el repo.

---

## 2. Arquitectura

### 2.1 Stack y capas

La aplicación es un SPA en **React + Vite** (JS + CSS), con **Supabase** como backend (Auth, Postgres,
RLS) y despliegue continuo en **Vercel** desde GitHub. Se organiza en cinco capas: presentación
(páginas, componentes, temas), aplicación (navegación, rutas, roles, estados), datos (Supabase,
consultas), seguridad (autenticación, permisos, RLS) y despliegue (GitHub → revisión → Vercel).

**Nota técnica crítica:** el transform de JSX es clásico (sin `@vitejs/plugin-react`), por lo que
**cada archivo `.jsx` debe importar React**. El build no detecta la omisión; falla en runtime
("React is not defined"). Es la causa raíz de un incidente ya resuelto y debe vigilarse en todo archivo
nuevo.

### 2.2 System Map y seguridad

El **System Map** es la fuente única de verdad para roles, rutas, navegación, estados de página y
permisos. Los tres roles oficiales son **operador, supervisor y admin**, y los estados de página son
`enabled / disabled / coming_soon / hidden / draft / archived`. El principio rector es que **la
navegación visual no reemplaza la autorización real**: toda ruta protegida valida sesión activa, rol,
estado de página y políticas RLS de Supabase. Se implementaron gates sistemáticos (`PageStatusGate`,
`RoleGate`) que reemplazaron el control ad-hoc previo.

### 2.3 Estructura de código (implementada)

El refactor dejó `App.jsx` de ~1424 a ~170 líneas, repartido por feature:

- `src/App.jsx`, `src/main.jsx` — orquestación y arranque.
- `src/components/` — `AppShell`, `blocks` (Hero/Título/Tarjeta/Acordeón/CTA + BlockRenderer +
  EditablePage + ResponsivePreview), `gates`, `FloatingLog` (botón "Notas"), `GendarmeriaLogo`.
- `src/features/` — `admin` (editor de contenidos), `auth`, `induccion`, `pages`.
- `src/lib/` — `supabaseClient`, `dmtApi`, `uiConstants`, `uiHelpers`.
- `src/styles/` — `tokens.css`, `themes.css`, `base.css`, `responsive.css`.
- `src/data/modules.js`.

> Observación: la documentación de arquitectura menciona `src/app/system-map/systemMap.js` y varios
> componentes objetivo (Sidebar, Topbar, ProtectedRoute, DisabledPageNotice) como meta. La estructura
> real evolucionó hacia `components/ + features/`; conviene **alinear la documentación con el código**
> o completar la extracción de esos componentes (ver §6).

### 2.4 Datos y migraciones (Supabase)

Migraciones presentes en `supabase/`:

| Archivo | Qué hace | Estado |
|---|---|---|
| `004_initial_password_flow.sql` | Flujo de primer acceso / cambio de contraseña | Aplicada |
| `010_visual_editor_schema.sql` | Modelo del editor (site_pages, page_blocks, overrides, editor_drafts, page_versions, publish_events, resources, supervision_metrics) + RLS | Aplicada |
| `011_visual_editor_seed.sql` | Seed de páginas actuales como datos editables | Aplicada |
| `012_visual_editor_publish.sql` | Funciones `publish_page` / `restore_version` (SECURITY DEFINER, solo admin, atómicas) | Aplicada |
| `013_fix_app_current_role_recursion.sql` | Corrige recursión RLS en `app_current_role()` (SECURITY DEFINER) | Aplicada |
| `014_nav_analytics.sql` | Tabla `nav_traces` (telemetría anónima) + vista `nav_traces_summary` + RLS | **Creada, sin aplicar** |

Reglas obligatorias vigentes: ninguna tabla expuesta públicamente, RLS siempre habilitado, el frontend
solo usa credenciales públicas autorizadas, `service_role` nunca en el frontend, variables de entorno
fuera del repo, borradores admin invisibles para operadores.

### 2.5 Sistema visual (Design System)

Dos temas oficiales: **Boldo** (institucional, verde monótono, sin acentos cálidos) y **Ámbar**
(laboratorio/entrenamiento, que suma el dorado **solo como contraste** sobre la base verde de Boldo).
Esta regla quedó documentada y se aplica de forma transversal, incluyendo las visualizaciones Constelar.
Layout objetivo: composición de escritorio hasta 1920×1080 centrada, con soporte responsive
(phone/tablet/desktop, vertical y horizontal).

### 2.6 Restricciones del Editor Visual

El editor puede modificar contenidos, bloques, orden, visibilidad, temas, borradores y versiones. **No**
puede tocar autenticación, RLS, permisos críticos, cliente Supabase, variables de entorno,
`service_role`, rutas protegidas ni lógica de seguridad.

### 2.7 Criterio legal-operacional

Plataforma **formativa**: no registra ni expone datos reales de víctimas, PSC, domicilios, teléfonos,
coordenadas, folios, causas ni antecedentes identificables. Marco aplicable: Leyes 19.968, 20.066,
20.603, 21.378 y **21.719** (protección de datos), y Decreto 19 del Ministerio de Justicia. Principios
aplicados: finalidad formativa, minimización, acceso restringido, separación de roles, trazabilidad
administrativa, seguridad y privacidad por diseño.

---

## 3. Qué se ha hecho (desarrollo)

### 3.1 Fase 0 — Remediación de datos personales (prioridad legal) ✅

Se eliminó de **todo el historial Git** el archivo `supabase_profiles_usuarios_dmt.sql` que exponía
datos reales de 13 funcionarios (nombre + UUID + rol), usando `git filter-repo`, se reemplazó por una
plantilla `*.example.sql`, se creó `.gitignore`, se hizo force-push coordinado y se activaron Secret
Scanning + Push Protection. Verificado contra el remoto. Evidencia en `VERIFICACION_FASE0.md` y
`REMEDIACION_LISTA.md`.

### 3.2 Fase 1 — Navegación y permisos ✅

Merge de `feature/architecture-system-map` a `main`; navegación derivada de `getNavigationForRole(role)`
(fuente única); corrección de inconsistencia (admin sin `supervision`); gates sistemáticos de rol y
estado de página.

### 3.3 Fase 2 — Modularización y CSS ✅

`App.jsx` modularizado (~1424 → ~170 líneas) en 11 módulos por feature; `styles.css` (2879 líneas)
dividido en `tokens / base / themes / responsive` sin cambios de comportamiento. Se incorporó
verificación de runtime (SSR) al proceso tras el incidente "React is not defined".

### 3.4 Fase 3 — Editor Visual Web Lab ✅

Construido por pasos aditivos con fallback seguro: modelo de datos + RLS (010), seed (011), render desde
BD con fallback (`EditablePage`: una página se renderiza desde BD solo si tiene contenido real
publicado), panel de edición admin (borrador + vista previa), publicar/versionar/restaurar (012),
biblioteca de bloques responsive y preview por pantalla (Phone/Tablet/Desktop/Desktop HD) con toggle de
tema. Corrección asociada: recursión RLS en `app_current_role()` (013), que destrabó el acceso admin.

### 3.5 Mejora continua — Responsive (LEAN/Kaizen) 🟡

Se detectó recorte en tablet/iPad por marco rígido 1920×1080 con `overflow:hidden`. Se adoptó un patrón
**fluido** (grids `auto-fit`, `clamp()`, `vw`, marco fluido) comparándolo contra el sitio de referencia
`ime-conecta`. Cambios aplicados (commits hasta `849c1f3` "Update base.css"). **Pendiente: validación en
iPad real (QA fit-to-window).**

### 3.6 Telemetría de navegación (analítica educativa) 🟡

Diseño completo y documentado (`ANALITICA_NAVEGACION.md`), con privacidad por diseño (Ley 21.719):
captura anónima de ruta, tipo de evento, duración, ruta previa, dispositivo, tema y rol agregado, con
`anon_session` aleatorio no ligado a identidad. Migración `014_nav_analytics.sql` creada y validada.
**Pendiente: aplicar la migración en Supabase y construir/verificar el cliente `src/lib/navTrace.js`.**

### 3.7 Visualizaciones "Constelar" (4 indicadores) 🟡

Sistema de visualización de los KPIs de navegación, con lenguaje 3D común (llenar la caja ≥80%,
profundidad = tiempo cuando aplica, alta resolución/volumetría, fondo de campo profundo al infinito,
navegación por arrastre + scroll + botones flotantes de vista, y skins Boldo monótono / Ámbar de
contraste). Estado por indicador:

| Indicador | Unidad | Metáfora visual | Estado |
|---|---|---|---|
| **Recorridos** | flujo (transiciones) | **Asteroides 3D** sobre la ruta lógica (movimiento lento, desvíos en coral) | ✅ Aprobado |
| **Índice compuesto (aD_)** | aD_ (visitas × tiempo) | **Recorrido 3D vs tiempo** (nebulosas volumétricas; hoy al frente → 7 días al fondo) | ✅ Aprobado |
| **Tiempo medio** | s / visita | **Túnel del tiempo 3D** navegable (0 s → ∞; fondo estelar; ecos y motas al infinito) | ✅ Aprobado |
| **Visitas** | visitas | **Constelación de estrellas 3D** (brillo/tamaño = visitas; enjambres por página) | 🟡 En revisión |

Documentado en `INDICADORES_CONSTELAR.md` y `REFERENCIA_VISUAL_NEBULOSA.md` (incluye las reglas de
diseño comunes y el promedio visual derivado de 4 referencias reales en `Referencias/`).

### 3.8 Trazabilidad y operación ✅

`HISTORIAL_PROYECTO.md` como registro trazable (evidencia de cumplimiento Ley 21.719). Incidentes
operativos resueltos: rollback de Vercel a un commit estable y posterior "Promote"; `.git/index.lock`
obsoleto removido por el usuario.

---

## 4. Estado de despliegue

- **Producción:** desplegada en Vercel desde `main` (HEAD `664ef1e`).
- **Acceso admin:** funcional (`patricioa.gonzalez@gendarmeria.cl`).
- **Versión funcional respaldada:** tag `v0.1-web-labs-funcional`.
- **Datos reales:** viven solo en Supabase (Auth + `profiles`), nunca en el repo.

---

## 5. Qué queda por desarrollar — Arquitectura

1. **Alinear documentación ↔ código:** la documentación referencia `src/app/system-map/systemMap.js`
   y componentes objetivo (Sidebar, Topbar, ProtectedRoute, DisabledPageNotice) que la implementación
   resolvió de otra forma. Decidir: actualizar docs al estado real, o completar la extracción.
2. **Extracción fina de componentes** (Fase 4 del plan): separar AppShell/Sidebar/Topbar/Footer/
   PageHeader como componentes reutilizables sin alterar la versión funcional.
3. **Bitácora contextual robusta** (Fase 7): notas formativas por usuario asociadas a página/contexto,
   con tema y dispositivo, RLS por usuario y sin datos sensibles.
4. **Módulo Simulaciones** (proyectado): hoy visible y deshabilitado en v0.1; definir alcance y
   construir en etapa posterior.
5. **Política de retención** de `nav_traces` (p. ej. purgar > 12 meses) vía tarea programada o función.
6. **Base de licitud / aviso** de la telemetría educativa (confirmar con el área legal del organismo).

---

## 6. Qué queda por desarrollar — Desarrollo (features)

1. **Aprobar Visitas** (constelación 3D) y, con los 4 listos, **ensamblar el Tablero Constelar** único
   con sus skins (Boldo/Ámbar).
2. **Cablear telemetría real:** aplicar `014_nav_analytics.sql` en Supabase + construir y verificar
   `src/lib/navTrace.js` (genera `anon_session`, registra `view`/`leave` con duración y `referrer_route`,
   se engancha al `navigate()` de `App.jsx`). Verificación obligatoria en build/runtime.
3. **Conectar las visualizaciones a datos reales** (reemplazar los datos de muestra por consultas a
   `nav_traces` / `nav_traces_summary`).
4. **QA responsive en iPad** (fit-to-window, sin scroll) y replicación del patrón fluido página por
   página.
5. **Guardar las skins como artefactos HTML reutilizables** (plantillas) y, opcionalmente, publicarlas
   como vistas vivas que se actualicen desde Supabase.
6. **Ciclo de QA visual/funcional/legal** (Fase 10) contra los mockups de `docs/mockups/`:
   login/logout, primer acceso, permisos por rol, Simulaciones deshabilitada, Boldo/Ámbar, responsive,
   RLS y ausencia de datos reales sensibles.

---

## 7. Estado de la carpeta del proyecto (acción recomendada)

Tras la mudanza solicitada conviven dos copias:

- `Desktop/En Orbita/DMT Web Lab/` → **proyecto completo** (documentos Cowork + `Referencias/` +
  `Capturas iPad/` + repo en `GitHub/`).
- `Desktop/Google Drive/_agentic Ai/Claude Cowork/DMT Web Lab/` → **solo el repositorio** (la app), sin
  los documentos Cowork ni las referencias.

**Recomendación:** definir una ubicación canónica y consolidar. Opción simple: copiar a la carpeta de
Google Drive los documentos Cowork y `Referencias/` para que ahí quede el proyecto completo (con la
ventaja de sincronización en la nube), o bien mover la carpeta completa de `En Orbita` a Google Drive y
dejar una sola copia. Puedo ejecutar cualquiera de las dos una vez que se confirme.

---

## 8. Riesgos y notas de mantenimiento

- **`import React` obligatorio** en cada `.jsx` (transform clásico). Vigilar en archivos nuevos.
- **Datos personales solo en Supabase**, nunca en el repo; telemetría siempre anónima (sin PII).
- **Imágenes iStock** de `Referencias/` son referencia de estilo (marca de agua/derechos): **no** se
  versionan en el repo público.
- **Migración 014 sin aplicar:** las visualizaciones usan datos de muestra hasta cablear la telemetría.

---

## 9. Próximos pasos sugeridos (priorizados)

1. Aprobar **Visitas** y ensamblar el **Tablero Constelar**.
2. Aplicar `014` + construir/verificar `navTrace.js` → datos reales.
3. Consolidar la carpeta del proyecto (§7).
4. QA responsive en iPad.
5. Alinear documentación ↔ código y planificar extracción de componentes + Bitácora robusta.
