-- Drop old timers table
drop table if exists public.timers;

-- Create races table
create table public.races (
  id uuid primary key default gen_random_uuid(),
  regatta_id uuid not null references public.regattas on delete cascade,
  race_number integer not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Create new timers table (1 per boat per race)
create table public.timers (
  id uuid primary key default gen_random_uuid(),
  boat_id uuid not null references public.boats on delete cascade,
  race_id uuid not null references public.races on delete cascade,
  start_time timestamp with time zone,
  elapsed_time interval,
  status text check (status in ('not_started', 'running', 'paused', 'finished')) default 'not_started',
  unique (boat_id, race_id)
);