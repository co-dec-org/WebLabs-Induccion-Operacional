# Guia breve de despliegue

## GitHub

1. Crear repositorio `dmt-weblabs-induccion`.
2. Subir esta carpeta como raiz del proyecto.
3. Mantener `README.md`, `supabase_schema.sql` y `seed_modules.sql` como documentacion tecnica inicial.

## Supabase

1. Crear proyecto Supabase.
2. Ejecutar `supabase_schema.sql`.
3. Ejecutar `seed_modules.sql`.
4. Crear usuarios autorizados desde Auth.
5. Asignar roles en `profiles`.
6. Verificar bucket privado `training-evidence`.

## Vercel

1. Importar repositorio desde GitHub.
2. Definir framework Vite.
3. Configurar variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Publicar primero como preview.

## Desarrollo local

```bash
npm install
npm run dev
```

La capa oficial es React/Vite. Supabase queda preparado por esquema SQL y variables de entorno; la integracion directa con cliente Supabase se realiza en el Sprint 2.

## Criterio de seguridad V1

No subir datos reales de victimas, PSC, causas, telefonos, domicilios, coordenadas ni capturas operacionales identificables.

La Bitacora S.M.T. debe operar solo con material simulado, anonimizado o autorizado. Limites recomendados:

- Captura de pantalla: 5 MB.
- Adjunto: 10 MB.
- Audio: 60 segundos.
- Video: 30 segundos.
