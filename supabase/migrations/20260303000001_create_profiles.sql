create type user_role as enum ('supplier', 'shop');

create table public.profiles (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references auth.users (id) on delete cascade not null,
    role user_role not null,
    full_name text,
    avatar_url text,
    created_at timestamptz default now () not null,
    updated_at timestamptz default now () not null,
    constraint profiles_user_id_key unique (user_id)
);

alter table public.profiles enable row level security;

create policy "Public read profiles" on public.profiles for
select using (true);

create policy "Users can update own profile" on public.profiles for
update using (user_id = auth.uid ());