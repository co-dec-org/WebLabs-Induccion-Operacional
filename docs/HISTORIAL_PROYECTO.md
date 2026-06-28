# Historial y trazabilidad — DMT Web-Lab (proyecto en Claude Cowork)

> Registro histórico y trazable del trabajo realizado sobre
> `co-dec-org/WebLabs-Induccion-Operacional` desde su continuación en Claude Cowork.
> Fines: memoria del proyecto, trazabilidad técnica y **evidencia de cumplimiento de la
> Ley 21.719** (protección de datos personales), en particular la remediación de la fuga.
>
> Período documentado: 20–21 de junio de 2026.
> Repositorio: https://github.com/co-dec-org/WebLabs-Induccion-Operacional (rama `main`).

---

## 0. Origen y contexto

El proyecto se retomó en Cowork a partir de un traspaso (`HANDOFF_COWORK.md`) y una auditoría
técnica integral. La web es una plataforma de **inducción operacional** del Departamento de
Monitoreo Telemático (Gendarmería), construida en React + Vite + Supabase y desplegada en Vercel.

**Hallazgo crítico de la auditoría:** el repositorio público contenía
`supabase_profiles_usuarios_dmt.sql` con **datos personales reales de 13 funcionarios**
(nombre completo + UUID de Auth + rol). Esto constituía una exposición de datos personales en
el ámbito de la Ley 21.719.

---

## 1. Fase 0 — Remediación de datos personales (prioridad legal)

**Qué se hizo y por qué:** eliminar la fuga del árbol y de **todo el historial Git**, no solo
del último commit (borrarlo en un commit nuevo no basta: el contenido sigue accesible).

Pasos ejecutados y verificados:
1. **Verificación previa:** se clonó el repo y se buscaron otros secretos en todo el historial
   (`service_role`, JWT `eyJ`, `@gendarmeria`, `.env`). Resultado: **no había claves de
   aplicación filtradas** (los `service_role` eran texto de documentación; los `eyJ`, bytes de
   PNG). El único dato sensible era el archivo de perfiles.
2. **Purga del historial** con `git filter-repo --invert-paths` sobre los 38 commits.
   Verificado: el archivo y el `insert` con nombres reales no aparecen en ningún commit.
3. **Reemplazo** por una plantilla con UUID ficticios (`*.example.sql`).
4. **`.gitignore`** creado (no existía) para impedir versionar datos reales a futuro.
5. **Force-push** a GitHub (reescritura de historia, coordinada).
6. **Supabase:** se verificó que la tabla `profiles` viva solo contenía 1 fila (admin), con
   `must_change_password = true`. Los 13 nombres **nunca poblaron la base en vivo**.
7. **GitHub Secret Scanning + Push Protection** activados.

**Estado:** fuga remediada de punta a punta y verificada contra el remoto. Evidencia en
`VERIFICACION_FASE0.md` y `REMEDIACION_LISTA.md`.

---

## 2. Fase 1 — Navegación y permisos

- Merge de la rama `feature/architecture-system-map` a `main` (System Map: roles, rutas,
  permisos, estados de página).
- **Paso 2B:** la navegación se genera desde `getNavigationForRole(role)` (fuente única).
- **Corrección de inconsistencia:** `navigationByRole.admin` no incluía `supervision`; se alineó.
- **Gates de permisos sistemáticos:** `PageStatusGate` (páginas `disabled` no accesibles ni por
  URL) y `RoleGate` (rol contra `pageAccess`). Antes el control era ad-hoc por ruta.

---

## 3. Fase 2 — Modularización y CSS

- **2A:** `App.jsx` pasó de 1424 a ~170 líneas, repartido en 11 módulos por feature
  (`components/`, `features/`, `lib/`). Refactor sin cambios de comportamiento.
- **2B:** `styles.css` (2879 líneas) dividido en `tokens / base / themes / responsive`,
  verificado que el conjunto de reglas del bundle quedara idéntico (solo cambió el orden).
- **Incidente y corrección:** el transform de JSX es clásico (sin `@vitejs/plugin-react`), por lo
  que cada archivo `.jsx` requiere `import React`. Se detectó en runtime ("React is not defined")
  y se corrigió en los 10 módulos. Se incorporó verificación de runtime (SSR) al proceso.

---

## 4. Fase 3 — Editor Visual Web Lab

Construido por pasos incrementales, cada uno aditivo y con fallback seguro:
1. **Modelo de datos + RLS** (`010_visual_editor_schema.sql`): `site_pages`, `page_blocks`,
   `page_block_overrides`, `editor_drafts`, `page_versions`, `publish_events`, `resources`,
   `supervision_metrics`. Escritura solo admin.
2. **Seed** (`011_…seed.sql`): registro de las páginas actuales como datos editables.
3. **Render desde BD con fallback** (`EditablePage`): una página se renderiza desde la BD solo si
   tiene contenido real publicado; si no, muestra el código actual. Cero riesgo.
4. **Panel de edición admin:** editar bloques, guardar borrador, vista previa.
5. **Publicar / versionar / restaurar** (`012_…publish.sql`): funciones Postgres atómicas, solo
   admin, con historial de versiones y auditoría (`publish_events`).
6. **Biblioteca de bloques** responsive (Hero, Título, Tarjeta, Acordeón, CTA) reutilizando el CSS
   aprobado.
7. **Preview por pantalla** (Phone/Tablet/Desktop/Desktop HD) vía iframe + toggle de tema.

**Corrección de seguridad asociada** (`013_fix_app_current_role_recursion.sql`): la función
`app_current_role()` consultaba `profiles` dentro de su propia política RLS → recursión infinita
que impedía cargar el perfil (todos caían a "operador"). Se marcó `security definer`. Con esto se
destrabó el acceso de administrador.

---

## 5. Mejora continua — Responsive (metodología LEAN/Kaizen)

Tras detectar que en tablet/iPad el contenido se recortaba (no se adaptaba), se adoptó un ciclo
de mejora continua con verificación por evidencia (capturas reales del iPad):
- **Diagnóstico:** la app usaba un "marco rígido" 1920×1080 con `overflow: hidden` y tamaños en
  px fijos → encajaba solo a 1920×1080 y recortaba en pantallas menores.
- **Referencia comparativa:** el sitio `ime-conecta` (co-dec), que resuelve el ajuste con medidas
  fluidas (`clamp`, `vw`, `min()`), secciones a altura de viewport y `overflow-x: hidden`.
- **Ciclos aplicados:** grids con `auto-fit` (se reacomodan), marco fluido, y tipografía/íconos/
  alturas con `clamp()` para que el contenido escale y quepa en una ventana (fit-to-window).
- **En curso:** validación en iPad y replicación del patrón fluido página por página.

---

## 6. Estado actual (al cierre de este registro)

- Fases 0, 1, 2 y 3: completas y desplegadas.
- Editor Visual: operativo de punta a punta (editar → publicar → versionar → restaurar).
- Acceso admin: funcional (`patricioa.gonzalez@gendarmeria.cl`).
- Responsive: en mejora continua (Kaizen), validándose contra el patrón de `ime-conecta`.
- Próximo: telemetría de navegación anónima (ver `ANALITICA_NAVEGACION.md`).

## 7. Principios de cumplimiento mantenidos

- Datos personales reales viven **solo en Supabase** (Auth + `profiles`), nunca en el repo.
- RLS habilitado en todas las tablas; escrituras sensibles restringidas por rol.
- No se registran datos reales de víctimas, PSC, causas, folios ni ubicaciones.
- La telemetría educativa se diseñó **anónima** (sin PII), por minimización de datos.
