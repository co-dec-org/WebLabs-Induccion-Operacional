---
title: "Protocolo de Desarrollo Web"
subtitle: "Estándar de proyecto · co-dec / Departamento de Monitoreo Telemático"
date: "Versión 1.0 — 28 de junio de 2026"
lang: es
---

# Protocolo de Desarrollo Web

**Documento normativo y reutilizable.** Define el protocolo estándar para proyectos de desarrollo
web del equipo: organización de carpetas, control de versiones, despliegue, base de datos y
seguridad, formatos de entregables, trazabilidad y cumplimiento legal. Aplica a todos los proyectos
de aquí en adelante. Sustituir `<PROYECTO>` por el nombre del proyecto (idéntico en todas las
ubicaciones).

> Origen: derivado de la práctica del proyecto **Web-Lab Inducción Operacional (DMT Gestión de
> Aprendizaje)**, React + Vite + Supabase + Vercel.

---

## 1. Propósito y alcance

Estandarizar **cómo se organiza, versiona, despliega, documenta y asegura** un proyecto web, de
modo que cualquier integrante (o asistente como Cowork) pueda incorporarse y operar con reglas
claras, trazables y repetibles. El protocolo cubre desde la estructura de carpetas hasta el
cumplimiento de protección de datos (Ley 21.719).

## 2. Principios rectores

1. **Una sola fuente de verdad por tipo de activo:** el código vive en Git; el material
   complementario vive en Drive. Nada se duplica como "fuente".
2. **Trazabilidad:** todo cambio relevante queda registrado (commits, migraciones numeradas,
   bitácora de decisiones, informes con fecha).
3. **Seguridad y privacidad por diseño:** sin datos personales reales ni secretos en el repositorio;
   RLS y minimización de datos siempre.
4. **Mejora continua (LEAN/Kaizen):** avances incrementales, verificados por evidencia, sin romper
   la versión funcional.
5. **Reversibilidad:** toda acción de riesgo se hace de forma que se pueda volver atrás (ramas,
   respaldos, releases).

---

## 3. Organización de carpetas (Git ↔ Drive)

**Regla central:** el repositorio de código **no debe vivir dentro de una carpeta sincronizada en
tiempo real** (Google Drive, Dropbox, iCloud). La sincronización interfiere con la carpeta `.git`
(archivos que cambian a cada segundo), produciendo **corrupción de índice, candados pegados
(`index.lock`) y copias de conflicto** (`.fuse_hidden…` en Drive, `… (conflicted copy)` en Dropbox).
El respaldo del código **ya es GitHub**; duplicarlo en la nube sincronizada solo añade problemas.

### 3.1 Estructura estándar

- **Repositorio de código (Git):** `~/Desktop/GitHub/<PROYECTO>/`
  Contiene: código fuente, configuración, archivos `.md` **fuente**, y los binarios que la
  aplicación sirve o necesita (p. ej. `/public/docs`, `/public/skins`, logos).
  **Respaldo:** GitHub (`commit + push`).

- **Carpeta complementaria (Drive):** `~/Desktop/Google Drive/.../<PROYECTO>/`
  Contiene: todo lo que **no** va en Git → informes y entregables (`.docx`, `.pdf`, `.pptx`),
  capturas de pantalla, material de referencia y archivos no versionados.
  **Respaldo:** sincronización automática del proveedor.

### 3.2 Reglas de ubicación

1. **Código y `.md` fuente** → repositorio Git.
2. **Entregables de oficina, capturas y material complementario** → Drive.
3. **Excepción:** los binarios que la app **sirve o necesita** se quedan en Git (p. ej. `/public`).
4. Los `.md` son la **fuente editable y versionada**; sus **exportaciones** (`.docx`/`.pdf`) viven
   en Drive.
5. **Nunca** se ponen secretos (`.env`, claves, tokens, `service_role`) ni datos personales reales,
   ni en Git ni en Drive.
6. **Respaldo:** `commit + push` frecuente en Git; Drive sincroniza solo.

### 3.3 Convención de nombres

`<PROYECTO>` se escribe **idéntico** en la carpeta de Git y en la de Drive. La carpeta local del
repo puede tener un nombre distinto al del repositorio remoto en GitHub (el nombre remoto no se
altera); lo que se estandariza es el nombre **local** del proyecto.

---

## 4. Control de versiones (Git / GitHub)

1. **Rama `main` = producción.** Lo que está en `main` es lo desplegado.
2. **Trabajo de riesgo en ramas aparte** (`feature/...`). Se prueba en *preview* y solo entonces se
   fusiona a `main`.
