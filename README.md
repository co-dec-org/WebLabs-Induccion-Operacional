# DMT Web-Labs
# Inducción Operacional del Sistema de Monitoreo Telemático

## 1. Propósito del proyecto

Convertir la presentación **Inducción Operacional - Sistema de Monitoreo Telemático, Ley 21.378 - Violencia Intrafamiliar** en una web-lab institucional, operativa y documentada, publicable en Vercel, versionada en GitHub y respaldada por Supabase.

La web no debe limitarse a mostrar un PDF. Debe transformarse en una experiencia de aprendizaje y consulta para operadores de la Central de Monitoreo Telemático, manteniendo el diseño, tono y contenido de la presentación original.

## 2. Tesis visual

Interfaz institucional, sobria y tecnológica: verde profundo de Gendarmería, acento dorado, alto contraste, iconografía operativa, mapas, geocercas, dispositivos, trazas y bloques de decisión claros.

La presentación manda: escudo, franja superior, jerarquía de títulos, módulos blancos con borde dorado, íconos circulares, pie institucional y contador de avance.

## 3. Marco legal-operacional de referencia

El producto debe mantenerse alineado con:

- Ley 21.378: establece monitoreo telemático en las leyes 20.066 y 19.968.
- Decreto N° 19: reglamenta la administración del sistema, incidentes técnicos, apoyos, reportes y operación.
- Ley 20.066: violencia intrafamiliar, protección efectiva y medidas cautelares/protectoras.
- Ley 19.968: tribunales de familia, medidas cautelares y competencia en materias de familia.
- Ley 20.603: contexto penal y penas sustitutivas cuando corresponda.
- Ley 21.719: protección y tratamiento de datos personales.

Principio rector: la tecnología está al servicio de la finalidad protectora de la medida. La web debe reforzar decisiones objetivas, trazables y proporcionales al riesgo.

Nomenclatura del proyecto:

- Textos amplios/formales: **Sistema de Monitoreo Telemático**.
- Textos breves, badges, menús y etiquetas UI: **S.M.T.**.

## 4. Público objetivo

- Operadores/as de Central de Monitoreo Telemático.
- Encargados/as de turno.
- Supervisores/as operacionales.
- Equipos de inducción, capacitación y mejora de procesos.

## 5. Alcance funcional

### Versión 1.0

- Web responsive con experiencia principal desktop.
- Navegación por 14 módulos equivalentes a la presentación.
- Vista tipo slide-lab: contenido visual y explicación operativa breve.
- Buscador interno por concepto: CENCO, PSC, víctima, zona de exclusión, último trazo válido, halo y triangulación.
- Modo consulta rápida para turno.
- Registro de avance por usuario.
- Bitácora de Entrenamiento del Operador como repositorio de notas contextuales capturadas desde la caja flotante en cada página.
- Plantillas copy/paste para actuación y documentación.
- Panel administrador simple para editar textos no sensibles.
- Auditoría básica de accesos, avances y cambios.

### Fuera de alcance inicial

- No registrar datos reales de víctimas, PSC ni causas judiciales.
- No reemplazar Tracker, IFT, CENCO ni sistemas oficiales.
- No emitir instrucciones jurídicas autónomas.
- No exponer mapas reales ni geolocalización de casos.
- No usar la bitácora como repositorio de casos reales.

## 6. Mapa de módulos según la presentación

| Módulo | Título | Objetivo web |
|---|---|---|
| 1 | Portada | Presentar identidad, finalidad protectora y acceso al laboratorio. |
| 2 | Marco normativo y objetivo del monitoreo | Explicar Ley 21.378, Decreto N° 19 y objetivo preventivo. |
| 3 | Marco jurídico-operacional | Relacionar ley, reglamento y protocolo. |
| 4 | Principios operacionales fundamentales | Mostrar criterios de decisión: protección, finalidad, contexto, trazabilidad, gradualidad y objetividad. |
| 5 | Actores del sistema y flujo de coordinación | Visualizar Central, víctima, PSC, CENCO, Carabineros, soporte técnico y tribunal. |
| 6 | Conceptos operacionales críticos | Definir último trazo válido, zona de exclusión, pre-exclusión, halo y triangulación. |
| 7 | Lógica operacional general | Guiar secuencia: verificar riesgo, clasificar evento, contactar, escalar y documentar. |
| 8 | Tipos de alarma técnica | Agrupar energía, señal, ubicación, integridad física y periféricos. |
| 9 | Tipos de alarma de riesgo y mixtas | Distinguir proximidad, violación de área, SOS, pérdida de señal con cercanía y eventos mixtos. |
| 10 | Protocolo CENCO y contacto telefónico | Ordenar contacto con víctima, CENCO y PSC cuando corresponda. |
| 11 | Activación CENCO y medidas de resguardo | Definir criterios de escalamiento y recomendaciones de resguardo. |
| 12 | Relación con tribunal y documentación | Reforzar documentación obligatoria y objetividad del informe. |
| 13 | Criterios del operador y principio central | Promover pensamiento operacional antes de respuesta automática. |
| 14 | Rol híbrido de la unidad | Integrar tecnología, operación y derecho al servicio de la protección. |

