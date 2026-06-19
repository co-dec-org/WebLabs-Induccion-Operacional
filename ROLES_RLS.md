# Roles y RLS

Este documento define los perfiles oficiales de Web-Labs Inducción Operacional y los criterios mínimos de seguridad para Supabase Row Level Security.

## Roles oficiales

### Operador

Accede a los contenidos base:

- Inicio
- Inducción
- Simulaciones
- Marco Legal
- Recursos
- Bitácora
- Perfil

La página Simulaciones queda visible, pero deshabilitada en v0.1.

### Supervisor

Accede a todo lo del operador, más:

- Supervisión / Indicadores
- Avance de operadores
- Actividad agregada
- Reportes formativos

El supervisor no debe administrar cuentas, permisos, versiones ni configuración crítica.

### Admin

Accede a todo lo del operador y supervisor, más:

- Admin
- Editor Visual Web Lab
- Cuentas
- Contenidos
- Versiones
- Publicación
- Auditoría
- Configuración
- Parámetros del sistema

## Reglas mínimas RLS

### profiles

- Operador: solo puede leer su propio perfil.
- Supervisor: puede leer perfiles dentro de su alcance formativo.
- Admin: puede administrar perfiles.

### user_visual_preferences

- Cada usuario solo puede leer y modificar sus propias preferencias.
- Admin puede revisar configuración general si es necesario.

### contextual_notes

- Operador: solo puede crear, leer y modificar sus propias notas.
- Supervisor: puede ver métricas agregadas, no notas privadas completas salvo regla explícita.
- Admin: puede auditar registros según necesidad institucional.

### site_pages y page_blocks

- Operador: solo lectura de contenido publicado y habilitado.
- Supervisor: solo lectura de contenido publicado y habilitado.
- Admin: puede crear, editar, versionar y publicar.

### editor_drafts

- Solo admin puede crear, leer, modificar o eliminar borradores.
- Los borradores no son visibles para operador ni supervisor.

### audit_log

- Solo admin puede consultar auditoría.
- Los eventos críticos deben registrarse sin datos personales sensibles innecesarios.

## Principios de seguridad

La navegación visual no reemplaza la seguridad real.

Toda ruta protegida debe validar:

- sesión activa;
- rol;
- estado de página;
- permisos;
- RLS en Supabase.

## Criterio legal-operacional

La plataforma es formativa y no debe registrar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas, folios, causas ni antecedentes identificables.

Todo registro debe cumplir criterios de minimización, finalidad formativa, acceso restringido y trazabilidad básica.
