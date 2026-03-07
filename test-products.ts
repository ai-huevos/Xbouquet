import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    const { data, error } = await supabase
        .from('flower_products')
        .select('id, name, stock_qty, category_id')
        .ilike('name', '%Test E2E Rose%')

    console.log('Products:', data)
    console.log('Error:', error)
}

main()
