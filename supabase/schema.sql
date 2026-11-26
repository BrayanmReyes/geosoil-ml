-- Ejecutar en un proyecto Supabase nuevo. No incluye credenciales.
create table public.dataset_versions (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 name text not null,
 origin text not null check(origin in ('synthetic','real')),
 generator_version text,
 seed bigint,
 payload jsonb not null check(jsonb_typeof(payload)='object'),
 created_at timestamptz not null default now(),
 check(payload->>'origin' is not null and payload->>'origin'=origin)
);
alter table public.dataset_versions enable row level security;
create policy own_datasets on public.dataset_versions for all to authenticated using (owner_id=auth.uid()) with check(owner_id=auth.uid());
revoke all on public.dataset_versions from anon;
grant select,insert,update,delete on public.dataset_versions to authenticated;
-- Primera migración: snapshots JSON auditables. Normalización relacional posterior.
