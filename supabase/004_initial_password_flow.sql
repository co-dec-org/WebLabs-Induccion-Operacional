-- Flujo de clave inicial para DMT Web-Labs.
-- Ejecutar solo si la base ya fue creada antes de incorporar must_change_password.

alter table public.profiles
  add column if not exists department text not null default 'Departamento de Monitoreo Telemático',
  add column if not exists must_change_password boolean not null default true,
  add column if not exists password_changed_at timestamptz;

create or replace function public.complete_initial_password_change()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    must_change_password = false,
    password_changed_at = now(),
    updated_at = now()
  where id = auth.uid();
end;
$$;

grant execute on function public.complete_initial_password_change() to authenticated;
