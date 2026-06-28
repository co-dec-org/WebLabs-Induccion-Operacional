-- =====================================================================
-- 018_summary_outlier_cap.sql
-- Mejora la vista public.nav_traces_summary:
--   * MANTIENE security_invoker = on (respeta el RLS de nav_traces — fix del 016).
--   * Excluye outliers de permanencia (tabs olvidados): el tiempo medio solo
--     promedia duraciones <= 10 min (600000 ms), para que una pestaña abierta
--     no distorsione el indicador "Tiempo medio".
--   * 'visitas' sigue contando solo eventos 'view' (fix del 015).
-- ADITIVO / idempotente.
-- =====================================================================

create or replace view public.nav_traces_summary
  with (security_invoker = on)
as
  select
    route,
    page_key,
    count(*) filter (where event_type = 'view')                  as visitas,
    count(distinct anon_session)                                 as sesiones,
    round(avg(duration_ms) filter (where duration_ms <= 600000)) as duracion_media_ms,
    max(occurred_at)                                             as ultima_visita
  from public.nav_traces
  group by route, page_key;

-- Re-conceder lectura (create or replace puede no preservar grants en todos los casos).
grant select on public.nav_traces_summary to authenticated;
