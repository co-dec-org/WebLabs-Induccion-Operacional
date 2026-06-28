# Fase 1 — cambios listos (probados con build verde)

Tocan **solo 2 archivos**: `src/app/system-map/systemMap.js` y `src/App.jsx`.
No tocan autenticación, cliente Supabase, variables de entorno ni RLS.

## 1. Corrección de inconsistencia del System Map
`navigationByRole.admin` ahora incluye `'supervision'` (antes el admin tenía acceso a
Supervisión por `pageAccess` pero no aparecía en su menú). Una línea.

## 2. Paso 2B de navegación (completado)
El bloque `<nav>` de `AppShell` ya no usa `baseNavItems`/`adminNavItems` ni los botones
"Simulaciones"/"Equipo" hardcodeados. Ahora se genera desde `getNavigationForRole(role)`:
una sola fuente de verdad (el System Map) define qué ve cada rol, con sus íconos y estados.
Los ítems con `status: 'disabled'` se renderizan deshabilitados y con `aria-disabled`.

## 3. Gates de permisos sistemáticos (ya no ad-hoc)
En el render de `App()`, tras validar la sesión, se aplican dos compuertas usando el System Map:
- **PageStatusGate:** si la página está `disabled`, muestra una pantalla "no disponible"
  (nuevo componente `DisabledPage`, con botón "Volver a Inicio") — **incluso si se entra por URL**.
  Esto cierra el acceso por URL a `/simulaciones` y `/supervision`.
- **RoleGate:** si el rol no está en `pageAccess` de la página, muestra `RestrictedPage`.
  Reemplaza los chequeos `role === 'admin' ? ... : ...` repetidos en cada ruta admin.

## Verificación de comportamiento (probado)
| Ruta | Rol | Resultado |
|---|---|---|
| /admin-cuentas | operador / supervisor | RestrictedPage |
| /admin-cuentas | admin | Render real |
| /admin-contenidos | operador | RestrictedPage |
| /simulaciones | cualquiera | DisabledPage |
| /supervision | cualquiera | DisabledPage |
| /home, /perfil | operador | Render real |
| /admin (alias) | operador | RestrictedPage |

Build de producción: `vite build` OK, 67 módulos, sin errores.

## Cómo se entrega
1. En GitHub Desktop, **merge `feature/architecture-system-map` → `main`** (trae `systemMap.js`,
   docs y mockups con su historia).
2. Yo escribo encima los 2 archivos con los cambios de arriba en tu clon.
3. Tú haces **commit + push** desde GitHub Desktop.

Pendiente de QA visual manual: revisar ambos temas (Boldo/Ámbar) y los 4 perfiles de pantalla,
confirmar que el ítem deshabilitado se ve atenuado y que la Bitácora flotante sigue bien.
