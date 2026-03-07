-- Seed File for Automated MVP UX Reviews (Mission 23 & 24)
-- This file creates persistent, predictable test users and seed data.

DO $$
DECLARE
  shop_user_id uuid := '10000000-0000-0000-0000-000000000001';
  supplier_user_id uuid := '20000000-0000-0000-0000-000000000002';
  supplier_profile_id uuid;
  roses_id uuid;
  carnations_id uuid;
BEGIN
  -- 1. Create Shop User (Auth)
  INSERT INTO auth.users (
    id, instance_id, email,
    encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, confirmation_token, created_at, updated_at,
    email_change, email_change_token_current, email_change_token_new,
    phone, phone_change, phone_change_token, recovery_token
  ) VALUES (
    shop_user_id, '00000000-0000-0000-0000-000000000000', 'shop@test.com',
    crypt('password123', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"role": "shop", "full_name": "Test Shop"}',
    'authenticated', 'authenticated', '', now(), now(),
    '', '', '', '1111111111', '', '', ''
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), shop_user_id, format('{"sub":"%s","email":"%s"}', shop_user_id::text, 'shop@test.com')::jsonb, 'email', shop_user_id::text, now(), now(), now()
  )
  ON CONFLICT DO NOTHING;

  -- 2. Create Supplier User (Auth)
  INSERT INTO auth.users (
    id, instance_id, email,
    encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, confirmation_token, created_at, updated_at,
    email_change, email_change_token_current, email_change_token_new,
    phone, phone_change, phone_change_token, recovery_token
  ) VALUES (
    supplier_user_id, '00000000-0000-0000-0000-000000000000', 'supplier@test.com',
    crypt('password123', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"role": "supplier", "full_name": "Test Supplier"}',
    'authenticated', 'authenticated', '', now(), now(),
    '', '', '', '2222222222', '', '', ''
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), supplier_user_id, format('{"sub":"%s","email":"%s"}', supplier_user_id::text, 'supplier@test.com')::jsonb, 'email', supplier_user_id::text, now(), now(), now()
  )
  ON CONFLICT DO NOTHING;

  -- 3. Retrieve Auto-Generated Supplier Profile ID (created by Triggers)
  SELECT id INTO supplier_profile_id FROM public.profiles WHERE user_id = supplier_user_id;
  
  -- 4. Get Category IDs
  SELECT id INTO roses_id FROM public.product_categories WHERE slug = 'roses' LIMIT 1;
  SELECT id INTO carnations_id FROM public.product_categories WHERE slug = 'carnations' LIMIT 1;
  
  -- 5. Seed Flower Products for the Supplier
  INSERT INTO public.flower_products (supplier_id, category_id, name, description, price_per_unit, stock_qty, image_url)
  VALUES 
    (supplier_profile_id, roses_id, 'Explorer Red Roses', 'Premium 60cm red roses from Ecuadorian highlands', 1.25, 500, 'https://picsum.photos/seed/flower1/800/600'),
    (supplier_profile_id, roses_id, 'Mondial White Roses', 'Classic pristine white roses, large head size', 1.45, 300, 'https://picsum.photos/seed/flower2/800/600'),
    (supplier_profile_id, carnations_id, 'Pink Fancy Carnations', 'Long-lasting bright pink carnations', 0.85, 1000, 'https://picsum.photos/seed/flower3/800/600');

END $$;