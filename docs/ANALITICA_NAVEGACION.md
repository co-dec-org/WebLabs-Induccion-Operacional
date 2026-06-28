# Telemetría de navegación (educativa) — diseño, privacidad y licenciamiento

> Objetivo: que el sitio genere **trazas de navegación** (recorridos, tiempo por página) para
> análisis y modelado en laboratorios web, guardadas en Supabase — **sin comprometer datos
> personales** (Ley 21.719). Activo a medir: páginas/“assets digitales” × tiempo.

## 1. Qué se captura (y qué NO)

Se captura, por evento de navegación:
- `route` / `page_key` — la página visitada.
- `event_type` — entrada (`view`) o salida (`leave`).
- `duration_ms` — tiempo en la página (al salir).
- `referrer_route` — página anterior (para reconstruir el **camino**).
- `device_type`, `theme` — contexto técnico (phone/tablet/desktop, boldo/ámbar).
- `role` — categoría agregada (operador/supervisor/admin), opcional.
- `anon_session` — **identificador de sesión ANÓNIMO**, aleatorio, generado en el navegador.
- `occurred_at` — marca de tiempo.

**NO se captura:** nombre, correo, UUID de usuario, IP, ni ningún dato que identifique a la
persona. El `anon_session` permite ver la *secuencia* de un recorrido **sin saber de quién es**.

## 2. Privacidad por diseño (Ley 21.719)

- **Anonimización:** la traza no se liga a la identidad. El `anon_session` se descarta al cerrar
  la pestaña (no persiste entre sesiones), así no hay seguimiento longitudinal de una persona.
- **Minimización:** solo lo necesario para modelar navegación.
- **Acceso restringido (RLS):** solo `supervisor`/`admin` pueden leer; borrar, solo `admin`.
- **Retención:** recomendado fijar una política (p.ej. borrar trazas > 12 meses). Se puede
  automatizar con una tarea programada o una función.
- **Aviso / base de licitud:** aunque la data sea anónima, conviene incluir una **nota breve**
  ("este entorno formativo registra datos de navegación anónimos con fines educativos") y definir
  la base de licitud (interés legítimo educativo / consentimiento). *Decisión a confirmar con el
  área legal del organismo.*

## 3. La data en Supabase

Migración: `supabase/014_nav_analytics.sql` (ya en el repo, validada).
Crea la tabla `public.nav_traces` (anónima, con RLS) y una vista agregada
`public.nav_traces_summary` (visitas, sesiones, duración media por página) para análisis sin
exponer trazas individuales.

**Para aplicarla:** Supabase → SQL Editor → pegar el contenido de `014_nav_analytics.sql` → Run.

Consultas de ejemplo (para el laboratorio):
```sql
-- Páginas más visitadas y tiempo medio
select * from public.nav_traces_summary order by visitas desc;

-- Recorridos: secuencia de rutas por sesión anónima
select anon_session, route, occurred_at
from public.nav_traces
order by anon_session, occurred_at;

-- Transiciones (de qué página a qué página)
select referrer_route as desde, route as hacia, count(*) as veces
from public.nav_traces
where referrer_route is not null
group by referrer_route, route
order by veces desc;
```

## 4. Cómo el sitio generará las trazas (siguiente paso, a construir y verificar)

Un módulo cliente liviano (`src/lib/navTrace.js`) que:
1. Genera un `anon_session` aleatorio al cargar (en memoria, no persistente).
2. En cada cambio de ruta, registra `leave` de la anterior (con duración) y `view` de la nueva.
3. Envía la traza a `nav_traces` vía el cliente Supabase (insert anónimo permitido por RLS).
4. Se engancha en el `navigate()` / efecto de ruta de `App.jsx`.

> Pendiente de implementar y **verificar en build/runtime** (no se incluyó aún para no subir JS
> sin validar, siguiendo la disciplina del proyecto). Es un paso chico una vez aplicada la tabla.

## 5. Licenciamiento de la data (orientación, no asesoría legal)

No soy abogado; esto es orientación general para que decidas con tu área legal:

- **Propiedad:** los datos que recolectas en tu propio sitio son tuyos (del organismo). No
  necesitas "licenciar" para usarlos internamente en tus laboratorios.
- **Si publicas o compartes el dataset** (para investigación, terceros, papers): conviene
  publicarlo **anonimizado y agregado**, bajo una **licencia de datos abierta** si quieres uso
  libre —por ejemplo **CC0** (dominio público) o **CC BY 4.0** (atribución)— y dejar claro el
  origen y la base de licitud. La anonimización efectiva es lo que te saca del ámbito estricto de
  la Ley 21.719 para datos personales.
- **Si la data dejara de ser anónima** (p.ej. si ligaras trazas a identidad), aplicaría el régimen
  completo de datos personales: base de licitud, información al titular, derechos ARCO, etc.

Recomendación: mantenerla **anónima + agregada** y, si se comparte, **CC BY 4.0** con nota de
anonimización. Confirmar con legal del organismo.
