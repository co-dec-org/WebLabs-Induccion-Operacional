# Verificación Fase 0 — repo clonado y auditado en Cowork

> Fecha: 2026-06-20 · Repo: `co-dec-org/WebLabs-Induccion-Operacional` (clonado completo, todas las ramas)
> Esto cierra los puntos "no verificados" del HANDOFF y de la auditoría técnica.

---

## 1. Búsqueda de secretos en TODO el historial (Paso 0 de REMEDIACION_GIT)

| Patrón | Resultado |
|---|---|
| `service_role` | Aparece en 2 commits, **solo como texto de documentación/advertencia** (README, ARCHITECTURE.md, App.jsx). **No hay clave real.** |
| `eyJ` (prefijo JWT) | 1 commit, pero son **falsos positivos**: bytes aleatorios dentro de `slide-05.png` y `slide-08.png`. No hay JWT en blobs de texto. |
| `supabase.co` / `SUPABASE_SERVICE` / `secret` | 0 coincidencias. |
| `*.env`, `.env.local`, `*.xlsx`, `*.csv` | Nunca estuvieron en el historial. |

**Conclusión:** el ÚNICO dato sensible filtrado es el archivo de perfiles. No hay claves de aplicación expuestas.

## 2. Fuga de datos personales — CONFIRMADA

- `supabase_profiles_usuarios_dmt.sql`: **13 registros reales** (4 supervisores, 8 operadores, 1 admin), con **UUID reales** de `auth.users` (no ceros) + nombre + departamento + rol.
- Presente en **1 commit** (`fd513fe`) y en el árbol actual de `main`. Sigue accesible vía historial → requiere purga, no basta con borrarlo.

## 3. Endurecimiento — hallazgo nuevo

- **NO existe `.gitignore`** en el repo (ni en `main` ni en la rama feature). Esto es peor de lo que asumía el handoff. Hay que crearlo antes de re-subir nada.

## 4. Código fuente (lo que el chat no pudo leer) — ahora verificado

- **`src/lib/supabaseClient.js`** (16 líneas): usa `createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)`. **Solo anon key, correcto.** (El cliente real está aquí, no en `dmtApi.js`; `dmtApi.js` lo importa.)
- **`src/lib/dmtApi.js`** (167 líneas): capa de datos, sin claves. Usa `localStorage` como fallback demo.
- **`vite.config.js`**: limpio, sin claves (solo `server.host`).
- **`service_role` en `src/`**: solo una línea de advertencia en App.jsx (texto), ningún uso real.
- **Permisos — MATIZ IMPORTANTE (corrige la auditoría):** NO son "solo visuales".
  - **Gate de sesión: SÍ existe.** `App.jsx:1280` → `if (!user || route === '/login') return <LoginPage/>`. Sin sesión, cualquier ruta devuelve al login.
  - **Gate de rol en rutas admin: SÍ existe (inline).** `App.jsx:1318/1321` → `role === 'admin' ? <AdminAccountsPage/> : <RestrictedPage/>`. Un no-admin que entre por URL a `/admin-cuentas` o `/admin-contenidos` ve "RestrictedPage", no la página.
  - **Lo que falta** no es la protección sino la **sistematización**: no hay abstracciones `ProtectedRoute`/`RoleGate`/`PageStatusGate` reutilizables (hoy es chequeo ad-hoc por ruta). Conviene crearlas para escalar de forma consistente.
  - **`/simulaciones` y `/supervision` NO existen como rutas en `App.jsx` de `main`** → no son navegables porque aún no están implementadas (no es una fuga, es trabajo pendiente de Fase 1).
- **`src/App.jsx`**: 1343 líneas (monolito confirmado). **`src/styles.css`: 2879 líneas** (candidato fuerte a dividir).

## 5. Estado real del refactor de navegación — corrige el handoff

El handoff decía "Paso 2A hecho en `main`". **En realidad, en `main` no hay nada del refactor:** App.jsx sigue usando `baseNavItems`/`adminNavItems`/`allNavItems` y `routeLabel()`.

Todo el refactor vive en la rama **`feature/architecture-system-map`** (NO mergeada):
- `src/app/system-map/systemMap.js` (155 líneas) existe ahí.
- En esa rama, `App.jsx` solo cambia 5 líneas: agrega el import de `getPageLabelFromPath` y reemplaza el cuerpo de `routeLabel()`. → **Paso 2A está en la rama feature, no en main.**
- **Paso 2B (reemplazar el bloque `<nav>` por `getNavigationForRole`) NO está hecho** en ninguna rama. Confirmado.
- Botón flotante sigue diciendo **"Bitácora"**, no "Notas".

## 6. Inconsistencia del System Map — CONFIRMADA

En `systemMap.js` (rama feature):
- `pageAccess.supervision = ['supervisor', 'admin']` → admin **sí** tiene acceso a Supervisión.
- `navigationByRole.admin` **NO incluye** `'supervision'` → no aparece en su menú.

Desalineación real: el admin puede entrar a Supervisión por permiso/URL pero no la ve en su navegación. **Corregir** añadiendo `'supervision'` a `navigationByRole.admin` (o decidir explícitamente que el admin no la usa y quitarla de `pageAccess`).

## 7. Otros (rama feature)

La rama feature también trae 8 docs (`ARCHITECTURE`, `SYSTEM_MAP`, `ROLES_RLS`, `DESIGN_SYSTEM`, `MIGRATION_PLAN`, `QA_VISUAL`, `DECISION_LOG`, `CHANGELOG`, `MOCKUPS`) y `docs/mockups/` con 8 PNG. Coincide con lo esperado.

---

## Veredicto Fase 0

1. **No hay claves de aplicación filtradas** — el incidente se limita a datos personales (13 personas).
2. **La purga del historial sigue siendo necesaria y suficiente** para `supabase_profiles_usuarios_dmt.sql`.
3. **Falta crear `.gitignore`** (no existe).
4. La purga es de **un solo archivo en un solo commit** → operación limpia con `git filter-repo`.

Listo para ejecutar la remediación (ver sección de comandos abajo / `REMEDIACION_GIT.md`). El force-push conviene que lo ejecutes tú, coordinando antes con colaboradores del repo.
