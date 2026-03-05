create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  default_role user_role;
  new_profile_id uuid;
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
  )
  returning id into new_profile_id;

  -- If the user is a supplier, create a default supplier profile
  if default_role = 'supplier' then
    insert into public.supplier_profiles (profile_id, business_name, contact_email)
    values (
      new_profile_id,
      coalesce(new.raw_user_meta_data->>'full_name', 'My Flower Business'),
      new.email
    );
  elsif default_role = 'shop' then
    insert into public.shop_profiles (profile_id, business_name, contact_email)
    values (
      new_profile_id,
      coalesce(new.raw_user_meta_data->>'full_name', 'My Flower Shop'),
      new.email
    );
  end if;

  return new;
end;
$$;
