-- Execute no SQL Editor de um projeto Supabase. Pode ser executado novamente.
create table if not exists public.atos_admins (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.atos_admins enable row level security;
revoke all on public.atos_admins from anon, authenticated;
grant select on public.atos_admins to authenticated;
drop policy if exists "atos_admin_self" on public.atos_admins;
create policy "atos_admin_self" on public.atos_admins for select to authenticated using (user_id = (select auth.uid()));
create or replace function public.atos_is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.atos_admins where user_id=auth.uid());
$$;
revoke all on function public.atos_is_admin() from public;
grant execute on function public.atos_is_admin() to authenticated;
create table if not exists public.atos_content (
 id integer primary key check(id=1), data jsonb not null, version integer not null default 1, updated_at timestamptz not null default now()
);
alter table public.atos_content enable row level security;
revoke all on public.atos_content from anon, authenticated;
grant select on public.atos_content to authenticated;
drop policy if exists "atos_admin_read" on public.atos_content;
create policy "atos_admin_read" on public.atos_content for select to authenticated using ((select public.atos_is_admin()));
-- Publicação filtra itens ocultos ANTES de enviar dados ao visitante.
create or replace function public.atos_public_content() returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('settings',data->'settings',
 'professionals',coalesce((select jsonb_agg(item order by pos) from jsonb_array_elements(data->'professionals') with ordinality as p(item,pos) where item->>'published'='true'),'[]'::jsonb),
 'specialties',coalesce((select jsonb_agg(item order by pos) from jsonb_array_elements(data->'specialties') with ordinality as s(item,pos) where item->>'published'='true'),'[]'::jsonb))
 from public.atos_content where id=1;
$$;
revoke all on function public.atos_public_content() from public;
grant execute on function public.atos_public_content() to anon,authenticated;
create or replace function public.atos_save_content(document jsonb,expected_version integer) returns integer language plpgsql security definer set search_path='' as $$
declare current_version integer;
begin
 if not public.atos_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 if jsonb_typeof(document->'settings') is distinct from 'object' or jsonb_typeof(document->'professionals') is distinct from 'array' or jsonb_typeof(document->'specialties') is distinct from 'array' then raise exception 'INVALID_DOCUMENT'; end if;
 perform pg_advisory_xact_lock(846203);
 select version into current_version from public.atos_content where id=1;
 if coalesce(current_version,0)<>expected_version then raise exception 'VERSION_CONFLICT'; end if;
 insert into public.atos_content(id,data,version) values(1,document,1)
 on conflict(id) do update set data=excluded.data,version=atos_content.version+1,updated_at=now()
 returning version into current_version;
 return current_version;
end;
$$;
revoke all on function public.atos_save_content(jsonb,integer) from public;
grant execute on function public.atos_save_content(jsonb,integer) to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('atos-media','atos-media',true,3000000,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
drop policy if exists "atos_media_admin_insert" on storage.objects;
create policy "atos_media_admin_insert" on storage.objects for insert to authenticated with check(bucket_id='atos-media' and (select public.atos_is_admin()) and (storage.foldername(name))[1]=(select auth.uid())::text);
-- Fotos são públicas; não enviar documentos clínicos ou dados privados neste bucket.
-- Após criar o usuário em Authentication > Users, autorize pelo UUID:
-- insert into public.atos_admins(user_id) values ('UUID-DO-USUARIO') on conflict do nothing;
