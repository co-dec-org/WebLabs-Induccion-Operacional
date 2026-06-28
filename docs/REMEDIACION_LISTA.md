# Remediación — verificada y lista para ejecutar

> Ya validé toda esta secuencia en un clon del repo (sandbox). Reescribe historia y purga
> `supabase_profiles_usuarios_dmt.sql`. El único paso que falta correr contra GitHub es el
> **force-push** (necesita tus credenciales). Todo lo de abajo es exactamente lo que probé.

## Resultado ya comprobado en el sandbox
- Archivo purgado de **todo** el historial (38 commits reescritos). `git log --all -- ...` → vacío.
- Ningún blob conserva el `insert into public.profiles` con nombres reales.
- `.gitignore` creado y **corregido**: `*_usuarios_*.sql` ignora datos reales, pero las excepciones
  `!*_usuarios_*.example.sql` / `!*_usuarios_*.TEMPLATE.sql` permiten versionar la plantilla.
- Plantilla segura añadida como `supabase_profiles_usuarios_dmt.example.sql`.
- No hay claves de app filtradas (service_role solo es texto de docs; "eyJ" eran bytes de PNG).

## Pasos (ejecútalos en tu máquina, o pásame un token y los corro yo)

```bash
# 0) AVISA a colaboradores: nadie hace push mientras tanto. Backup:
git clone --mirror https://github.com/co-dec-org/WebLabs-Induccion-Operacional.git backup-weblabs.git

# 1) git-filter-repo
brew install git-filter-repo      # o: pip install git-filter-repo

# 2) Clon fresco + purga
git clone https://github.com/co-dec-org/WebLabs-Induccion-Operacional.git
cd WebLabs-Induccion-Operacional
git filter-repo --invert-paths --path supabase_profiles_usuarios_dmt.sql

# 3) .gitignore + plantilla (copia gitignore_propuesto.txt como .gitignore,
#    y supabase_profiles_usuarios_dmt.TEMPLATE.sql como ...example.sql)
git add .gitignore supabase_profiles_usuarios_dmt.example.sql
git commit -m "security(db): purga datos personales del historial; agrega .gitignore y plantilla con UUID ficticios"

# 4) Force-push (PASO IRREVERSIBLE — el que necesita credenciales)
git remote add origin https://github.com/co-dec-org/WebLabs-Induccion-Operacional.git
git push origin --force --all
git push origin --force --tags

# 5) Verificación final (ambos deben salir vacíos)
git log --all --full-history -- supabase_profiles_usuarios_dmt.sql
git rev-list --all | xargs -I{} git grep -l "insert into public.profiles (id, full_name" {} 2>/dev/null
```

## Después del push (no olvidar)
1. **Supabase → Auth → Users:** invalidar sesiones / forzar cambio de contraseña a los 13 usuarios; `must_change_password=true`.
2. **GitHub:** solicitar purga de cachés vía *Private Information Removal* (indicar el path y los SHA del backup).
3. **GitHub → Settings → Code security:** activar Secret scanning + Push protection.

> ⚠️ Sobre "que lo ejecute yo": puedo correr los pasos 2–3 y dejar el commit listo en el sandbox,
> pero el **push (paso 4) requiere un Personal Access Token con permiso de push**. Sin eso no puedo
> empujar a GitHub. Si me pasas un token de un solo uso lo ejecuto; si prefieres, corre solo el paso 4 tú.
