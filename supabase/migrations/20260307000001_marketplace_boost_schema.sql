-- 1. Profiles Extension
alter table public.shop_profiles
add column credit_limit numeric(10, 2) default 0.00 not null,
add column current_balance numeric(10, 2) default 0.00 not null,
add column payment_terms text default 'due_on_receipt' check (
    payment_terms in (
        'due_on_receipt',
        'net_15',
        'net_30',
        'net_60'
    )
);

-- 2. Product Packaging
alter table public.flower_products
add column box_type text check (
    box_type in ('QB', 'HB', 'FB')
),
add column stems_per_bunch integer check (stems_per_bunch > 0),
add column stem_length_cm integer check (stem_length_cm > 0);

-- 3. Order Logistics
alter table public.orders
add column order_type text default 'immediate' not null check (
    order_type in (
        'immediate',
        'prebook',
        'standing'
    )
),
add column requested_delivery_date timestamptz;

-- 4. Claims Creation
create table public.claims (
    id uuid default gen_random_uuid () primary key,
    order_item_id uuid references public.order_items (id) on delete restrict not null,
    shop_id uuid references public.shop_profiles (profile_id) on delete cascade not null,
    supplier_id uuid references public.supplier_profiles (profile_id) on delete cascade not null,
    reason text not null check (reason in ('botrytis', 'temperature_damage', 'missing_items', 'wrong_product', 'other')),
    requested_credit_amount numeric(10, 2) not null check (requested_credit_amount >= 0),
    description text,
    evidence_url_array text[] default '{}'::text[],
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'partial_credit')),
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index claims_shop_id_idx on public.claims (shop_id);

create index claims_supplier_id_idx on public.claims (supplier_id);

create index claims_order_item_id_idx on public.claims (order_item_id);

alter table public.claims enable row level security;

-- Claims RLS
create policy "Shops can view their own claims" on public.claims for
select using (
        shop_id in (
            select profile_id
            from public.shop_profiles sp
                join public.profiles p on p.id = sp.profile_id
            where
                p.user_id = auth.uid ()
        )
    );

create policy "Suppliers can view claims against them" on public.claims for
select using (
        supplier_id in (
            select profile_id
            from public.supplier_profiles sp
                join public.profiles p on p.id = sp.profile_id
            where
                p.user_id = auth.uid ()
        )
    );

create policy "Shops can create claims" on public.claims for insert
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

create policy "Suppliers can update claims against them" on public.claims for
update using (
    supplier_id in (
        select profile_id
        from public.supplier_profiles sp
            join public.profiles p on p.id = sp.profile_id
        where
            p.user_id = auth.uid ()
    )
);

create trigger handle_claims_updated_at
    before update on public.claims
    for each row
    execute function public.handle_updated_at();