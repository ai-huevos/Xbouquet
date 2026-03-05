create table public.cart_items (
    id uuid default gen_random_uuid () primary key,
    shop_id uuid references public.shop_profiles (profile_id) on delete cascade not null,
    product_id uuid references public.flower_products (id) on delete cascade not null,
    quantity integer not null check (quantity > 0),
    created_at timestamptz default now () not null,
    updated_at timestamptz default now () not null,
    unique (shop_id, product_id)
);

create index cart_items_shop_id_idx on public.cart_items (shop_id);

alter table public.cart_items enable row level security;

create policy "Shops can view their own cart" on public.cart_items for
select using (
        shop_id in (
            select profile_id
            from public.shop_profiles sp
                join public.profiles p on p.id = sp.profile_id
            where
                p.user_id = auth.uid ()
        )
    );

create policy "Shops can insert into their own cart" on public.cart_items for insert
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

create policy "Shops can update their own cart" on public.cart_items for
update using (
    shop_id in (
        select profile_id
        from public.shop_profiles sp
            join public.profiles p on p.id = sp.profile_id
        where
            p.user_id = auth.uid ()
    )
);

create policy "Shops can delete from their own cart" on public.cart_items for delete using (
    shop_id in (
        select profile_id
        from public.shop_profiles sp
            join public.profiles p on p.id = sp.profile_id
        where
            p.user_id = auth.uid ()
    )
);

create trigger handle_cart_items_updated_at
    before update on public.cart_items
    for each row
    execute function public.handle_updated_at();