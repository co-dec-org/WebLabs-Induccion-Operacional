-- =====================================================================
-- 017_harden_functions.sql
-- Hardening de funciones SECURITY DEFINER (Security Advisor de Supabase):
--   (1) Fija el search_path (evita escalada de privilegios por manipulación del
--       search_path) — práctica clave en funciones SECURITY DEFINER.
--   (2) Revoca EXECUTE a anon/public (nadie sin sesión debe ejecutarlas) y lo
--       concede solo a authenticated donde la app o el RLS lo requieren.
--
-- Nota: algunas funciones DEBEN ser ejecutables por usuarios autenticados (la app
-- las llama vía RPC, o el RLS las usa). El aviso "Signed-In Users Can Execute" para
-- ellas es esperable y aceptable: validan rol internamente y ahora tienen search_path
-- fijo. La política de insert "always true" de nav_traces es intencional (telemetría
-- anónima sin PII) y se mantiene.
--
-- ADITIVO / idempotente. Si rls_auto_enable() no existiera con esa firma, quita sus
-- dos líneas y vuelve a correr.
-- =====================================================================

-- (1) search_path fijo
alter function public.app_current_role()                 set search_path = public, pg_temp;
alter function public.complete_initial_password_change() set search_path = public, pg_temp;
alter function public.publish_page(uuid, jsonb)          set search_path = public, pg_temp;
alter function public.restore_version(uuid)              set search_path = public, pg_temp;
alter function public.rls_auto_enable()                  set search_path = public, pg_temp;

-- (2a) Quitar EXECUTE a anon/public
revoke execute on function public.app_current_role()                 from anon, public;
revoke execute on function public.complete_initial_password_change() from anon, public;
revoke execute on function public.publish_page(uuid, jsonb)          from anon, public;
revoke execute on function public.restore_version(uuid)              from anon, public;
revoke execute on function public.rls_auto_enable()                  from anon, public;

-- (2b) Conceder EXECUTE solo a authenticated (las que la app/RLS necesitan).
--      rls_auto_enable() es función de event trigger (la invoca el sistema): sin grant.
grant execute on function public.app_current_role()                 to authenticated;
grant execute on function public.complete_initial_password_change() to authenticated;
grant execute on function public.publish_page(uuid, jsonb)          to authenticated;
grant execute on function public.restore_version(uuid)              to authenticated;
