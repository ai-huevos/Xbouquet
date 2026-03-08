-- Seed File for Automated MVP UX Reviews (Mission 23-30)
-- This file creates persistent, predictable test users and seed data.

DO $$
DECLARE
  shop_user_id uuid := '10000000-0000-0000-0000-000000000001';
  supplier_user_id uuid := '20000000-0000-0000-0000-000000000002';
  supplier_profile_id uuid;
  roses_id uuid;
  carnations_id uuid;
  lilies_id uuid;
  sunflowers_id uuid;
  orchids_id uuid;
  foliage_id uuid;
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

  -- 3. Insert profiles if triggers didn't fire (direct SQL bypass)
  INSERT INTO public.profiles (user_id, role, full_name)
  VALUES (shop_user_id, 'shop', 'Test Shop')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.profiles (user_id, role, full_name)
  VALUES (supplier_user_id, 'supplier', 'Test Supplier')
  ON CONFLICT (user_id) DO NOTHING;

  -- 4. Insert shop_profiles with B2B credit terms
  INSERT INTO public.shop_profiles (profile_id, business_name, contact_email, credit_limit, current_balance, payment_terms)
  VALUES (
    (SELECT id FROM public.profiles WHERE user_id = shop_user_id),
    'FloraShop NYC',
    'shop@test.com',
    5000.00,
    0.00,
    'net_30'
  )
  ON CONFLICT (profile_id) DO NOTHING;

  -- 5. Insert supplier_profiles
  INSERT INTO public.supplier_profiles (profile_id, business_name, contact_email)
  VALUES (
    (SELECT id FROM public.profiles WHERE user_id = supplier_user_id),
    'Sunshine Farms Ecuador',
    'supplier@test.com'
  )
  ON CONFLICT (profile_id) DO NOTHING;

  -- 6. Get the supplier profile_id for products
  SELECT id INTO supplier_profile_id FROM public.profiles WHERE user_id = supplier_user_id;

  -- 7. Get Category IDs
  SELECT id INTO roses_id FROM public.product_categories WHERE slug = 'roses' LIMIT 1;
  SELECT id INTO carnations_id FROM public.product_categories WHERE slug = 'carnations' LIMIT 1;
  SELECT id INTO lilies_id FROM public.product_categories WHERE slug = 'lilies' LIMIT 1;
  SELECT id INTO sunflowers_id FROM public.product_categories WHERE slug = 'sunflowers' LIMIT 1;
  SELECT id INTO orchids_id FROM public.product_categories WHERE slug = 'orchids' LIMIT 1;
  SELECT id INTO foliage_id FROM public.product_categories WHERE slug = 'foliage' LIMIT 1;

  -- 8. Seed 8 Flower Products with real B2B data
  INSERT INTO public.flower_products (supplier_id, category_id, name, description, price_per_unit, stock_qty, image_url, box_type, stems_per_bunch, stem_length_cm)
  VALUES 
    (supplier_profile_id, roses_id, 'Explorer Red Roses', 'Premium 60cm red roses from Ecuadorian highlands. Vibrant deep crimson with large, velvety heads.', 1.25, 500, '/seeds/red-roses.jpg', 'QB', 25, 60),
    (supplier_profile_id, roses_id, 'Mondial White Roses', 'Classic pristine white roses, perfect for weddings and premium arrangements. Large head size.', 1.45, 300, '/seeds/carnations.jpg', 'HB', 25, 50),
    (supplier_profile_id, carnations_id, 'Pink Fancy Carnations', 'Long-lasting bright pink carnations with ruffled petals. Excellent vase life of 14+ days.', 0.85, 1000, '/seeds/sunflowers.jpg', 'FB', 25, 55),
    (supplier_profile_id, lilies_id, 'Stargazer Oriental Lilies', 'Fragrant pink and white stargazer lilies. 3-5 blooms per stem, spectacular presentation.', 3.50, 200, '/seeds/red-roses.jpg', 'QB', 10, 70),
    (supplier_profile_id, sunflowers_id, 'Sunrich Gold Sunflowers', 'Bright golden sunflowers with pollenless centers. Perfect for summer arrangements.', 1.75, 400, '/seeds/sunflowers.jpg', 'HB', 10, 65),
    (supplier_profile_id, orchids_id, 'Dendrobium Purple Orchids', 'Exotic purple dendrobium orchids. Long-lasting with 8-12 blooms per stem.', 4.25, 150, '/seeds/carnations.jpg', 'QB', 10, 45),
    (supplier_profile_id, foliage_id, 'Italian Ruscus', 'Lush green Italian ruscus foliage. Essential filler green for arrangements.', 0.65, 800, '/seeds/red-roses.jpg', 'FB', 25, 60),
    (supplier_profile_id, carnations_id, 'Nobbio Spray Carnations', 'Multi-bloom spray carnations in assorted colors. 4-6 blooms per stem.', 0.95, 600, '/seeds/sunflowers.jpg', 'HB', 25, 50)
  ON CONFLICT DO NOTHING;

END $$;