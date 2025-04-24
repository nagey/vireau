-- Create table: regattas
create table if not exists public.regattas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Create table: boats
create table if not exists public.boats (
  id uuid primary key default gen_random_uuid(),
  regatta_id uuid references public.regattas on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Create table: timers
create table if not exists public.timers (
  id uuid primary key default gen_random_uuid(),
  boat_id uuid references public.boats on delete cascade not null,
  regatta_id uuid references public.regattas on delete cascade not null,
  start_time timestamp with time zone,
  elapsed_time interval,
  status text check (status in ('not_started', 'running', 'paused', 'finished')) default 'not_started',
  unique (boat_id, regatta_id)
);