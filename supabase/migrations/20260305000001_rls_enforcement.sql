-- Mission 6: RLS Enforcement
-- Remove wide open policies and replace with strict role-based policies.

-- 1. Restrict Profiles to authenticated users only
drop policy "Public read profiles" on public.profiles;

create policy "Authenticated users can read profiles" on public.profiles for
select using (
        auth.role () = 'authenticated'
    );

-- 2. Restrict Supplier Profiles to authenticated users only
drop policy "Public read supplier profiles" on public.supplier_profiles;

create policy "Authenticated users can read supplier profiles" on public.supplier_profiles for
select using (
        auth.role () = 'authenticated'
    );

-- 3. Restrict Shop Profiles to authenticated users only
drop policy "Public read shop profiles" on public.shop_profiles;

create policy "Authenticated users can read shop profiles" on public.shop_profiles for
select using (
        auth.role () = 'authenticated'
    );

-- 4. Restrict Product Categories to authenticated users only
drop policy "Product categories are viewable by everyone." on public.product_categories;

create policy "Authenticated users can read product categories" on public.product_categories for
select using (
        auth.role () = 'authenticated'
    );

-- 5. Restrict Flower Products
-- Supplier A cannot read Supplier B products.
-- Shops can read all products.
drop policy "Flower products are viewable by everyone." on public.flower_products;

create policy "Products are viewable by shops or the owning supplier" on public.flower_products for
select using (
        -- User is a shop
        (
            exists (
                select 1
                from public.profiles
                where
                    profiles.user_id = auth.uid ()
                    and profiles.role = 'shop'
            )
        )
        or
        -- User is the owning supplier
        (
            supplier_id in (
                select profile_id
                from public.supplier_profiles sp
                    join public.profiles p on p.id = sp.profile_id
                where
                    p.user_id = auth.uid ()
            )
        )
    );