## 7. Arquitectura recomendada

### Frontend

- Vite + React como capa oficial de desarrollo.
- CSS propio para sistema visual institucional, sobrio y controlado.
- Componentes principales:
  - `SlideModule`
  - `OperationalConceptCard`
  - `AlarmTaxonomy`
  - `DecisionFlow`
  - `CencoProtocol`
  - `TemplatePanel`
  - `TrainingLogPanel`
  - `ProgressTracker`
  - `AdminEditor`

### Backend y datos

- Supabase Postgres.
- Supabase Auth para usuarios autorizados.
- Row Level Security en todas las tablas.
- Supabase Storage para evidencias de entrenamiento no sensibles.
- La V1 integra Supabase desde React mediante variables de entorno, Auth, perfiles, preferencias visuales y Bitácora contextual. Si faltan variables o sesión, la app mantiene respaldo local solo para revisión de prototipo.

### Productivo

- Vercel conectado a GitHub.
- Variables de entorno por ambiente:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### Repositorio GitHub

Estructura sugerida:

```txt
dmt-weblabs-induccion/
  README.md
  docs/
    marco-legal.md
    arquitectura.md
    modelo-datos.md
    guia-contenidos.md
    seguridad-datos.md
  supabase/
    schema.sql
    seed_modules.sql
    004_initial_password_flow.sql
  src/
    app/
    components/
    data/
    lib/
  public/
    slides/
    icons/
```

## 8. Modelo de datos inicial

Tablas mínimas:

- `profiles`: usuario, departamento, rol, estado y marca de cambio obligatorio de contraseña.
- `user_visual_preferences`: preferencia Boldo/Ámbar por usuario y dispositivo.
- `modules`: 14 módulos de aprendizaje.
- `module_sections`: bloques internos por módulo.
- `progress`: avance por usuario.
- `contextual_notes`: notas capturadas desde la Bitácora flotante por página/contexto.
- `training_notes`: notas contextuales del operador capturadas desde capacitaciones, láminas, marco legal, recursos u otras páginas de la web.
- `training_attachments`: evidencias de entrenamiento asociadas.
- `templates`: plantillas operacionales.
- `audit_events`: trazabilidad de acciones.

Roles oficiales V1:

- `admin`: además de ver la web como cualquier operador, tiene módulos adicionales para administración de cuentas y edición de textos asociados a las láminas.
- `supervisor`: además de ver la web como cualquier operador, visualiza el módulo `Equipo` como funcionalidad inhabilitada para una actualización posterior.
- `operador`: accede a la experiencia principal de entrenamiento, navegación por láminas, recursos, marco legal, perfil y Bitácora contextual.

Restricción técnica: el reset de acceso y operaciones sensibles de cuentas no deben ejecutarse desde el frontend con claves privilegiadas. Cualquier acción administrativa sobre usuarios debe usar Supabase Dashboard o una función backend protegida, sin exponer `service_role`.

Flujo de primer acceso:

- Cada usuario se enrola con correo institucional y clave inicial.
- La clave inicial solo permite el primer login.
- Si `profiles.must_change_password = true`, la web bloquea el ingreso al Home y muestra una capa obligatoria de cambio de contraseña.
- Después de cambiar la contraseña, se ejecuta `complete_initial_password_change()` y el usuario accede a la web según su perfil.
- No se deben subir claves iniciales, planillas de usuarios, contraseñas ni tokens al repositorio.

## 9. Seguridad y datos personales

La web debe aplicar minimización de datos. En V1 no se deben guardar:

- RUT reales.
- Nombres de víctimas.
- Nombres de PSC.
- Teléfonos reales.
- Direcciones, domicilios, lugares de trabajo o estudio.
- Coordenadas reales.
- Folios reales de causas.
- Capturas reales de Tracker o IFT con información identificable.

La caja flotante de Bitácora S.M.T. es una herramienta transversal de la experiencia autenticada. No pertenece solo a la página Bitácora ni funciona como formulario principal aislado. Su regla de uso es:

- La caja flotante de Bitácora aparece disponible en Home, Inducción/capacitaciones, Marco Legal, Recursos, Perfil y el resto de la web autenticada.
- La página de login no muestra caja flotante ni selector de vista; opera por defecto en Boldo.
- Cada nota queda asociada al contexto donde fue creada: página fuente, módulo, lámina, recurso, fecha, tipo de evidencia y estado.
- La página Bitácora consolida y muestra por defecto los registros ya creados por el usuario desde esa caja flotante, para facilitar análisis posterior.
- La creación manual de notas queda como acción secundaria.
- No debe funcionar como repositorio de casos reales ni como sistema operacional paralelo.

La Bitácora S.M.T. permite solo material simulado, anonimizado o autorizado:

- Texto hasta 1.000 caracteres por campo.
- Captura de pantalla hasta 5 MB.
- Adjunto hasta 10 MB.
- Audio hasta 60 segundos.
- Video hasta 30 segundos.

