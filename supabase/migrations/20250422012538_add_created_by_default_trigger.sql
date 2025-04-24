-- Function to set created_by using auth.uid()
create or replace function public.set_created_by()
returns trigger as $$
begin
  if new.created_by is null then
    new.created_by := auth.uid();
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to regattas
drop trigger if exists set_created_by_trigger on public.regattas;
create trigger set_created_by_trigger
before insert on public.regattas
for each row execute procedure public.set_created_by();