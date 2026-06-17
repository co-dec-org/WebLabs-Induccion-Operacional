# Guía breve de despliegue

## GitHub

1. Crear repositorio `dmt-weblabs-induccion`.
2. Subir esta carpeta como raíz del proyecto.
3. Mantener `README.md`, `supabase_schema.sql` y `seed_modules.sql` como documentación técnica inicial.

## Supabase

1. Crear proyecto Supabase.
2. Ejecutar `supabase_schema.sql`.
3. Ejecutar `seed_modules.sql`.
4. Crear usuarios autorizados desde Auth.
5. Asignar roles en `profiles`.
6. Verificar bucket privado `training-evidence`.

Si la base ya fue creada antes del flujo de clave inicial, ejecutar además:

```txt
supabase/004_initial_password_flow.sql
```

Para enrolamiento inicial:

- Crear cada usuario en Supabase Auth con correo institucional y clave inicial.
- Crear su fila en `profiles` con rol `admin`, `supervisor` u `operador`.
- Mantener `must_change_password = true` hasta que el usuario cambie su contraseña.
- No subir planillas de usuarios ni claves iniciales al repositorio.

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

La capa oficial es React/Vite. Supabase se integra mediante variables de entorno y cliente Supabase desde React.

## Criterio de seguridad V1

No subir datos reales de víctimas, PSC, causas, teléfonos, domicilios, coordenadas ni capturas operacionales identificables.

La Bitácora S.M.T. debe operar solo con material simulado, anonimizado o autorizado. Límites recomendados:

- Captura de pantalla: 5 MB.
- Adjunto: 10 MB.
- Audio: 60 segundos.
- Video: 30 segundos.
