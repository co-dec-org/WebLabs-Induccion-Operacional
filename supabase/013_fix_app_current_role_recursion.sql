-- =====================================================================
-- 013_fix_app_current_role_recursion.sql
-- Corrige recursión infinita de RLS: app_current_role() consultaba
-- public.profiles dentro de una política RLS de profiles -> recursión.
-- Solución estándar Supabase: SECURITY DEFINER + search_path fijo, para
-- que la función lea el rol saltándose RLS. ADITIVO, no cambia datos.
-- =====================================================================
create or replace function public.app_current_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;
