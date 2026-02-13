import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PATCH(req: Request) {
    try {
        const { categoryId, isAvailable } = await req.json();

        if (!categoryId) {
            return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('MenuItem')
            .update({ isAvailable })
            .eq('categoryId', categoryId);

        if (error) throw error;

        return NextResponse.json({ success: true, isAvailable });
    } catch (error: any) {
        console.error('Error in bulk availability toggle:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
