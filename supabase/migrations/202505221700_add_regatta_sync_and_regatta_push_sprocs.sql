create or replace function sync_regattas(since timestamptz, user_id uuid)
returns jsonb
language plpgsql
as $$
declare
  changed_regattas jsonb;
  deleted_regatta_ids jsonb;
begin
  -- Regattas created or updated since last sync
  select jsonb_agg(to_jsonb(r))
    into changed_regattas
    from regattas r
   where (r.updated_at > since or r.created_at > since)
     and (r.user_id = user_id or r.is_public);

  -- IDs of regattas deleted since last sync
  select jsonb_agg(r.id)
    into deleted_regatta_ids
    from regattas r
   where r.deleted_at > since
     and (r.user_id = user_id or r.is_public);

  return jsonb_build_object(
    'regattas', coalesce(changed_regattas, '[]'::jsonb),
    'deleted', coalesce(deleted_regatta_ids, '[]'::jsonb)
  );
end;
$$;

create or replace function push_regatta_changes(
  created jsonb,
  updated jsonb,
  deleted_ids uuid[],
  user_id uuid
)
returns void
language plpgsql
as $$
declare
  r jsonb;
begin
  -- Handle created
  for r in select * from jsonb_array_elements(created) loop
    insert into regattas(id, name, is_quick_race, start_date, end_date, location, user_id, updated_at, created_at)
    values (
      (r->>'id')::uuid,
      r->>'name',
      (r->>'is_quick_race')::boolean,
      (r->>'start_date')::timestamptz,
      (r->>'end_date')::timestamptz,
      r->>'location',
      user_id,
      now(), now()
    )
    on conflict (id) do nothing;
  end loop;

  -- Handle updated
  for r in select * from jsonb_array_elements(updated) loop
    update regattas
    set
      name = r->>'name',
      is_quick_race = (r->>'is_quick_race')::boolean,
      start_date = (r->>'start_date')::timestamptz,
      end_date = (r->>'end_date')::timestamptz,
      location = r->>'location',
      updated_at = now()
    where id = (r->>'id')::uuid and user_id = user_id;
  end loop;

  -- Handle deleted
  update regattas set deleted_at = now()
    where id = any(deleted_ids) and user_id = user_id;
end;
$$;
