create table public.order_groups (
    id uuid default gen_random_uuid () primary key,
    shop_id uuid references public.shop_profiles (profile_id) on delete cascade not null,
    created_at timestamptz default now () not null
);

create index order_groups_shop_id_idx on public.order_groups (shop_id);

create table public.orders (
    id uuid default gen_random_uuid () primary key,
    order_group_id uuid references public.order_groups (id) on delete cascade not null,
    shop_id uuid references public.shop_profiles (profile_id) on delete cascade not null,
    supplier_id uuid references public.supplier_profiles (profile_id) on delete cascade not null,
    status text not null default 'pending' check (
        status in (
            'pending',
            'confirmed',
            'delivered',
            'cancelled'
        )
    ),
    created_at timestamptz default now () not null,
    updated_at timestamptz default now () not null
);

create index orders_shop_id_idx on public.orders (shop_id);

create index orders_supplier_id_idx on public.orders (supplier_id);

create index orders_status_idx on public.orders (status);

create table public.order_items (
    id uuid default gen_random_uuid () primary key,
    order_id uuid references public.orders (id) on delete cascade not null,
    product_id uuid references public.flower_products (id) on delete restrict not null,
    quantity integer not null check (quantity > 0),
    unit_price numeric(10, 2) not null check (unit_price >= 0),
    created_at timestamptz default now () not null
);

create index order_items_order_id_idx on public.order_items (order_id);

alter table public.order_groups enable row level security;

alter table public.orders enable row level security;

alter table public.order_items enable row level security;

-- Order Groups RLS
create policy "Shops can view their own order groups" on public.order_groups for
select using (
        shop_id in (
            select profile_id
            from public.shop_profiles sp
                join public.profiles p on p.id = sp.profile_id
            where
                p.user_id = auth.uid ()
        )
    );

create policy "Shops can insert their own order groups" on public.order_groups for insert
with
    check (
        shop_id in (
            select profile_id
            from public.shop_profiles sp
                join public.profiles p on p.id = sp.profile_id
            where
                p.user_id = auth.uid ()
        )
    );

-- Orders RLS
create policy "Shops can view their own orders" on public.orders for
select using (
        shop_id in (
            select profile_id
            from public.shop_profiles sp
                join public.profiles p on p.id = sp.profile_id
            where
                p.user_id = auth.uid ()
        )
    );

create policy "Suppliers can view orders assigned to them" on public.orders for
select using (
        supplier_id in (
            select profile_id
            from public.supplier_profiles sp
                join public.profiles p on p.id = sp.profile_id
            where
                p.user_id = auth.uid ()
        )
    );

create policy "Shops can insert their own orders" on public.orders for insert
with
    check (
        shop_id in (
            select profile_id
            from public.shop_profiles sp
                join public.profiles p on p.id = sp.profile_id
            where
                p.user_id = auth.uid ()
        )
    );

create policy "Suppliers can update status of orders assigned to them" on public.orders for
update using (
    supplier_id in (
        select profile_id
        from public.supplier_profiles sp
            join public.profiles p on p.id = sp.profile_id
        where
            p.user_id = auth.uid ()
    )
);

-- Order Items RLS
create policy "Shops can view items of their orders" on public.order_items for
select using (
        order_id in (
            select o.id
            from public.orders o
                join public.shop_profiles sp on o.shop_id = sp.profile_id
                join public.profiles p on p.id = sp.profile_id
            where
                p.user_id = auth.uid ()
        )
    );

create policy "Suppliers can view items of their assigned orders" on public.order_items for
select using (
        order_id in (
            select o.id
            from public.orders o
                join public.supplier_profiles sp on o.supplier_id = sp.profile_id
                join public.profiles p on p.id = sp.profile_id
            where
                p.user_id = auth.uid ()
        )
    );

create policy "Shops can insert items into their orders" on public.order_items for insert
with
    check (
        order_id in (
            select o.id
            from public.orders o
                join public.shop_profiles sp on o.shop_id = sp.profile_id
                join public.profiles p on p.id = sp.profile_id
            where
                p.user_id = auth.uid ()
        )
    );

create trigger handle_orders_updated_at
    before update on public.orders
    for each row
    execute function public.handle_updated_at();