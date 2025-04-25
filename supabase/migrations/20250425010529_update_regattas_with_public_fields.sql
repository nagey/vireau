alter table public.regattas
add column if not exists is_public boolean default false,
add column if not exists image_url text,
add column if not exists start_date date,
add column if not exists end_date date,
add column if not exists location text;