insert into
    storage.buckets (id, name, public)
values (
        'product_images',
        'product_images',
        true
    );

create policy "Product images are viewable by everyone." on storage.objects for
select using (bucket_id = 'product_images');

create policy "Authenticated users can upload product images." on storage.objects for insert
with
    check (
        bucket_id = 'product_images'
        and auth.role () = 'authenticated'
    );

create policy "Users can update their own product images." on storage.objects for
update using (
    bucket_id = 'product_images'
    and auth.uid () = owner
);

create policy "Users can delete their own product images." on storage.objects for delete using (
    bucket_id = 'product_images'
    and auth.uid () = owner
);