# DMT Web-Labs - Induccion Operacional del Sistema de Monitoreo Telematico

## 1. Proposito del proyecto

Convertir la presentacion **Induccion Operacional - Sistema de Monitoreo Telematico, Ley 21.378 - Violencia Intrafamiliar** en una web-lab institucional, operativa y documentada, publicable en Vercel, versionada en GitHub y respaldada por Supabase.

La web no debe limitarse a mostrar un PDF. Debe transformarse en una experiencia de aprendizaje y consulta para operadores de la Central de Monitoreo Telematico, manteniendo el diseno, tono y contenido de la presentacion original.

## 2. Tesis visual

Interfaz institucional, sobria y tecnologica: verde profundo de Gendarmeria, acento dorado, alto contraste, iconografia operativa, mapas, geocercas, dispositivos, trazas y bloques de decision claros.

La presentacion manda: escudo, franja superior, jerarquia de titulos, modulos blancos con borde dorado, iconos circulares, pie institucional y contador de avance.

## 3. Marco legal-operacional de referencia

El producto debe mantenerse alineado con:

- Ley 21.378: establece monitoreo telematico en las leyes 20.066 y 19.968.
- Decreto N 19: reglamenta la administracion del sistema, incidentes tecnicos, apoyos, reportes y operacion.
- Ley 20.066: violencia intrafamiliar, proteccion efectiva y medidas cautelares/protectoras.
- Ley 19.968: tribunales de familia, medidas cautelares y competencia en materias de familia.
- Ley 20.603: contexto penal y penas sustitutivas cuando corresponda.
- Ley 21.719: proteccion y tratamiento de datos personales.

Principio rector: la tecnologia esta al servicio de la finalidad protectora de la medida. La web debe reforzar decisiones objetivas, trazables y proporcionales al riesgo.

Nomenclatura del proyecto:

- Textos amplios/formales: **Sistema de Monitoreo Telematico**.
- Textos breves, badges, menus y etiquetas UI: **S.M.T.**.

## 4. Publico objetivo

- Operadores/as de Central de Monitoreo Telematico.
- Encargados/as de turno.
- Supervisores/as operacionales.
- Equipos de induccion, capacitacion y mejora de procesos.

## 5. Alcance funcional

### Version 1.0

- Web responsive con experiencia principal desktop.
- Navegacion por 14 modulos equivalentes a la presentacion.
- Vista tipo slide-lab: contenido visual + explicacion operativa breve.
- Buscador interno por concepto: CENCO, PSC, victima, zona de exclusion, ultimo trazo valido, halo, triangulacion.
- Modo consulta rapida para turno.
- Registro de avance por usuario.
- Bitacora de Entrenamiento del Operador como repositorio de notas contextuales capturadas desde la caja flotante en cada pagina.
- Plantillas copy/paste para actuacion y documentacion.
- Panel administrador simple para editar textos no sensibles.
- Auditoria basica de accesos, avances y cambios.

### Fuera de alcance inicial

- No registrar datos reales de victimas, PSC ni causas judiciales.
- No reemplazar Tracker, IFT, CENCO ni sistemas oficiales.
- No emitir instrucciones juridicas autonomas.
- No exponer mapas reales ni geolocalizacion de casos.
- No usar la bitacora como repositorio de casos reales.

## 6. Mapa de modulos segun la presentacion

| Modulo | Titulo | Objetivo web |
|---|---|---|
| 1 | Portada | Presentar identidad, finalidad protectora y acceso al laboratorio. |
| 2 | Marco normativo y objetivo del monitoreo | Explicar Ley 21.378, Decreto N 19 y objetivo preventivo. |
| 3 | Marco juridico-operacional | Relacionar ley, reglamento y protocolo. |
| 4 | Principios operacionales fundamentales | Mostrar criterios de decision: proteccion, finalidad, contexto, trazabilidad, gradualidad y objetividad. |
| 5 | Actores del sistema y flujo de coordinacion | Visualizar Central, victima, PSC, CENCO, Carabineros, soporte tecnico y tribunal. |
| 6 | Conceptos operacionales criticos | Definir ultimo trazo valido, zona de exclusion, pre-exclusion, halo y triangulacion. |
| 7 | Logica operacional general | Guiar secuencia: verificar riesgo, clasificar evento, contactar, escalar y documentar. |
| 8 | Tipos de alarma tecnica | Agrupar energia, senal, ubicacion, integridad fisica y perifericos. |
| 9 | Tipos de alarma de riesgo y mixtas | Distinguir proximidad, violacion de area, SOS, perdida de senal con cercania y eventos mixtos. |
| 10 | Protocolo CENCO y contacto telefonico | Ordenar contacto con victima, CENCO y PSC cuando corresponda. |
| 11 | Activacion CENCO y medidas de resguardo | Definir criterios de escalamiento y recomendaciones de resguardo. |
| 12 | Relacion con tribunal y documentacion | Reforzar documentacion obligatoria y objetividad del informe. |
| 13 | Criterios del operador y principio central | Promover pensamiento operacional antes de respuesta automatica. |
| 14 | Rol hibrido de la unidad | Integrar tecnologia, operacion y derecho al servicio de la proteccion. |

