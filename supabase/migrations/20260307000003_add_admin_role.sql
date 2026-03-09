-- Add 'admin' role
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';
COMMIT;
;

-- Ensure claims RLS allows admins
create policy "Admins can view all claims" on public.claims for
select using (
        exists (
            select 1
            from public.profiles
            where
                user_id = auth.uid ()
                and role = 'admin'
        )
    );

create policy "Admins can update all claims" on public.claims for
update using (
    exists (
        select 1
        from public.profiles
        where
            user_id = auth.uid ()
            and role = 'admin'
    )
);