3. **Commits pequeños y descriptivos**, con prefijo de tipo: `feat`, `fix`, `refactor`, `docs`,
   `security`, `chore`. Ejemplo: `feat(analytics): telemetría de navegación anónima`.
4. **`push` frecuente:** GitHub es el respaldo del código; solo respalda lo que se ha subido.
5. **`.gitignore` obligatorio**, cubriendo:
   - Secretos: `.env`, `.env.*`.
   - Dependencias y build: `node_modules/`, `dist/`, `.vite/`.
   - Sistema: `.DS_Store`, `*.log`.
   - Material complementario que vive en Drive: capturas, referencias, **exportaciones de oficina**
     (`*.docx`, `*.pdf` fuera de `/public`).
   - Datos reales de usuarios (planillas, `*_usuarios_*.sql`), permitiendo solo plantillas
     `*.example.sql`.
6. **2FA habilitado** en GitHub para todas las cuentas con acceso.
7. **Repo público vs privado:** si el repo es público, extremar el cuidado de no subir PII ni mapa
   de infraestructura. Ante una fuga, **purgar el historial completo** (`git filter-repo`), no solo
   el último commit.
8. **Git y carpetas sincronizadas no se mezclan** (ver §3). Si GitHub Desktop pierde la ruta tras
   mover/renombrar la carpeta, usar **Locate…**; si queda un `index.lock`, eliminarlo.

---

## 5. Despliegue continuo (Vercel)

1. **Auto-deploy desde `main`:** cada `push` a `main` actualiza producción.
2. **Preview por rama:** cada rama/PR genera un despliegue de **previsualización** con URL propia
   para probar **sin tocar producción**.
3. **Verificación post-despliegue:** tras cada deploy, confirmar la función afectada en producción.
4. **Reversión instantánea** disponible ante un despliegue defectuoso (*Instant Rollback*).
5. **Variables de entorno** se configuran en el panel de Vercel/Supabase, **nunca** en el repo.

---

## 6. Base de datos y seguridad (Supabase)

1. **Migraciones numeradas y versionadas** en el repo: `supabase/NNN_descripcion.sql` (aditivas,
   idempotentes cuando sea posible). Mantener **base de datos y repo en sincronía**.
2. **RLS habilitado en todas las tablas.** Toda lectura/escritura sensible se restringe por rol.
3. **Funciones `SECURITY DEFINER` endurecidas:**
   - Fijar `search_path` (evita escalada por manipulación del `search_path`).
   - Revocar `EXECUTE` a `anon`/`public`; conceder solo a `authenticated` donde se requiera.
4. **Vistas:** crear con `security_invoker = on` para que respeten el RLS de las tablas base (de lo
   contrario corren como *definer* y lo saltan).
5. **Security Advisor:** resolver **todos los errores críticos**; documentar como "revisados y
   aceptados" los *warnings* inherentes (p. ej. funciones que la app legítimamente necesita).
   Activar **Leaked Password Protection** en Auth.
6. **Respaldos:** en planes sin backup automático, definir una **política de respaldo** (export
   periódico) y de **retención** de datos.
7. **Secretos:** `service_role` y claves **solo** en variables de entorno; jamás en el frontend ni
   en el repo.

---

## 7. Formatos de entregables y documentación

1. **`.md` = fuente versionada** (vive en Git, normalmente en `docs/`). Es lo editable y trazable.
2. **`.docx` / `.pdf` / `.pptx` = exportaciones / entregables** (viven en Drive).
3. **Formato de impresión estándar: A4** para todos los entregables imprimibles.
4. **Cuidado de saltos de página:** al exportar, evitar que el contenido se "quiebre" — encabezados
   con *keep-with-next* (no quedan huérfanos al pie) y filas de tabla que **no se parten** entre
   páginas.
5. **Cadena de exportación recomendada:** `.md` → `.docx` (con página A4 y ajustes de salto) →
   `.pdf`. Herramientas: *pandoc* + *python-docx* (A4 y `cantSplit`) + *LibreOffice* headless.
6. **Nombres de informe:** `INFORME_<TIPO>_AAAAMMDD.md` (p. ej. `INFORME_AVANCE_20260627.md`). Las
   exportaciones conservan el mismo nombre con su extensión.
7. **Documentación base del repo** (recomendada en `docs/` o raíz): `ARCHITECTURE.md`,
   `SYSTEM_MAP.md`, `ROLES_RLS.md`, `DESIGN_SYSTEM.md`, `MIGRATION_PLAN.md`, `DECISION_LOG.md`,
   `CHANGELOG.md`, `QA_VISUAL.md`.

---

## 8. Seguridad, privacidad y cumplimiento (Ley 21.719)

1. **Sin datos personales reales** en el repo (especialmente público): nombres, correos, UUID, IP,
   ni antecedentes identificables. Usar **plantillas con placeholders**.