Se deben usar datos simulados, anonimizados o de entrenamiento. Si en una versión futura se requiere registrar información operacional real, debe existir evaluación jurídica, base de licitud, control de acceso reforzado, registro de tratamiento, auditoría y políticas claras de retención.

## 10. Reglas de experiencia de usuario

- La primera pantalla debe mostrar claramente que es una inducción operacional del sistema de monitoreo telemático.
- Mantener la secuencia de 14 módulos.
- Permitir saltar a modo consulta rápida durante turno.
- Diferenciar alarmas técnicas, de riesgo y mixtas.
- Usar colores de alarma con moderación:
  - Verde: estado normal / verificado.
  - Dorado: criterio operacional / atención.
  - Rojo: riesgo o escalamiento.
  - Gris: soporte técnico / información auxiliar.
- Cada módulo debe cerrar con una frase operacional simple.

## 11. Backlog priorizado

### Sprint 1 - Fundación

- Crear repositorio GitHub.
- Levantar app base.
- Definir tema visual institucional.
- Cargar los 14 módulos como JSON/MDX.
- Publicar preview en Vercel.

### Sprint 2 - Supabase

- Verificar proyecto Supabase ya creado.
- Configurar Auth con correos institucionales autorizados.
- Ejecutar tablas y RLS.
- Guardar avance de usuario.
- Guardar Bitácora S.M.T. por usuario y contexto de origen: página, módulo, lámina o recurso.
- Guardar evidencias de entrenamiento en Storage.

### Sprint 3 - Operación

- Agregar buscador interno.
- Agregar plantillas operacionales.
- Agregar vista de taxonomía de alarmas.
- Agregar flujo CENCO y checklist de documentación.

### Sprint 4 - Gobierno y despliegue

- Documentar README, arquitectura y seguridad.
- Agregar auditoría.
- Configurar variables Vercel.
- Preparar versión productiva.

## 12. Criterio de calidad

La V1 se considera lista cuando:

- La secuencia de las 14 láminas está representada en web.
- El contenido legal-operacional conserva sentido y jerarquía.
- Existe login.
- El progreso se guarda en Supabase.
- La Bitácora S.M.T. muestra los registros contextuales capturados por el usuario desde la caja flotante y permite texto, captura de pantalla, adjunto, audio y video corto.
- Hay README, schema SQL y guía de despliegue.
- No se almacenan datos personales reales.
- Vercel tiene preview y producción.

## 13. Estado del prototipo React/Vite

La base actual incluye:

- App React/Vite.
- Rutas reales: Login, Home, Inducción, Bitácora, Marco Legal, Recursos y Perfil.
- Rutas Admin: Cuentas y Editor, visibles solo para perfil `admin`.
- Módulo `Equipo` visible como inhabilitado para perfil `supervisor`.
- Login con criterio legal-operacional visible.
- Supabase integrado desde el cliente React.
- 14 láminas renderizadas en `public/slides`.
- Navegación por módulo.
- Búsqueda por conceptos operacionales.
- Progreso local de revisión.
- Bitácora S.M.T. flotante para notas contextuales por página/módulo/lámina, con respaldo Supabase o local según configuración.
- Plantillas copy/paste de entrenamiento.
- Variables preparadas para Supabase en `.env.example`.

## 14. Nombre sugerido del producto

**DMT Web-Labs - Inducción S.M.T.**

Subtítulo:

**Laboratorio operativo para capacitación, consulta y trazabilidad del Sistema de Monitoreo Telemático en contexto VIF.**

## 15. Renders aprobados

Los renders aprobados son respaldo documental de diseño. No son necesarios para el despliegue productivo en Vercel.

- Login Desktop / Boldo: `public/renders/aprobados/login-desktop-boldo-aprobado.png`.
- Home Desktop / Ámbar: `public/renders/aprobados/home-desktop-ambar-aprobado.png`.
- Bitácora Desktop / Ámbar: `public/renders/aprobados/bitacora-desktop-ambar-aprobado.png`.
- Inducción Desktop / Boldo: `public/renders/aprobados/induccion-desktop-boldo-aprobado.png`.
- Inducción Desktop / Ámbar: `public/renders/aprobados/induccion-desktop-ambar-aprobado.png`.
- Inducción modo presentación Desktop / Ámbar: `public/renders/aprobados/induccion-presentacion-desktop-ambar-aprobado.png`.
- Perfil Desktop / Ámbar: `public/renders/aprobados/perfil-desktop-ambar-aprobado.png`.
- Recursos Desktop / Boldo: `public/renders/aprobados/recursos-desktop-boldo-aprobado.png`.
- Marco Legal Desktop / Boldo: `public/renders/aprobados/marco-legal-desktop-boldo-aprobado.png`.

Criterio aprobado para Inducción: la página funciona como visor web de láminas ya diseñadas/aprobadas, con miniaturas, panel legal-operacional, modo presentación y Bitácora flotante global. No debe convertirse en una página de simulación ni en una consola operativa.
