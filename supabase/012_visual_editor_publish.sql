-- =====================================================================
-- 012_visual_editor_publish.sql
-- Funciones de publicación/restauración del Editor Visual (Fase 3 · Paso 5).
-- ADITIVO. Atómicas (una transacción por llamada). Solo admin.
-- =====================================================================

create or replace function public.publish_page(p_page_id uuid, p_blocks jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_version int;
  v_version_id uuid;
  v_actor uuid := auth.uid();
  blk jsonb;
  pos int := 0;
begin
  if public.app_current_role() <> 'admin' then
    raise exception 'Solo un administrador puede publicar.';
  end if;

  select coalesce(max(version_number), 0) + 1 into v_version
  from public.page_versions where page_id = p_page_id;

  insert into public.page_versions (page_id, version_number, data, published_by)
  values (p_page_id, v_version, jsonb_build_object('blocks', p_blocks), v_actor)
  returning id into v_version_id;

  delete from public.page_blocks where page_id = p_page_id;
  for blk in select * from jsonb_array_elements(coalesce(p_blocks, '[]'::jsonb))
  loop
    insert into public.page_blocks (page_id, block_type, position, props, is_visible)
    values (
      p_page_id,
      coalesce(blk->>'block_type', 'hero'),
      pos,
      coalesce(blk->'props', '{}'::jsonb) - 'seed',
      coalesce((blk->>'is_visible')::boolean, true)
    );
    pos := pos + 1;
  end loop;

  update public.site_pages
    set current_version_id = v_version_id, status = 'published', updated_at = now()
    where id = p_page_id;

  insert into public.publish_events (actor_id, page_id, version_id, action)
  values (v_actor, p_page_id, v_version_id, 'publish');

  update public.editor_drafts set is_active = false where page_id = p_page_id;

  return v_version_id;
end;
$$;
grant execute on function public.publish_page(uuid, jsonb) to authenticated;

create or replace function public.restore_version(p_version_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_page uuid;
  v_blocks jsonb;
  v_actor uuid := auth.uid();
  blk jsonb;
  pos int := 0;
begin
  if public.app_current_role() <> 'admin' then
    raise exception 'Solo un administrador puede restaurar.';
  end if;

  select page_id, data->'blocks' into v_page, v_blocks
  from public.page_versions where id = p_version_id;
  if v_page is null then
    raise exception 'Versión no encontrada.';
  end if;

  delete from public.page_blocks where page_id = v_page;
  for blk in select * from jsonb_array_elements(coalesce(v_blocks, '[]'::jsonb))
  loop
    insert into public.page_blocks (page_id, block_type, position, props, is_visible)
    values (
      v_page,
      coalesce(blk->>'block_type', 'hero'),
      pos,
      coalesce(blk->'props', '{}'::jsonb) - 'seed',
      coalesce((blk->>'is_visible')::boolean, true)
    );
    pos := pos + 1;
  end loop;

  update public.site_pages
    set current_version_id = p_version_id, updated_at = now()
    where id = v_page;

  insert into public.publish_events (actor_id, page_id, version_id, action)
  values (v_actor, v_page, p_version_id, 'restore');

  return p_version_id;
end;
$$;
grant execute on function public.restore_version(uuid) to authenticated;
