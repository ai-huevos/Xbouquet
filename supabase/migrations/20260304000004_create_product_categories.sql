create table public.product_categories (
    id uuid default gen_random_uuid () primary key,
    name text not null unique,
    slug text not null unique,
    created_at timestamptz default now () not null
);

alter table public.product_categories enable row level security;

create policy "Product categories are viewable by everyone." on public.product_categories for
select using (true);

insert into
    public.product_categories (name, slug)
values ('Roses', 'roses'),
    ('Lilies', 'lilies'),
    (
        'Mixed Bouquets',
        'mixed-bouquets'
    ),
    ('Foliage', 'foliage'),
    ('Carnations', 'carnations'),
    ('Orchids', 'orchids'),
    ('Sunflowers', 'sunflowers');