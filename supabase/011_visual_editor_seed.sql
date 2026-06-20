-- =====================================================================
-- 011_visual_editor_seed.sql
-- Seed inicial del Editor Visual (Fase 3 · Paso 2). IDEMPOTENTE y NO destructivo.
-- Registra las páginas actuales en site_pages y crea un bloque 'hero' base
-- SOLO en páginas que aún no tienen bloques. No cambia nada visible en la web.
-- Se puede re-ejecutar sin duplicar ni pisar ediciones del admin.
-- =====================================================================

-- ----- Páginas actuales como registro administrable -----
insert into public.site_pages (page_key, route, title, status, default_theme, sort_order)
values
  ('inicio',      '/home',        'Inicio',      'published', 'boldo', 1),
  ('induccion',   '/induccion',   'Inducción',   'published', 'boldo', 2),
  ('bitacora',    '/bitacora',    'Bitácora',    'published', 'boldo', 3),
  ('marco_legal', '/marco-legal', 'Marco legal', 'published', 'boldo', 4),
  ('recursos',    '/recursos',    'Recursos',    'published', 'boldo', 5),
  ('perfil',      '/perfil',      'Perfil',      'published', 'boldo', 6),
  -- Páginas proyectadas (estado borrador, coherente con pageStatus del System Map)
  ('simulaciones','/simulaciones','Simulaciones','draft',     'boldo', 7),
  ('supervision', '/supervision', 'Equipo',      'draft',     'boldo', 8)
on conflict (page_key) do update
  set route         = excluded.route,
      title         = excluded.title,
      status        = excluded.status,
      default_theme = excluded.default_theme,
      sort_order    = excluded.sort_order,
      updated_at    = now();

-- ----- Bloque 'hero' base SOLO para páginas sin bloques (no destructivo) -----
insert into public.page_blocks (page_id, block_type, position, props, is_visible)
select p.id,
       'hero',
       0,
       jsonb_build_object(
         'title', p.title,
         'subtitle', 'Sistema de Monitoreo Telemático',
         'seed', true
       ),
       true
from public.site_pages p
where not exists (
  select 1 from public.page_blocks b where b.page_id = p.id
);
