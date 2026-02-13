import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        const { data: categories, error } = await supabaseAdmin
            .from('Category')
            .select('*')
            .order('name');

        if (error) throw error;

        return NextResponse.json(categories);
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name } = await req.json();
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        const { data: category, error } = await supabaseAdmin
            .from('Category')
            .insert({ id, name, slug, updatedAt: now })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(category);
    } catch (error: any) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, name } = await req.json();
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const now = new Date().toISOString();

        const { data: category, error } = await supabaseAdmin
            .from('Category')
            .update({ name, slug, updatedAt: now })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(category);
    } catch (error: any) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) throw new Error('Category ID is required');

        // Check if there are menu items in this category
        const { count, error: countError } = await supabaseAdmin
            .from('MenuItem')
            .select('*', { count: 'exact', head: true })
            .eq('categoryId', id);

        if (countError) throw countError;
        if (count && count > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with associated menu items. Reassign items first.' },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from('Category')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