## 7. Arquitectura recomendada

### Frontend

- Vite + React como capa oficial de desarrollo.
- CSS propio para sistema visual institucional, sobrio y controlado.
- Componentes:
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
- La V1 integra Supabase desde React mediante variables de entorno, Auth, perfiles, preferencias visuales y Bitacora contextual. Si faltan variables o sesion, la app mantiene respaldo local solo para revision de prototipo.

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

Tablas minimas:

- `profiles`: usuario, rol, estado.
- `modules`: 14 modulos de aprendizaje.
- `module_sections`: bloques internos por modulo.
- `progress`: avance por usuario.
- `training_notes`: notas contextuales del operador capturadas desde capacitaciones, laminas, marco legal, recursos u otras paginas de la web.
- `training_attachments`: evidencias de entrenamiento asociadas.
- `templates`: plantillas operacionales.
- `audit_events`: trazabilidad de acciones.

Roles sugeridos:

- `admin`: gestiona contenidos y usuarios.
- `supervisor`: revisa avance y notas operativas.
- `operador`: consulta modulos, completa avance y guarda notas personales.
- `lector`: acceso solo lectura.

## 9. Seguridad y datos personales

La web debe aplicar minimizacion de datos. En V1 no se deben guardar:

- RUT reales.
- Nombres de victimas.
- Nombres de PSC.
- Telefonos reales.
- Direcciones, domicilios, lugares de trabajo o estudio.
- Coordenadas reales.
- Folios reales de causas.
- Capturas reales de Tracker o IFT con informacion identificable.

La caja flotante de Bitacora S.M.T. es una herramienta transversal de la experiencia autenticada. No pertenece solo a la pagina Bitacora ni funciona como formulario principal aislado. Su regla de uso es:

- La caja flotante de Bitacora aparece disponible en Home, Induccion/capacitaciones, Marco legal, Recursos, Perfil y el resto de la web autenticada.
- La pagina de login no muestra caja flotante ni selector de vista; opera por defecto en Boldo.
- Cada nota queda asociada al contexto donde fue creada: pagina fuente, modulo, lamina, recurso, fecha, tipo de evidencia y estado.
- La pagina Bitacora consolida y muestra por defecto los registros ya creados por el usuario desde esa caja flotante, para facilitar analisis posterior.
- La creacion manual de notas queda como accion secundaria.
- No debe funcionar como repositorio de casos reales ni como sistema operacional paralelo.

La Bitacora S.M.T. permite solo material simulado, anonimizado o autorizado:

- Texto hasta 1.000 caracteres por campo.
- Captura de pantalla hasta 5 MB.
- Adjunto hasta 10 MB.
- Audio hasta 60 segundos.
- Video hasta 30 segundos.

Se deben usar datos simulados, anonimizados o de entrenamiento. Si en una version futura se requiere registrar informacion operacional real, debe existir evaluacion juridica, base de licitud, control de acceso reforzado, registro de tratamiento, auditoria y politicas claras de retencion.

## 10. Reglas de experiencia de usuario

- La primera pantalla debe mostrar claramente que es una induccion operacional del sistema de monitoreo telematico.
- Mantener la secuencia de 14 modulos.
- Permitir saltar a modo consulta rapida durante turno.
- Diferenciar alarmas tecnicas, de riesgo y mixtas.
- Usar colores de alarma con moderacion:
  - Verde: estado normal / verificado.
  - Dorado: criterio operacional / atencion.
  - Rojo: riesgo o escalamiento.
  - Gris: soporte tecnico / informacion auxiliar.
