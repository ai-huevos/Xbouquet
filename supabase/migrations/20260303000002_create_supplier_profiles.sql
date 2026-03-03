create table public.supplier_profiles (
    id uuid primary key default gen_random_uuid (),
    profile_id uuid references public.profiles (id) on delete cascade not null,
    business_name text not null,
    contact_email text,
    phone_number text,
    address text,
    created_at timestamptz default now () not null,
    updated_at timestamptz default now () not null,
    constraint supplier_profiles_profile_id_key unique (profile_id)
);

alter table public.supplier_profiles enable row level security;

create policy "Public read supplier profiles" on public.supplier_profiles for
select using (true);

create policy "Suppliers can update own profile" on public.supplier_profiles for
update using (
    profile_id in (
        select id
        from public.profiles
        where
            user_id = auth.uid ()
            and role = 'supplier'
    )
);