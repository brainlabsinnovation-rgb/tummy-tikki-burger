
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    console.error('Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file to create admin users and bypass RLS.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function createAdmin() {
    const email = process.env.ADMIN_EMAIL || 'admin@tummytikki.com'
    const password = process.env.ADMIN_PASSWORD || 'admin123'

    console.log(`Attempting to create admin user: ${email}`)

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    })

    let userId = authData.user?.id

    if (authError) {
        console.error('Error creating auth user:', authError.message)
        // If user already exists, try to fetch id
        if (authError.message.includes('already registered')) {
            console.log('User already exists, fetching details...')
            // This requires searching users, which admin api can do
            const { data: users, error: listError } = await supabase.auth.admin.listUsers()
            if (listError) {
                console.error('Failed to list users to find existing admin:', listError)
                return
            }
            const existingUser = users.users.find(u => u.email === email)
            if (existingUser) {
                userId = existingUser.id
                console.log('Found existing user ID:', userId)
            } else {
                console.error('Could not find existing user ID despite "already registered" error.')
                return
            }
        } else {
            return
        }
    } else {
        console.log('Auth user created successfully:', userId)
    }

    if (!userId) {
        console.error('No user ID found, aborting.')
        return
    }

    // 2. Create Admin Table Entry
    // Check if already exists
    const { data: existingAdmin, error: checkError } = await supabase
        .from('Admin')
        .select('*')
        .eq('email', email)
        .single()

    if (existingAdmin) {
        console.log('Admin table entry already exists.')
        return
    }

    console.log('Creating Admin table entry...')
    const { data: adminEntry, error: adminError } = await supabase
        .from('Admin')
        .insert({
            email: email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
        .select()

    if (adminError) {
        console.error('Error creating Admin table entry:', adminError)
    } else {
        console.log('Admin table entry created successfully:', adminEntry)
    }
}

createAdmin()
