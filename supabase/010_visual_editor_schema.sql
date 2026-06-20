-- =====================================================================
-- 010_visual_editor_schema.sql
-- Modelo de datos del Editor Visual Web Lab (Fase 3) — ADITIVO.
-- No modifica tablas, RLS, auth ni funciones existentes. Solo agrega.
--
-- Principios:
--  * El editor administra páginas/bloques/textos/tamaños/orden/visibilidad/
--    temas/perfiles de pantalla/borradores/preview/publicación/versionado.
--  * NUNCA toca: auth, cliente Supabase, variables de entorno, RLS de tablas
--    existentes, rutas protegidas ni service_role.
--  * No se almacenan datos personales reales (Ley 21.719).
-- =====================================================================

-- ----- Enums -----
create type public.page_lifecycle  as enum ('draft', 'published', 'archived');
create type public.screen_profile  as enum ('phone', 'tablet', 'desktop', 'desktop_hd');
create type public.visual_theme    as enum ('boldo', 'ambar');
create type public.publish_action  as enum ('publish', 'restore', 'unpublish');

-- ----- site_pages: una fila por página administrable -----
create table public.site_pages (
  id                 uuid primary key default gen_random_uuid(),
  page_key           text not null unique,            -- 'inicio','induccion',...
  route              text not null unique,            -- '/home','/induccion'
  title              text not null,
  status             public.page_lifecycle not null default 'draft',
  default_theme      public.visual_theme not null default 'boldo',
  sort_order         int not null default 0,
  current_version_id uuid,                             -- FK -> page_versions (abajo)
  created_by         uuid references public.profiles(id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ----- page_blocks: estructura viva (publicada) de cada página -----
create table public.page_blocks (
  id              uuid primary key default gen_random_uuid(),
  page_id         uuid not null references public.site_pages(id) on delete cascade,
  parent_block_id uuid references public.page_blocks(id) on delete cascade,
  block_type      text not null,                       -- 'hero','title','card','accordion',...
  position        int not null default 0,
  props           jsonb not null default '{}'::jsonb,  -- textos, tamaños, espaciados, etc.
  is_visible      boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index page_blocks_page_pos_idx on public.page_blocks (page_id, position);

-- ----- page_block_overrides: ajustes por perfil de pantalla y/o tema -----
create table public.page_block_overrides (
  id             uuid primary key default gen_random_uuid(),
  block_id       uuid not null references public.page_blocks(id) on delete cascade,
  screen_profile public.screen_profile,                -- null = aplica a todos
  theme          public.visual_theme,                  -- null = aplica a todos
  props          jsonb not null default '{}'::jsonb,
  is_visible     boolean,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (block_id, screen_profile, theme)
);

-- ----- editor_drafts: borradores de trabajo (workspace del admin) -----
create table public.editor_drafts (
  id         uuid primary key default gen_random_uuid(),
  page_id    uuid not null references public.site_pages(id) on delete cascade,
  author_id  uuid references public.profiles(id) on delete set null,
  label      text,
  data       jsonb not null default '{}'::jsonb,       -- snapshot bloques+overrides
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index editor_drafts_page_idx on public.editor_drafts (page_id);

-- ----- page_versions: snapshots inmutables publicados (para restaurar) -----
create table public.page_versions (
  id             uuid primary key default gen_random_uuid(),
  page_id        uuid not null references public.site_pages(id) on delete cascade,
  version_number int not null,
  data           jsonb not null,                       -- snapshot publicado
  published_by   uuid references public.profiles(id) on delete set null,
  published_at   timestamptz not null default now(),
  unique (page_id, version_number)
);
create index page_versions_page_idx on public.page_versions (page_id);

-- FK diferida: site_pages.current_version_id -> page_versions.id
alter table public.site_pages
  add constraint site_pages_current_version_fk
  foreign key (current_version_id) references public.page_versions(id) on delete set null;

-- ----- publish_events: auditoría de publicación/restauración -----
create table public.publish_events (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references public.profiles(id) on delete set null,
  page_id    uuid references public.site_pages(id) on delete set null,
  version_id uuid references public.page_versions(id) on delete set null,
  action     public.publish_action not null,
  metadata   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index publish_events_page_idx on public.publish_events (page_id);

-- ----- resources: biblioteca de recursos/medios -----
create table public.resources (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  resource_type text not null,                         -- 'image','pdf','link','video'
  url           text,
  storage_path  text,
  metadata      jsonb not null default '{}'::jsonb,
  active        boolean not null default true,
  created_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ----- supervision_metrics: métricas para el panel de supervisión -----
create table public.supervision_metrics (
  id           uuid primary key default gen_random_uuid(),
  subject_id   uuid references public.profiles(id) on delete cascade,
  metric_key   text not null,
  metric_value numeric not null default 0,
  period       text,                                   -- p.ej. '2026-06'
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index supervision_metrics_subject_idx on public.supervision_metrics (subject_id);

-- =====================================================================
-- RLS — mismo patrón que el esquema existente (app_current_role())
-- =====================================================================
alter table public.site_pages           enable row level security;
alter table public.page_blocks          enable row level security;
alter table public.page_block_overrides enable row level security;
alter table public.editor_drafts        enable row level security;
alter table public.page_versions        enable row level security;
alter table public.publish_events       enable row level security;
alter table public.resources            enable row level security;
alter table public.supervision_metrics  enable row level security;

-- site_pages: leer publicadas (cualquier rol); admin/supervisor ven todo; escribe admin
create policy "site_pages_select" on public.site_pages for select
using (status = 'published' or public.app_current_role() in ('admin', 'supervisor'));
create policy "site_pages_admin_write" on public.site_pages for all
using (public.app_current_role() = 'admin')
with check (public.app_current_role() = 'admin');

-- page_blocks: leer si su página está publicada (o admin/supervisor); escribe admin
create policy "page_blocks_select" on public.page_blocks for select
using (
  exists (
    select 1 from public.site_pages p
    where p.id = page_id
      and (p.status = 'published' or public.app_current_role() in ('admin', 'supervisor'))
  )
);
create policy "page_blocks_admin_write" on public.page_blocks for all
using (public.app_current_role() = 'admin')
with check (public.app_current_role() = 'admin');

-- page_block_overrides: idem vía block -> page
create policy "page_block_overrides_select" on public.page_block_overrides for select
using (
  exists (
    select 1 from public.page_blocks b
    join public.site_pages p on p.id = b.page_id
    where b.id = block_id
      and (p.status = 'published' or public.app_current_role() in ('admin', 'supervisor'))
  )
);
create policy "page_block_overrides_admin_write" on public.page_block_overrides for all
using (public.app_current_role() = 'admin')
with check (public.app_current_role() = 'admin');

-- editor_drafts: solo admin
create policy "editor_drafts_admin_all" on public.editor_drafts for all
using (public.app_current_role() = 'admin')
with check (public.app_current_role() = 'admin');

-- page_versions: leen admin/supervisor; escribe admin
create policy "page_versions_select" on public.page_versions for select
using (public.app_current_role() in ('admin', 'supervisor'));
create policy "page_versions_admin_write" on public.page_versions for all
using (public.app_current_role() = 'admin')
with check (public.app_current_role() = 'admin');

-- publish_events: insertan admin; leen admin/supervisor (auditoría)
create policy "publish_events_select" on public.publish_events for select
using (public.app_current_role() in ('admin', 'supervisor'));
create policy "publish_events_insert_admin" on public.publish_events for insert
with check (public.app_current_role() = 'admin');

-- resources: leer activos (cualquier rol); admin/supervisor ven todo; escribe admin
create policy "resources_select" on public.resources for select
using (active = true or public.app_current_role() in ('admin', 'supervisor'));
create policy "resources_admin_write" on public.resources for all
using (public.app_current_role() = 'admin')
with check (public.app_current_role() = 'admin');

-- supervision_metrics: lee el propio sujeto o supervisor/admin; escribe admin
create policy "supervision_metrics_select" on public.supervision_metrics for select
using (subject_id = auth.uid() or public.app_current_role() in ('admin', 'supervisor'));
create policy "supervision_metrics_admin_write" on public.supervision_metrics for all
using (public.app_current_role() = 'admin')
with check (public.app_current_role() = 'admin');

-- Grants (coherente con Supabase: las políticas RLS filtran filas)
grant select, insert, update, delete on
  public.site_pages, public.page_blocks, public.page_block_overrides,
  public.editor_drafts, public.page_versions, public.publish_events,
  public.resources, public.supervision_metrics
to authenticated;
