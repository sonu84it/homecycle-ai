create extension if not exists "pgcrypto";

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,
  image_path text,
  object_name text not null,
  category text not null,
  material text not null,
  condition text not null check (condition in ('excellent', 'good', 'fair', 'poor', 'unknown')),
  recommended_action text not null check (recommended_action in ('reuse', 'donate', 'sell', 'repair', 'upcycle', 'recycle')),
  carbon_saved_kg numeric not null default 0,
  landfill_avoided_kg numeric not null default 0,
  estimated_resale_value_usd numeric not null default 0,
  analysis jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.items enable row level security;

drop policy if exists "Users can read their own items" on public.items;
create policy "Users can read their own items"
on public.items for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own items" on public.items;
create policy "Users can insert their own items"
on public.items for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own items" on public.items;
create policy "Users can update their own items"
on public.items for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own items" on public.items;
create policy "Users can delete their own items"
on public.items for delete
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Users can upload item images" on storage.objects;
create policy "Users can upload item images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'item-images' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can read item images" on storage.objects;
create policy "Users can read item images"
on storage.objects for select
to public
using (bucket_id = 'item-images');

drop policy if exists "Users can delete their item images" on storage.objects;
create policy "Users can delete their item images"
on storage.objects for delete
to authenticated
using (bucket_id = 'item-images' and auth.uid()::text = (storage.foldername(name))[1]);