- Cada modulo debe cerrar con una frase operacional simple.

## 11. Backlog priorizado

### Sprint 1 - Fundacion

- Crear repositorio GitHub.
- Levantar app base.
- Definir tema visual institucional.
- Cargar los 14 modulos como JSON/MDX.
- Publicar preview en Vercel.

### Sprint 2 - Supabase

- Verificar proyecto Supabase ya creado.
- Configurar Auth con correos institucionales autorizados.
- Ejecutar tablas y RLS.
- Guardar avance de usuario.
- Guardar Bitacora S.M.T. por usuario y contexto de origen: pagina, modulo, lamina o recurso.
- Guardar evidencias de entrenamiento en Storage.

### Sprint 3 - Operacion

- Agregar buscador interno.
- Agregar plantillas operacionales.
- Agregar vista de taxonomia de alarmas.
- Agregar flujo CENCO y checklist de documentacion.

### Sprint 4 - Gobierno y despliegue

- Documentar README, arquitectura y seguridad.
- Agregar auditoria.
- Configurar variables Vercel.
- Preparar version productiva.

## 12. Criterio de calidad

La V1 se considera lista cuando:

- La secuencia de las 14 laminas esta representada en web.
- El contenido legal-operacional conserva sentido y jerarquia.
- Existe login.
- El progreso se guarda en Supabase.
- La Bitacora S.M.T. muestra los registros contextuales capturados por el usuario desde la caja flotante y permite texto, captura de pantalla, adjunto, audio y video corto.
- Hay README, schema SQL y guia de despliegue.
- No se almacenan datos personales reales.
- Vercel tiene preview y produccion.

## 13. Estado del prototipo React/Vite

La base actual incluye:

- App React/Vite.
- Rutas reales: Login, Home, Induccion, Bitacora, Marco Legal, Recursos y Perfil.
- Login con criterio legal-operacional visible.
- Supabase integrado desde el cliente React.
- 14 laminas renderizadas en `public/slides`.
- Navegacion por modulo.
- Busqueda por conceptos operacionales.
- Progreso local de revision.
- Bitacora S.M.T. flotante para notas contextuales por pagina/modulo/lamina, con respaldo Supabase o local segun configuracion.

## 14. Renders aprobados

- `public/renders/aprobados/login-desktop-boldo-v1-aprobado.png`: pagina Login Desktop aprobada. Criterios: vista Boldo fija, acceso institucional, metodo alternativo inhabilitado, texto legal-operacional visible, sin selector visual y sin indicadores operacionales.
- Plantillas copy/paste de entrenamiento.
- Variables preparadas para Supabase en `.env.example`.

## 14. Nombre sugerido del producto

**DMT Web-Labs - Induccion S.M.T.**

Subtitulo:

**Laboratorio operativo para capacitacion, consulta y trazabilidad del Sistema de Monitoreo Telematico en contexto VIF.**

## 15. Renders aprobados para produccion

- Login Desktop / Boldo: `public/renders/aprobados/login-desktop-boldo-aprobado.png`.
- Home Desktop / Ambar: `public/renders/aprobados/home-desktop-ambar-aprobado.png`.
- Bitacora Desktop / Ambar: `public/renders/aprobados/bitacora-desktop-ambar-aprobado.png`.
- Induccion Desktop / Boldo: `public/renders/aprobados/induccion-desktop-boldo-aprobado.png`.
- Induccion Desktop / Ambar: `public/renders/aprobados/induccion-desktop-ambar-aprobado.png`.
- Induccion modo presentacion Desktop / Ambar: `public/renders/aprobados/induccion-presentacion-desktop-ambar-aprobado.png`.
- Perfil Desktop / Ambar: `public/renders/aprobados/perfil-desktop-ambar-aprobado.png`.
- Recursos Desktop / Boldo: `public/renders/aprobados/recursos-desktop-boldo-aprobado.png`.
- Marco Legal Desktop / Boldo: `public/renders/aprobados/marco-legal-desktop-boldo-aprobado.png`.

Criterio aprobado para Induccion: la pagina funciona como visor web de laminas ya disenadas/aprobadas, con miniaturas, panel legal-operacional, modo presentacion y Bitacora flotante global. No debe convertirse en una pagina de simulacion ni en una consola operativa.
