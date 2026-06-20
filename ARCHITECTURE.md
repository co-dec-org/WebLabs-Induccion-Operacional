# Architecture

Este documento describe la arquitectura base y la evolución técnica de Web-Labs Inducción Operacional.

## 1. Propósito

Plataforma web formativa destinada a la inducción y capacitación de operadores del Sistema de Monitoreo Telemático.

No corresponde a un sistema operacional ni debe utilizarse para gestionar casos reales.

## 2. Tecnologías base

- React
- Vite
- JavaScript
- CSS
- Supabase
- GitHub
- Vercel

## 3. Capas de arquitectura

1. Presentación: páginas, componentes y temas visuales.
2. Aplicación: navegación, rutas, roles y estados.
3. Datos: Supabase, almacenamiento y consultas.
4. Seguridad: autenticación, permisos y RLS.
5. Despliegue: GitHub, revisión y publicación en Vercel.

## 4. System Map

El archivo `src/app/system-map/systemMap.js` funciona como fuente inicial de verdad para:

- roles;
- rutas;
- navegación;
- estados de página;
- páginas deshabilitadas;
- mensajes asociados.

La navegación visual no reemplaza la autorización real.

## 5. Roles oficiales

- Operador
- Supervisor
- Admin

Cada ruta protegida debe validar:

- sesión activa;
- rol autorizado;
- estado de la página;
- permisos aplicables;
- políticas RLS de Supabase.

## 6. Páginas principales

- Login
- Inicio
- Inducción
- Inducción modo presentación
- Simulaciones
- Marco Legal
- Recursos
- Bitácora
- Perfil
- Supervisión
- Administración
- Editor Visual Web Lab

Simulaciones permanece visible, pero deshabilitada en la versión 0.1.

## 7. Componentes objetivo

- AppShell
- Sidebar
- Topbar
- Footer
- FloatingNotes
- ThemeToggle
- PageHeader
- ProtectedRoute
- RoleGate
- PageStatusGate
- DisabledPageNotice

Estos componentes deben extraerse progresivamente sin alterar la versión funcional respaldada.

## 8. Sistema visual

### Tema Boldo

Tema institucional, monótono y sobrio. No utiliza acentos amarillos, dorados, naranjas ni ámbar.

### Tema Ámbar

Tema orientado al laboratorio y entrenamiento. Puede utilizar acentos cálidos manteniendo claridad y sobriedad institucional.

Los mockups ubicados en `docs/mockups/` son referencias de diseño y QA, no imágenes productivas.

## 9. Supabase

Supabase proporciona:

- autenticación;
- perfiles;
- preferencias;
- avance formativo;
- notas contextuales;
- contenidos;
- versiones;
- auditoría.

Reglas obligatorias:

- ninguna tabla debe quedar públicamente expuesta;
- RLS debe permanecer habilitado;
- el frontend solo utiliza credenciales públicas autorizadas;
- `service_role` nunca debe incorporarse al frontend;
- las variables de entorno no deben subirse al repositorio;
- los borradores administrativos no son visibles para operadores.

## 10. Despliegue

Flujo recomendado:

1. Desarrollo en una rama independiente.
2. Revisión técnica y visual.
3. Validación de permisos y RLS.
4. Pull request hacia `main`.
5. Despliegue controlado en Vercel.
6. Verificación posterior a la publicación.

La versión funcional inicial está respaldada mediante `v0.1-web-labs-funcional`.

## 11. Criterio legal-operacional

La plataforma debe respetar el marco asociado a:

- Ley N.º 19.968;
- Ley N.º 20.066;
- Ley N.º 20.603;
- Ley N.º 21.378;
- Ley N.º 21.719;
- Decreto N.º 19 del Ministerio de Justicia y Derechos Humanos.

Por tratarse de una plataforma formativa, no debe registrar ni exponer datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas, folios, causas judiciales ni otros antecedentes identificables.

El diseño debe aplicar:

- finalidad formativa;
- minimización de datos;
- acceso restringido;
- separación de roles;
- trazabilidad administrativa;
- seguridad por diseño;
- privacidad por diseño.

## 12. Restricciones del Editor Visual

El futuro Editor Visual Web Lab podrá modificar contenidos, bloques, orden, visibilidad, temas, borradores y versiones.

No podrá modificar:

- autenticación;
- políticas RLS;
- permisos críticos;
- cliente Supabase;
- variables de entorno;
- `service_role`;
- rutas protegidas;
- lógica de seguridad.

## 13. Estado actual

La arquitectura documental y el System Map inicial están definidos.

El siguiente paso es conectar progresivamente la navegación y las rutas reales con `systemMap.js`, sin modificar todavía el diseño visual ni las políticas de Supabase.
