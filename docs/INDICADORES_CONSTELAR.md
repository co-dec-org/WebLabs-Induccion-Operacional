# Indicadores Constelar — documentación de los 4 KPI de navegación

Cada KPI se define por: **qué mide**, su **unidad**, el **origen del dato** (consulta sobre
`nav_traces` en Supabase), **para qué sirve** como indicador, y su **visualización** (skin
Constelar, temas DMT Boldo/Ámbar). Hoy con datos de muestra; al conectar `nav_traces` se alimenta
de datos reales.

## Resumen

| Indicador | Unidad | Qué mide | Visualización |
|---|---|---|---|
| Visitas | visitas | Atención / popularidad por página | Constelación de estrellas (cada página = una estrella; brillo/tamaño = visitas) |
| Tiempo medio | s / visita | Permanencia / engagement real | Túnel del tiempo 3D navegable (profundidad = permanencia; 0 s → ∞; fondo estelar al infinito) |
| Índice compuesto (aD_) | aD_ (visitas × tiempo) | Valor/actividad del activo digital | Recorrido 3D vs tiempo (nebulosas volumétricas; profundidad = tiempo; hoy al frente → 7 días al fondo) |
| Recorridos | flujo (transiciones) | Adherencia a la ruta y desvíos | Asteroides 3D sobre la ruta lógica (rotable, movimiento lento) |

---

## 1. Visitas
- **Qué mide:** cuántas veces se abre cada página. La atención que recibe cada contenido.
- **Unidad:** visitas (conteo).
- **Origen del dato:** `select route, count(*) from nav_traces where event_type='view' group by route`.
- **Para qué sirve:** ver qué contenido se consulta y cuál se ignora → qué reforzar o retirar.
- **Visualización:** **constelación de estrellas 3D** — cada página es una estrella discreta (brillo y
  tamaño = sus visitas) con su propio enjambre de partículas; líneas tenues conectan las más visitadas;
  fondo de campo profundo. Rotable, con botones de vista flotantes (distinta de la nebulosa del Índice).
- **Estado:** mockup 3D listo; pendiente visto bueno final.

## 2. Tiempo medio
- **Qué mide:** segundos por visita. La profundidad de uso (no solo el clic, sino la dedicación).
- **Unidad:** segundos / visita.
- **Origen del dato:** `select route, round(avg(duration_ms)/1000) from nav_traces where duration_ms is not null group by route`.
- **Para qué sirve:** distinguir "pasaron de largo" de "se quedaron a estudiar" → engagement real.
- **Visualización:** **túnel del tiempo 3D** (elíptico, navegable) — la profundidad es la permanencia:
  parte en **0 s** (la boca / presente) y los datos viajan hacia el **fondo → ∞** (a más segundos, más
  lejos). Sección elíptica que llena la caja, escala logarítmica; **fondo de sistemas estelares lejanos**
  titilantes y difusos (media intensidad); ecos del presente y motas que se disuelven hacia el infinito.
  Navegación: **scroll** para avanzar, **arrastre** para girar, **botones flotantes** de vista
  (Inicio / Frente / Lateral / Dentro / Fondo). Movimientos lentos y calmos.
- **Estado:** **APROBADO** (skins Boldo y Ámbar).

## 3. Índice compuesto (aD_ — activo digital)
- **Qué mide:** índice compuesto = **visitas × tiempo**. Trata cada página como un activo de contenido
  y mide su actividad/valor.
- **Unidad:** aD_ (adimensional, derivado).
- **Origen del dato:** `visitas × tiempo_medio` por página (combina las dos consultas anteriores).
- **Para qué sirve:** priorizar — qué módulos concentran el aprendizaje real.
- **Visualización:** **recorrido 3D vs tiempo** — una sola escena volumétrica donde la **profundidad
  es el tiempo**: la nebulosa de **hoy** al frente (mayor y más brillante) y el pasado (**ayer / 3 días /
  7 días**) alejándose por un camino que serpentea. Rotable con mouse/touch, alta resolución y gas
  multicapa que llena la caja.
- **Estado:** **APROBADO** (skins Boldo y Ámbar). Referencia de estilo en `docs/REFERENCIA_VISUAL_NEBULOSA.md`.

## 4. Recorridos
- **Qué mide:** los caminos entre páginas (transiciones). El flujo de navegación.
- **Unidad:** flujo (nº de transiciones).
- **Origen del dato:** `select referrer_route as desde, route as hacia, count(*) from nav_traces where referrer_route is not null group by 1,2`.
- **Para qué sirve:** ver si siguen la ruta formativa esperada y **dónde se desvían o abandonan**.
- **Visualización:** **asteroides 3D** sobre la **ruta lógica** (Inicio → Inducción → Bitácora →
  Marco legal → Recursos → Perfil); cuerpos rocosos (con cráteres y giro propio) que avanzan **lento**
  —más legible que los meteoritos—; los asteroides coral marcan los **desvíos**. Espacio 3D **rotable
  con mouse/touch**.
- **Estado:** **APROBADO**. Mockup funcional 3D interactivo listo.

---

## Hecho (jun 2026)
- ✅ Migración `014_nav_analytics.sql` **aplicada** en Supabase (tabla `nav_traces` + vista `nav_traces_summary`).
- ✅ Cliente de telemetría `src/lib/navTrace.js` creado y cableado en `App.jsx` (registra `view`/`leave`).
- ✅ Capa de lectura `src/lib/navStats.js` con los 4 indicadores (resumen por página, totales, transiciones).
- ✅ Viz final de **Visitas** definida: **constelación de estrellas 3D**.
- ✅ **Tablero Constelar** ensamblado (los 4 indicadores con sus metáforas, fondo profundo y skins Boldo/Ámbar).

## Pendientes
- Publicar el código (commit + push → Vercel) y verificar que lleguen trazas reales a `nav_traces`.
- Visto bueno final de **Visitas**.
- Conectar las visualizaciones del tablero a `navStats.js` (reemplazar datos de muestra por datos reales).
- Guardar las skins como **artefactos HTML reutilizables** y/o portar las viz a componentes React de la app.
- QA responsive en iPad.
