create table public.flower_products (
    id uuid default gen_random_uuid () primary key,
    supplier_id uuid references public.supplier_profiles (profile_id) on delete cascade not null,
    category_id uuid references public.product_categories (id) on delete restrict not null,
    name text not null,
    description text,
    price_per_unit numeric(10, 2) not null check (price_per_unit >= 0),
    stock_qty integer not null default 0 check (stock_qty >= 0),
    image_url text,
    status text not null default 'active' check (
        status in ('active', 'draft', 'archived')
    ),
    created_at timestamptz default now () not null,
    updated_at timestamptz default now () not null
);

create index flower_products_supplier_id_idx on public.flower_products (supplier_id);

create index flower_products_category_id_idx on public.flower_products (category_id);

create index flower_products_status_idx on public.flower_products (status);

alter table public.flower_products enable row level security;

create policy "Flower products are viewable by everyone." on public.flower_products for
select using (true);

create policy "Suppliers can insert their own products" on public.flower_products for insert
with
    check (
        supplier_id in (
            select profile_id
            from public.supplier_profiles sp
                join public.profiles p on p.id = sp.profile_id
            where
                p.user_id = auth.uid ()
        )
    );

create policy "Suppliers can update their own products" on public.flower_products for
update using (
    supplier_id in (
        select profile_id
        from public.supplier_profiles sp
            join public.profiles p on p.id = sp.profile_id
        where
            p.user_id = auth.uid ()
    )
);

create policy "Suppliers can delete their own products" on public.flower_products for delete using (
    supplier_id in (
        select profile_id
        from public.supplier_profiles sp
            join public.profiles p on p.id = sp.profile_id
        where
            p.user_id = auth.uid ()
    )
);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_flower_products_updated_at
    before update on public.flower_products
    for each row
    execute function public.handle_updated_at();