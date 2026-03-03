create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  default_role user_role;
begin
  -- Example mapping: grab role from raw_user_meta_data if present
  -- Fallback to 'shop' if missing
  default_role := coalesce(
    (new.raw_user_meta_data->>'role')::user_role,
    'shop'::user_role
  );

  insert into public.profiles (user_id, role, full_name, avatar_url)
  values (
    new.id,
    default_role,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();