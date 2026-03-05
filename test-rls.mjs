import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dHB3dmRkd3pzc2hnbmVrZXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NjYyNDgsImV4cCI6MjA4ODE0MjI0OH0.So7EYnt_lKcF0NkqsktWXH4hwNI4ZgHxtb_HbHUOVZ8';

const admin = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_KEY);

const makeClient = (token) => {
    return createClient(SUPABASE_URL, SUPABASE_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    });
};

async function testRLS() {
    console.log("=== Testing RLS Policies ===");

    // 1. Setup Data using Admin or Anon Signup
    const anonClient = createClient(SUPABASE_URL, SUPABASE_KEY);

    const ts = Date.now();
    const shopEmail = `shop${ts}@test.com`;
    const supplierAEmail = `suppA${ts}@test.com`;
    const supplierBEmail = `suppB${ts}@test.com`;

    // Sign up shop
    const { data: shopAuth, error: e1 } = await anonClient.auth.signUp({
        email: shopEmail, password: 'password123', options: { data: { role: 'shop', full_name: 'Shop', business_name: 'Shop 1' } }
    });
    if (e1) throw new Error("Shop signup failed: " + e1.message);

    // Sign up supplier A
    const { data: suppAAuth, error: e2 } = await anonClient.auth.signUp({
        email: supplierAEmail, password: 'password123', options: { data: { role: 'supplier', full_name: 'Supplier A', business_name: 'Supplier A Farm' } }
    });
    if (e2) throw new Error("Supp A signup failed: " + e2.message);

    // Sign up supplier B
    const { data: suppBAuth, error: e3 } = await anonClient.auth.signUp({
        email: supplierBEmail, password: 'password123', options: { data: { role: 'supplier', full_name: 'Supplier B', business_name: 'Supplier B Farm' } }
    });
    if (e3) throw new Error("Supp B signup failed: " + e3.message);

    // Wait for triggers to create profiles
    await new Promise(r => setTimeout(r, 1000));

    const clientShop = makeClient(shopAuth.session.access_token);
    const clientA = makeClient(suppAAuth.session.access_token);
    const clientB = makeClient(suppBAuth.session.access_token);

    // Supplier A creates a product
    const { data: pA, error: errA } = await clientA.from('profiles').select('id').eq('user_id', suppAAuth.session.user.id).single();
    const suppAProfileId = pA.id;

    // Fetch a valid category
    const { data: cat } = await anonClient.from('product_categories').select('id').limit(1).single();
    const catId = cat.id;

    const { error: insertErrA } = await clientA.from('flower_products').insert({
        supplier_id: suppAProfileId,
        category_id: catId,
        name: 'Red Roses',
        price_per_unit: 10,
        stock_qty: 100
    });
    if (insertErrA) console.error("Insert Err A:", insertErrA);

    // Supplier B creates a product
    const { data: pB } = await clientB.from('profiles').select('id').eq('user_id', suppBAuth.session.user.id).single();
    const suppBProfileId = pB.id;
    const { error: insertErrB } = await clientB.from('flower_products').insert({
        supplier_id: suppBProfileId,
        category_id: catId,
        name: 'White Lilies',
        price_per_unit: 15,
        stock_qty: 50
    });
    if (insertErrB) console.error("Insert Err B:", insertErrB);

    // Test 1: Shop can read ALL products
    const { data: shopProds } = await clientShop.from('flower_products').select('*');
    const canShopSeeAll = shopProds.length === 2;
    console.log(`[Shop] Can see all products: ${canShopSeeAll ? 'PASS' : 'FAIL'} (${shopProds.length} products found)`);

    // Test 2: Supplier A can ONLY read their own products
    const { data: suppAProds } = await clientA.from('flower_products').select('*');
    const canASeeOnlyOwn = suppAProds.length === 1 && suppAProds[0].supplier_id === suppAProfileId;
    console.log(`[Supplier A] Can see only own products: ${canASeeOnlyOwn ? 'PASS' : 'FAIL'} (${suppAProds.length} products found)`);

    // Force fail if tests don't pass
    if (!canShopSeeAll || !canASeeOnlyOwn) {
        process.exit(1);
    }
}

testRLS().catch(e => {
    console.error(e);
    process.exit(1);
});
