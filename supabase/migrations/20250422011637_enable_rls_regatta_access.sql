-- Enable RLS on all tables
alter table public.regattas enable row level security;
alter table public.boats enable row level security;
alter table public.timers enable row level security;

-- Policy: only allow regatta owners to access their regattas
create policy "Regatta: user can access own regattas"
  on public.regattas
  for all
  using (created_by = auth.uid());

-- Policy: only allow access to boats if user owns the associated regatta
create policy "Boat: access if user owns regatta"
  on public.boats
  for all
  using (
    exists (
      select 1 from public.regattas
      where regattas.id = boats.regatta_id
      and regattas.created_by = auth.uid()
    )
  );

-- Policy: only allow access to timers if user owns the associated regatta
create policy "Timer: access if user owns regatta"
  on public.timers
  for all
  using (
    exists (
      select 1 from public.regattas
      where regattas.id = timers.regatta_id
      and regattas.created_by = auth.uid()
    )
  );