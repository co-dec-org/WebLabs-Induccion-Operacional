-- =====================================================================
-- 016_fix_summary_security.sql
-- Corrige el hallazgo CRÍTICO del Security Advisor de Supabase:
--   "Security Definer View" en public.nav_traces_summary.
--
-- Las vistas, por defecto, se ejecutan con los privilegios de su PROPIETARIO
-- (postgres) y por tanto SALTAN el RLS de la tabla base. Con security_invoker = on
-- la vista se ejecuta con los privilegios del USUARIO que consulta, respetando el
-- RLS de public.nav_traces (lectura permitida solo a supervisor/admin).
--
-- ADITIVO / idempotente.
-- =====================================================================

alter view public.nav_traces_summary set (security_invoker = on);

-- Lectura de la vista para usuarios autenticados; el RLS de nav_traces filtra a
-- supervisor/admin (los operadores no obtienen filas).
grant select on public.nav_traces_summary to authenticated;
