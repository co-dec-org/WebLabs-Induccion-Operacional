-- =====================================================================
-- 014_nav_analytics.sql
-- Telemetría de NAVEGACIÓN para fines educativos / análisis en laboratorio web.
-- ADITIVO. Diseño de PRIVACIDAD POR DISEÑO (Ley 21.719):
--   * NO almacena datos personales ni el id real del usuario.
--   * Usa un identificador de sesión ANÓNIMO (aleatorio, generado en el
--     navegador, no ligado a la identidad). Permite reconstruir el RECORRIDO
--     sin identificar a la persona.
--   * 'role' se guarda como categoría agregada (operador/supervisor/admin),
--     no identifica a nadie por sí solo. Es opcional.
--   * Minimización de datos: solo ruta, tiempo y contexto técnico.
-- =====================================================================

create table public.nav_traces (
  id              bigint generated always as identity primary key,
  anon_session    text not null,                 -- sesión anónima (aleatoria, NO es el user id)
  route           text not null,                 -- ruta visitada (p.ej. '/induccion')
  page_key        text,                          -- clave de página del System Map (si mapea)
  event_type      text not null default 'view',  -- 'view' (entrada) | 'leave' (salida)
  duration_ms     integer,                       -- tiempo en la página (se llena al salir)
  referrer_route  text,                          -- ruta anterior (para reconstruir el camino)
  device_type     text,                          -- 'phone' | 'tablet' | 'desktop'
  theme           text,                          -- 'boldo' | 'ambar'
  role            text,                          -- categoría agregada (opcional, no identifica)
  occurred_at     timestamptz not null default now()
);

create index nav_traces_session_idx on public.nav_traces (anon_session, occurred_at);
create index nav_traces_route_idx   on public.nav_traces (route);
create index nav_traces_time_idx    on public.nav_traces (occurred_at);

-- ----- RLS -----
alter table public.nav_traces enable row level security;

-- Registrar trazas: permitido (la web inserta su propia traza anónima).
create policy "nav_traces_insert" on public.nav_traces
  for insert
  with check (true);

-- Leer/analizar: solo supervisor o admin (no expone trazas a operadores).
create policy "nav_traces_select" on public.nav_traces
  for select
  using (public.app_current_role() in ('admin', 'supervisor'));

-- Borrar (retención/limpieza): solo admin.
create policy "nav_traces_admin_delete" on public.nav_traces
  for delete
  using (public.app_current_role() = 'admin');

grant insert on public.nav_traces to authenticated, anon;
grant select, delete on public.nav_traces to authenticated;

-- ----- Vista agregada para análisis (sin sesiones individuales) -----
create or replace view public.nav_traces_summary as
  select
    route,
    page_key,
    count(*)                              as visitas,
    count(distinct anon_session)          as sesiones,
    round(avg(duration_ms))               as duracion_media_ms,
    max(occurred_at)                      as ultima_visita
  from public.nav_traces
  group by route, page_key;
