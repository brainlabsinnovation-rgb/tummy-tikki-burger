import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const formatImageUrl = (image: string | null) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menu-images/${image}`;
};

// GET all menu items for admin
export async function GET() {
    try {
        const { data: menuItems, error } = await supabaseAdmin
            .from('MenuItem')
            .select(`
        *,
        Category:categoryId (*)
      `)
            .order('createdAt', { ascending: false });

        if (error) throw error;

        // Formatted items with resolved image URLs
        const formattedItems = menuItems?.map(item => ({
            ...item,
            image: formatImageUrl(item.image)
        }));

        return NextResponse.json(formattedItems);
    } catch (error: any) {
        console.error('Error fetching admin menu:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST create new menu item
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, price, categoryId, isVeg, isAvailable, image } = body;

        if (!name || !price || !categoryId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate a unique slug and ID
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const id = `item_${Date.now()}`; // Using timestamp for a reasonably unique ID in the existing pattern

        const { data, error } = await supabaseAdmin
            .from('MenuItem')
            .insert([
                {
                    id,
                    slug: `${slug}-${Math.floor(Math.random() * 1000)}`, // Adding random suffix for safety
                    name,
                    description,
                    price: parseFloat(price.toString()),
                    categoryId,
                    isVeg,
                    isAvailable,
                    image: image || null,
                    updatedAt: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase Error (POST):', error);
            throw error;
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error creating menu item:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH update menu item
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        // Sanitize updates: Only include valid database columns
        // This prevents errors if 'Category' or other joined objects are included from the frontend
        const allowedFields = ['name', 'description', 'price', 'categoryId', 'image', 'isVeg', 'isAvailable', 'updatedAt'];
        const cleanUpdates: any = {};

        Object.keys(updates).forEach(key => {
            if (allowedFields.includes(key)) {
                cleanUpdates[key] = key === 'price' ? parseFloat(updates[key]) : updates[key];
            }
        });

        cleanUpdates.updatedAt = new Date().toISOString();

        const { data, error } = await supabaseAdmin
            .from('MenuItem')
            .update(cleanUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error updating menu item:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE menu item
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('MenuItem')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting menu item:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
