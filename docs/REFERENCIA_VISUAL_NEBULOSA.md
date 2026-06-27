# Referencia visual — skin "Constelar / Nebulosa"

Guía de estilo para que la visualización de nebulosa se parezca a nebulosas reales
(no al disco radial básico). Basada en 4 referencias de iStock aportadas por el usuario.

## Las 4 referencias (lo que aporta cada una)

1. **dima_zel** — Anillo de gas naranja/rojo rodeando un **núcleo azul brillante** con estrella
   en estallido (starburst). Fondo con regiones azules y rojas. → núcleo luminoso + anillo
   de gas + contraste de color cálido/frío.
2. **Lan Zhang** — **Núcleo blanco-azul intensísimo** con nubes volumétricas naranjas/marrones
   "billowing" (como humo denso). Mucho rango dinámico (del blanco al negro). → volumetría y
   un core que "ciega".
3. **Fug4s** — Nebulosa **verde/teal** con núcleo dorado, hebras de gas verde, estrellas
   verdes y blancas. → **es la más cercana a la paleta DMT** (verde + dorado). Referencia base.
4. **kevron2001** — Núcleo azul/teal con nubes **rosadas/magenta/púrpura**, campo de estrellas
   muy denso. → riqueza cromática y densidad estelar.

## Cualidades a replicar (target del skin)

- **Núcleo luminoso** que sobresale (casi blanco en el centro, color hacia afuera). Halo brillante.
- **Nubes volumétricas e irregulares** (lóbulos, "humo"), no un disco simétrico.
- **Filamentos / hebras** de gas que serpentean.
- **Vetas de polvo oscuro** que cortan el gas (zonas sin luz).
- **Campo de estrellas denso** de fondo + estrellas brillantes incrustadas.
- **Capas de color** (2–3 zonas), con transición suave.
- Sensación de **profundidad / 3D** (gas adelante y atrás).

## Traducción a la implementación (canvas, skin DMT)

Paleta DMT (referencia #3, verde + dorado), núcleo claro → borde oscuro:
- Boldo: `#f2fff9 · #c8f5e6 · #9fe1cb · #5dcaa5 · #2aa37c · #0f6e56` (+ acento dorado tenue para el core).
- Ámbar: `#fff7e6 · #ffe7b0 · #f0c97b · #d9a441 · #a46f15 · #7a4f0e`.

Técnica recomendada (ya iniciada en el mockup funcional):
1. **Gas base** con gradientes radiales suaves en posiciones irregulares (lóbulos), composite `lighter`.
2. **Filamentos** = partículas dispersas a lo largo de curvas bézier con jitter perpendicular.
3. **Polvo** = blobs oscuros (color del fondo, `source-over`) que tapan parte del gas.
4. **Estrellas** = puntos brillantes nítidos (fondo + incrustadas), con titileo.
5. **Núcleo** = halo claro pulsante (casi blanco) sobre acento de color.
6. **Profundidad** = variar tamaño/alfa por "capa", y rotación 3D interactiva (mouse/touch).

> Nota: las imágenes de iStock son **referencia de estilo**, no para uso/publicación (tienen marca
> de agua y derechos). El skin recrea el *look*, no copia las imágenes.
