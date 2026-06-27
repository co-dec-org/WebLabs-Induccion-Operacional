-- =====================================================================
-- 015_fix_nav_summary.sql
-- Corrige la vista nav_traces_summary: 'visitas' debe contar SOLO los
-- eventos 'view' (antes contaba view + leave, duplicando el conteo).
-- 'duracion_media_ms' ya era correcto: avg() ignora los NULL de los 'view'
-- y promedia solo las duraciones de los 'leave'.
-- ADITIVO / idempotente (create or replace).
-- =====================================================================

create or replace view public.nav_traces_summary as
  select
    route,
    page_key,
    count(*) filter (where event_type = 'view')  as visitas,
    count(distinct anon_session)                 as sesiones,
    round(avg(duration_ms))                      as duracion_media_ms,
    max(occurred_at)                             as ultima_visita
  from public.nav_traces
  group by route, page_key;
