-- DMT Web-Labs - Induccion Operacional Sistema de Monitoreo Telematico
-- Esquema inicial Supabase/Postgres
-- Nota: no almacenar datos personales reales de victimas, PSC ni causas judiciales en V1.

create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'supervisor', 'operador', 'lector');
create type public.module_status as enum ('draft', 'published', 'archived');
create type public.progress_status as enum ('not_started', 'in_progress', 'completed');
create type public.training_note_status as enum ('draft', 'submitted', 'reviewed', 'archived');
create type public.training_evidence_type as enum ('image', 'attachment', 'audio', 'video');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.app_role not null default 'operador',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  module_number int not null unique check (module_number between 1 and 14),
  title text not null,
  subtitle text,
  objective text,
  key_message text,
  status public.module_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.module_sections (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  section_order int not null,
  heading text not null,
  body text not null,
  visual_type text,
  created_at timestamptz not null default now(),
  unique (module_id, section_order)
);

create table public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  status public.progress_status not null default 'not_started',
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  title text,
  body text not null,
  is_shared boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.training_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  input_received text not null check (char_length(input_received) <= 1000),
  operator_analysis text not null check (char_length(operator_analysis) <= 1000),
  operational_decision text not null check (char_length(operational_decision) <= 1000),
  action_taken text not null check (char_length(action_taken) <= 1000),
  documentation_record text not null check (char_length(documentation_record) <= 1000),
  legal_operational_principle text,
  status public.training_note_status not null default 'draft',
  reviewer_id uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.training_attachments (
  id uuid primary key default gen_random_uuid(),
  training_note_id uuid not null references public.training_notes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  evidence_type public.training_evidence_type not null,
  storage_bucket text not null default 'training-evidence',
  storage_path text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  duration_seconds int,
  created_at timestamptz not null default now(),
  check (
    (evidence_type = 'image' and size_bytes <= 5242880 and duration_seconds is null)
    or (evidence_type = 'attachment' and size_bytes <= 10485760 and duration_seconds is null)
    or (evidence_type = 'audio' and size_bytes <= 12582912 and duration_seconds <= 60)
    or (evidence_type = 'video' and size_bytes <= 31457280 and duration_seconds <= 30)
  )
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  body text not null,
  legal_note text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'training-evidence',
  'training-evidence',
  false,
  31457280,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'audio/mpeg',
    'audio/mp4',
    'audio/webm',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
) on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.modules enable row level security;
alter table public.module_sections enable row level security;
alter table public.progress enable row level security;
alter table public.notes enable row level security;
alter table public.training_notes enable row level security;
alter table public.training_attachments enable row level security;
alter table public.templates enable row level security;
alter table public.audit_events enable row level security;

create or replace function public.app_current_role()
returns public.app_role
language sql
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "profiles_select_own_or_admin"
on public.profiles for select
using (id = auth.uid() or public.app_current_role() in ('admin', 'supervisor'));

create policy "profiles_admin_write"
on public.profiles for update
using (public.app_current_role() = 'admin')
with check (public.app_current_role() = 'admin');

create policy "modules_select_published"
on public.modules for select
using (status = 'published' or public.app_current_role() in ('admin', 'supervisor'));

create policy "modules_admin_write"
on public.modules for all
using (public.app_current_role() = 'admin')
with check (public.app_current_role() = 'admin');

create policy "module_sections_select_by_module"
on public.module_sections for select
using (
  exists (
    select 1 from public.modules m
    where m.id = module_id
      and (m.status = 'published' or public.app_current_role() in ('admin', 'supervisor'))
  )
);

create policy "module_sections_admin_write"
on public.module_sections for all
using (public.app_current_role() = 'admin')
with check (public.app_current_role() = 'admin');

create policy "progress_select_own_or_supervisor"
on public.progress for select
using (user_id = auth.uid() or public.app_current_role() in ('admin', 'supervisor'));

create policy "progress_upsert_own"
on public.progress for insert
with check (user_id = auth.uid());

create policy "progress_update_own"
on public.progress for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "notes_select_own_or_shared"
on public.notes for select
using (user_id = auth.uid() or is_shared = true or public.app_current_role() in ('admin', 'supervisor'));

create policy "notes_insert_own"
on public.notes for insert
with check (user_id = auth.uid());

create policy "notes_update_own"
on public.notes for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "training_notes_select_own_or_supervisor"
on public.training_notes for select
using (user_id = auth.uid() or public.app_current_role() in ('admin', 'supervisor'));

create policy "training_notes_insert_own"
on public.training_notes for insert
with check (user_id = auth.uid());

create policy "training_notes_update_own_draft"
on public.training_notes for update
using (user_id = auth.uid() and status in ('draft', 'submitted'))
with check (user_id = auth.uid());

create policy "training_notes_review_supervisor"
on public.training_notes for update
using (public.app_current_role() in ('admin', 'supervisor'))
with check (public.app_current_role() in ('admin', 'supervisor'));

create policy "training_attachments_select_own_or_supervisor"
on public.training_attachments for select
using (user_id = auth.uid() or public.app_current_role() in ('admin', 'supervisor'));

create policy "training_attachments_insert_own"
on public.training_attachments for insert
with check (user_id = auth.uid());

create policy "templates_select_active"
on public.templates for select
using (active = true or public.app_current_role() in ('admin', 'supervisor'));

create policy "templates_admin_write"
on public.templates for all
using (public.app_current_role() = 'admin')
with check (public.app_current_role() = 'admin');

create policy "audit_select_supervisor"
on public.audit_events for select
using (public.app_current_role() in ('admin', 'supervisor'));

create policy "audit_insert_authenticated"
on public.audit_events for insert
with check (auth.uid() is not null);

create policy "storage_training_evidence_select"
on storage.objects for select
using (
  bucket_id = 'training-evidence'
  and (
    public.app_current_role() in ('admin', 'supervisor')
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

create policy "storage_training_evidence_insert"
on storage.objects for insert
with check (
  bucket_id = 'training-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);