2. **Datos reales solo en el backend** (Supabase: Auth + `profiles`), protegidos por RLS.
3. **Telemetría anónima por diseño:** identificador de sesión aleatorio, no ligado a la identidad,
   descartado al cerrar la pestaña; minimización de datos; lectura restringida por RLS.
4. **Material con derechos** (imágenes de stock, referencias) **no se versiona** en el repo público;
   vive en Drive.
5. **Base de licitud y aviso:** definir con el área legal la base de licitud de la telemetría y el
   aviso al usuario, aunque la data sea anónima.
6. **Ante una fuga:** purgar el historial Git completo, rotar credenciales expuestas, activar
   *secret scanning* / *push protection*.

---

## 9. Trazabilidad y registro

1. **El historial de commits es la fuente de verdad** de la cronología del proyecto (primer commit
   = inicio; mensajes = qué se hizo y cuándo).
2. **Bitácora de decisiones (`DECISION_LOG.md`):** fecha, decisión, motivo, impacto, estado.
3. **Changelog (`CHANGELOG.md`):** cambios relevantes por versión/release.
4. **Informes de avance trazables:** cada hito documentado con su evidencia (commits/migraciones),
   exportado a Drive en A4.
5. **Releases/tags** para congelar versiones funcionales (p. ej. `v0.1-funcional`).

---

## 10. Cuentas y servicios

1. Mantener un registro de las cuentas/servicios del proyecto (Git · Supabase · Vercel · otros) en
   un documento **complementario en Drive** (no en el repo público), con **solo identificadores no
   sensibles** (organización, proyecto, dominio, región, plan).
2. **Nunca** registrar claves, tokens, `service_role` ni contraseñas en ese documento.
3. Anotar pendientes operativos (2FA, respaldos, límites de plan) para seguimiento.

---

## 11. Flujo de trabajo (ciclo de mejora continua)

1. **Planificar** el incremento (tarea acotada, con criterio de verificación).
2. **Implementar** en rama o directo según el riesgo; mantener la versión funcional respaldada.
3. **Verificar** (build/runtime, QA visual contra mockups, pruebas de permisos/RLS, sin datos
   reales sensibles).
4. **Previsualizar** (deploy de rama) cuando el cambio sea riesgoso; probar antes de fusionar.
5. **Publicar** (`merge` a `main` → deploy) y **verificar en producción**.
6. **Registrar** (commit descriptivo, actualizar docs/decision log si aplica).
7. **Repetir** con el siguiente incremento.

> Nota técnica recurrente: si el transform de JSX es clásico (sin `@vitejs/plugin-react`), **cada
> archivo `.jsx` debe `import React`**; el build no lo detecta y falla en runtime.

---

## 12. Checklist operativo (resumen aplicable)

- [ ] Repo de código en carpeta **local** (no sincronizada) + GitHub como respaldo.
- [ ] `<PROYECTO>` idéntico en Git y Drive.
- [ ] `.gitignore` cubre secretos, dependencias, exportaciones y material complementario.
- [ ] `main` = producción; trabajo de riesgo en ramas + preview.
- [ ] Migraciones numeradas y en sincronía con la base de datos.
- [ ] RLS habilitado; funciones `SECURITY DEFINER` con `search_path` fijo y `EXECUTE` restringido.
- [ ] Vistas con `security_invoker = on`.
- [ ] Security Advisor sin críticos; *Leaked Password Protection* activo.
- [ ] `.md` en Git; `.docx`/`.pdf` (A4) en Drive, sin quebrar contenido.
- [ ] Sin PII ni secretos en el repo (más aún si es público).
- [ ] Registro de cuentas/servicios en Drive, sin claves.
- [ ] 2FA habilitado; release/tag de versiones funcionales.

---

## 13. Anexo — estructura de ejemplo

```
~/Desktop/GitHub/<PROYECTO>/            ← Git (código + .md fuente)
├── docs/                               ← documentación .md (incluye este protocolo)
├── public/                             ← binarios que sirve la app
├── src/                                ← código fuente
├── supabase/NNN_*.sql                  ← migraciones versionadas
├── .gitignore
└── README.md

~/Desktop/Google Drive/.../<PROYECTO>/  ← Drive (complementario, no versionado)
├── INFORME_*_AAAAMMDD.docx / .pdf      ← entregables A4
├── CUENTAS_Y_SERVICIOS.md              ← registro de cuentas (sin secretos)
├── Referencias/                        ← material con derechos / referencia
└── Capturas/                           ← capturas de QA
```

*Documento vivo. Actualizar la versión y la fecha ante cada cambio del protocolo.*
