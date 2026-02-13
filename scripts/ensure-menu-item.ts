
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function ensureMenuItem() {
    console.log('Ensuring test menu item exists...')

    // Check if 'item-1' exists
    const { data: existing, error: checkError } = await supabase
        .from('MenuItem')
        .select('*')
        .eq('id', 'item-1')
        .single();

    if (existing) {
        console.log('Test item already exists:', existing.id)
        return;
    }

    // Create item-1
    const { data: created, error: createError } = await supabase
        .from('MenuItem')
        .insert({
            id: 'item-1',
            name: 'Test Burger',
            description: 'A test burger',
            price: 100,
            imageUrl: 'https://via.placeholder.com/150',
            categoryId: 'cat-1', // Assuming category exists or is not enforced strictly?
            isAvailable: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
        .select()
        .single()

    if (createError) {
        console.error('Failed to create item-1:', createError)
        // If it failed due to category FK, create category first
        if (createError.message.includes('foreign key constraint')) {
            console.log('Creating category first...')
            await supabase.from('Category').insert({
                id: 'cat-1',
                name: 'Test Category',
                slug: 'test-category',
                imageUrl: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            // Retry item create
            const { error: retryError } = await supabase
                .from('MenuItem')
                .insert({
                    id: 'item-1',
                    name: 'Test Burger',
                    description: 'A test burger',
                    price: 100,
                    imageUrl: '',
                    categoryId: 'cat-1',
                    isAvailable: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })

            if (retryError) console.error('Retry failed:', retryError)
            else console.log('Created item-1 after category')
        }
    } else {
        console.log('Created test item:', created)
    }
}

ensureMenuItem()
