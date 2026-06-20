# System Map

El System Map es la fuente única de verdad para roles, rutas, navegación, permisos y estados de páginas de Web-Labs Inducción Operacional.

## Roles oficiales

- operador
- supervisor
- admin

## Estados de página

- enabled: visible y funcional.
- disabled: visible, pero no interactiva.
- coming_soon: visible como próxima funcionalidad.
- hidden: no visible.
- draft: visible solo para admin.
- archived: retirada, conservada en historial.

## Páginas base

- inicio
- induccion
- simulaciones
- marco_legal
- recursos
- bitacora
- perfil
- supervision
- admin
- editor_visual

## Regla para Simulaciones

La página Simulaciones debe existir en la navegación, pero en v0.1 queda deshabilitada.

Texto oficial:

“Funcionalidad no disponible en esta versión. Módulo proyectado para una etapa posterior de entrenamiento operacional.”

## Principio de seguridad

La navegación visual no reemplaza los permisos reales. Toda ruta protegida debe validarse contra rol, estado de página y RLS en Supabase.

## Criterio legal-operacional

La plataforma es formativa. No debe registrar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas, folios, causas ni antecedentes identificables.
