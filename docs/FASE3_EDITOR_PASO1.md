# Fase 3 — Editor Visual Web Lab · Paso 1: modelo de datos

Archivo entregado: `supabase/010_visual_editor_schema.sql` (en tu repo).
Es **100% aditivo**: crea tablas/enums nuevos. No toca esquema, RLS, auth ni la web actual.
Validado con el parser real de PostgreSQL (42 sentencias OK).

## Qué crea

**8 tablas** (con RLS, mismo patrón `app_current_role()` del esquema actual):

| Tabla | Para qué |
|---|---|
| `site_pages` | Una fila por página administrable (key, ruta, estado, tema, versión actual) |
| `page_blocks` | Bloques de cada página (tipo, posición, props JSON, visibilidad, anidamiento) |
| `page_block_overrides` | Ajustes por perfil de pantalla (phone/tablet/desktop/desktop_hd) y/o tema (boldo/ámbar) |
| `editor_drafts` | Borradores de trabajo del admin (snapshot en JSON) |
| `page_versions` | Versiones publicadas inmutables (para **restaurar**) |
| `publish_events` | Auditoría de publicación/restauración |
| `resources` | Biblioteca de recursos/medios |
| `supervision_metrics` | Métricas para el panel de Supervisión |

**4 enums:** `page_lifecycle`, `screen_profile`, `visual_theme`, `publish_action`.

## Reglas de seguridad (RLS) aplicadas
- Páginas/bloques/recursos **publicados** → legibles por cualquier rol logueado.
- **Escritura** (crear/editar/publicar/versionar) → **solo admin**.
- Versiones y auditoría → legibles por supervisor/admin.
- Métricas → el propio sujeto, o supervisor/admin.

Esto cumple el límite del proyecto: el editor puede tocar páginas/bloques/textos/tamaños/
orden/visibilidad/temas/borradores/preview/publicación/restauración, y **nunca** auth, RLS de
tablas existentes, variables de entorno ni service_role.

## Cómo aplicarlo (cuando quieras)
1. **Commit + push** del archivo desde GitHub Desktop (igual que antes).
2. En **Supabase → SQL Editor**, pega el contenido de `supabase/010_visual_editor_schema.sql`
   y dale **Run**. Crea todo de una vez. (Si lo corres dos veces dará error de "ya existe":
   es normal, significa que ya está aplicado.)

## Lo que viene después (roadmap del editor)
- **Paso 2 — Seed inicial:** poblar `site_pages` con las páginas actuales (inicio, inducción,
  bitácora, marco legal, recursos, perfil) y un set base de bloques, sin cambiar la web.
- **Paso 3 — Render desde datos:** que las páginas lean sus bloques desde la BD (con fallback
  al código actual, para no romper nada).
- **Paso 4 — Editor admin:** panel para editar bloques → guardar borrador → **preview**.
- **Paso 5 — Publicar/versionar/restaurar:** con auditoría vía `publish_events`.

Cada paso es incremental y con QA, sin romper la web en producción.
