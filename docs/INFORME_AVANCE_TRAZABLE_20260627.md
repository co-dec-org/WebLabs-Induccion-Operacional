---
title: "Informe de avance trazable — DMT Gestión de Aprendizaje"
subtitle: "Web-Lab Inducción Operacional · Departamento de Monitoreo Telemático"
date: "27 de junio de 2026"
lang: es
---

# Informe de avance trazable — DMT Gestión de Aprendizaje

**Proyecto:** Web-Lab Inducción Operacional (`co-dec-org/WebLabs-Induccion-Operacional`)
**Naturaleza:** plataforma web **formativa** del Departamento de Monitoreo Telemático (Gendarmería de Chile).
**Stack:** React + Vite + Supabase + Vercel.
**Fecha de corte:** 27 de junio de 2026.

---

## 1. ¿Cuánto tiempo lleva de vida el proyecto?

Según el historial versionado en Git (fuente de verdad y trazabilidad):

- **Primer commit:** 16 de junio de 2026 ("Initial commit").
- **Último commit:** 27 de junio de 2026.
- **Vida del proyecto:** **11 días** (del 16 al 27 de junio de 2026).
- **Total de commits:** **64**.

En esos 11 días el proyecto pasó de una versión funcional inicial a una plataforma con
arquitectura documentada, editor visual, telemetría de navegación anónima **en vivo** y un
tablero de indicadores integrado en la app.

---

## 2. Línea de tiempo trazable (por fecha, desde Git)

| Fecha | Hito | Evidencia (commits) |
|---|---|---|
| **16–17 jun** | Versión funcional inicial y cargas base (QA visual V5, notas y perfiles DMT). | `Initial commit`, `Add files via upload`, `QA visual V5 notas y perfiles DMT` |
| **19 jun** | Base documental de arquitectura y **System Map** inicial (fuente única de roles, rutas, estados). | `Create ARCHITECTURE/SYSTEM_MAP/ROLES_RLS/DESIGN_SYSTEM/MIGRATION_PLAN/DECISION_LOG/CHANGELOG/MOCKUPS/QA_VISUAL`, `Create systemMap.js`, `Alinear System Map…` |
| **20 jun** | **Fase 0** (purga de datos personales del historial) · **Fase 1** (navegación Paso 2B + gates) · **Editor Visual** (modelo de datos + RLS, seed, render desde BD) · **Fase 2** (modularización App.jsx + CSS) · migración `013`. | `security(db): purga datos personales…`, `feat(nav): Paso 2B…`, `chore(db): modelo de datos del Editor…`, `refactor: Fase 2…`, `Create 013_…` |
| **21 jun** | Editor: biblioteca de bloques, preview por pantalla, publicar/versionar · responsive (marco fluido tablet/iPad) · migración `014` (telemetría, creada). | `feat(editor): biblioteca de bloques…`, `feat(editor): preview por pantalla…`, `fix(responsive): marco fluido…`, `Create 014_nav_analytics.sql` |
| **27 jun** | **Telemetría de navegación anónima EN VIVO** (`navTrace` + `navStats`, migración `014` aplicada, fix de vista `015`) · **Tablero Constelar** integrado en la app (página Supervisión) con panel destacado, detalle por página y selectores. | `feat(analytics): telemetría…`, `feat(supervision): Tablero Constelar…`, `feat(supervision): panel destacado…` |

> Nota: el grueso del trabajo se concentra en tres jornadas intensas (20, 21 y 27 de junio),
> sobre la base funcional del 16–19 de junio.

---

## 3. Estado actual por área

### 3.1 Arquitectura
React + Vite + Supabase + Vercel, en cinco capas (presentación, aplicación, datos, seguridad,
despliegue). El **System Map** centraliza roles (operador/supervisor/admin), rutas, estados de
página y permisos; toda ruta protegida valida sesión, rol, estado y RLS. Código modularizado
(`components/`, `features/`, `lib/`, `styles/`). **Nota técnica crítica:** transform de JSX clásico
→ cada `.jsx` debe `import React`.

### 3.2 Base de datos (Supabase)
Migraciones: `004` (primer acceso), `010`–`012` (editor visual: esquema, seed, publicar/versionar),
`013` (fix recursión RLS), `014` (telemetría `nav_traces` + vista), `015` (corrección de la vista:
`visitas` cuenta solo eventos `view`). RLS habilitado en todas las tablas; datos personales reales
viven solo en Supabase, nunca en el repo.

### 3.3 Telemetría de navegación (EN VIVO)
`src/lib/navTrace.js` registra de forma **anónima** cada entrada/salida de página (sesión anónima
aleatoria por pestaña, sin PII), y `src/lib/navStats.js` la lee para los 4 indicadores. Verificado
de punta a punta: se registran recorridos, tiempos por página y tema, todo cumpliendo Ley 21.719.

### 3.4 Visualización — Tablero Constelar (integrado en la app)
Página **Supervisión** ("Equipo", solo supervisor/admin) con el tablero de 4 indicadores:
**Visitas** (constelación), **Tiempo medio** (túnel del tiempo), **Índice compuesto aD\_** (nebulosa),
**Recorridos** (asteroides). Incluye un **panel destacado** (un indicador abierto en detalle por
defecto) con desglose por página, y los 4 como selectores. Skins Boldo (verde monótono) / Ámbar
(verde + dorado de contraste). Alimentado por `navStats`, con datos de muestra de respaldo.

### 3.5 Editor Visual y responsive
Editor operativo (editar → publicar → versionar → restaurar) con preview por pantalla. Responsive
en mejora continua (patrón fluido), pendiente QA final en iPad.

---

## 4. Cumplimiento legal (Ley 21.719)

- **Fase 0** remedió una fuga de datos personales reales (13 funcionarios) purgándola de **todo el
  historial Git**, con plantilla de reemplazo y `.gitignore`. Verificado.
- **Telemetría anónima por diseño:** sin nombre, correo, UUID ni IP; minimización de datos;
  acceso por RLS (lectura solo supervisor/admin).
- **No** se registran datos reales de víctimas, PSC, domicilios, causas ni antecedentes
  identificables. Material de referencia con derechos (iStock) se mantiene fuera del repo.

---

## 5. Pendientes

1. Fusionar a `main` y verificar el Tablero en producción (página "Equipo").
2. Dejar acumular trazas reales y revisar los indicadores con datos.
3. Estandarización de carpetas a `DMT Gestión de Aprendizaje` (Git local + Drive).
4. QA responsive en iPad; alineación documentación ↔ código; extracción fina de componentes.
5. Módulo Simulaciones (proyectado) y Bitácora contextual robusta.

---

## 6. Convención de gestión documental (estándar del proyecto)

- **Git** (`~/Desktop/GitHub/<PROYECTO>/`): código, configuración y **`.md` fuente** (versionados).
  Respaldo: GitHub.
- **Drive** (`~/Desktop/Google Drive/_agentic Ai/<PROYECTO>/`): material complementario y **no
  versionado** → informes/entregables (`.docx`, `.pdf`), capturas y referencias.
- Los `.md` son la fuente editable; sus exportaciones `.docx`/`.pdf` viven en Drive.
- **Formato de impresión estándar: A4** para todos los entregables, de aquí en adelante.
- Nunca se versionan secretos (`.env`, claves) ni en Git ni en Drive.

*Este informe: `.md` en Git (`docs/`), `.docx` y `.pdf` (A4) en Drive.*
