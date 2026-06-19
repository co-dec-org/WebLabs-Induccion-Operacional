# Decision Log

Este documento registra las decisiones técnicas, visuales y operacionales relevantes del proyecto Web-Labs Inducción Operacional.

## Formato de registro

Cada decisión debe documentarse con:

- fecha;
- decisión;
- motivo;
- impacto;
- estado.

## Decisiones iniciales

### 2026-06-19 — Congelar versión funcional inicial

Decisión: se creó una versión de respaldo antes de iniciar el refactor arquitectónico.

Motivo: proteger la versión funcional actual antes de modificar rutas, roles, navegación y estructura interna.

Impacto: permite volver a una versión estable si el refactor genera errores.

Estado: aprobado.

### 2026-06-19 — Crear rama de arquitectura

Decisión: el trabajo de refactor se realizará en la rama feature/architecture-system-map.

Motivo: evitar cambios directos sobre main.

Impacto: permite trabajar de forma controlada y revisar antes de fusionar.

Estado: aprobado.

### 2026-06-19 — Incorporar mockups oficiales

Decisión: los mockups oficiales se almacenan en docs/mockups/.

Motivo: contar con una referencia visual formal para QA y evolución de componentes.

Impacto: las páginas deben traducir los mockups a componentes React reutilizables, no usarlos como imágenes estáticas.

Estado: aprobado.

### 2026-06-19 — Crear System Map inicial

Decisión: se creó src/app/system-map/systemMap.js como fuente inicial de verdad.

Motivo: centralizar roles, rutas, navegación y estados de páginas.

Impacto: reduce inconsistencias entre navegación visual, rutas y permisos.

Estado: aprobado.

### 2026-06-19 — Simulaciones queda deshabilitada en v0.1

Decisión: la página Simulaciones queda visible en navegación, pero no interactiva.

Motivo: reservar el módulo para una etapa posterior de entrenamiento operacional.

Impacto: debe mostrarse con estado disabled y mensaje informativo.

Estado: aprobado.

## Criterio legal-operacional

La plataforma es formativa. No debe registrar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas, folios, causas ni antecedentes identificables.
