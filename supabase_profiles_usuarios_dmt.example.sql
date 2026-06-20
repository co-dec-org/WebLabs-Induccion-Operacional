-- =====================================================================
-- supabase_profiles_usuarios_dmt.TEMPLATE.sql
-- ---------------------------------------------------------------------
-- PLANTILLA SEGURA — NO contiene datos personales reales.
--
-- Reemplaza al archivo original que exponía nombres reales + UUID de
-- auth.users de funcionarios del Departamento de Monitoreo Telemático.
--
-- REGLAS:
--   * Los datos REALES de usuarios viven SOLO en Supabase (Auth + profiles),
--     NUNCA en el repositorio.
--   * Los UUID de abajo son FICTICIOS (placeholders). Reemplázalos por los
--     UUID reales SOLO al ejecutar en el entorno seguro, y NO commitees el
--     archivo con los valores reales.
--   * Cada usuario debe existir primero en auth.users (creado vía panel
--     Supabase o invitación). El UUID debe coincidir con auth.users.id.
-- =====================================================================

-- Inserta/actualiza perfiles enlazados a auth.users.
-- Ajusta los UUID y nombres en tu entorno seguro antes de ejecutar.

insert into public.profiles (id, full_name, department, role, must_change_password)
values
  -- ===== SUPERVISORES (ejemplo: 4) =====
  ('00000000-0000-0000-0000-000000000001', 'Supervisor Uno',  'Departamento de Monitoreo Telemático', 'supervisor', true),
  ('00000000-0000-0000-0000-000000000002', 'Supervisor Dos',  'Departamento de Monitoreo Telemático', 'supervisor', true),
  ('00000000-0000-0000-0000-000000000003', 'Supervisor Tres', 'Departamento de Monitoreo Telemático', 'supervisor', true),
  ('00000000-0000-0000-0000-000000000004', 'Supervisor Cuatro','Departamento de Monitoreo Telemático', 'supervisor', true),

  -- ===== OPERADORES (ejemplo: 8) =====
  ('00000000-0000-0000-0000-000000000005', 'Operador Uno',   'Departamento de Monitoreo Telemático', 'operador', true),
  ('00000000-0000-0000-0000-000000000006', 'Operador Dos',   'Departamento de Monitoreo Telemático', 'operador', true),
  ('00000000-0000-0000-0000-000000000007', 'Operador Tres',  'Departamento de Monitoreo Telemático', 'operador', true),
  ('00000000-0000-0000-0000-000000000008', 'Operador Cuatro','Departamento de Monitoreo Telemático', 'operador', true),
  ('00000000-0000-0000-0000-000000000009', 'Operador Cinco', 'Departamento de Monitoreo Telemático', 'operador', true),
  ('00000000-0000-0000-0000-000000000010', 'Operador Seis',  'Departamento de Monitoreo Telemático', 'operador', true),
  ('00000000-0000-0000-0000-000000000011', 'Operador Siete', 'Departamento de Monitoreo Telemático', 'operador', true),
  ('00000000-0000-0000-0000-000000000012', 'Operador Ocho',  'Departamento de Monitoreo Telemático', 'operador', true),

  -- ===== ADMIN (ejemplo: 1) =====
  ('00000000-0000-0000-0000-000000000013', 'Admin Web Lab',  'Departamento de Monitoreo Telemático', 'admin', false)

on conflict (id) do update
  set full_name            = excluded.full_name,
      department           = excluded.department,
      role                 = excluded.role,
      must_change_password = excluded.must_change_password;

-- =====================================================================
-- Notas:
--  * `on conflict (id) do update` hace el script idempotente: puedes
--    re-ejecutarlo sin duplicar filas.
--  * `must_change_password = true` obliga el cambio de contraseña en el
--    primer ingreso (operadores/supervisores). El admin puede ir en false
--    si su credencial ya fue establecida de forma segura.
--  * Verifica que cada `id` exista en auth.users antes de ejecutar, o el
--    insert fallará por la FK profiles.id -> auth.users.id.
-- =====================================================================
