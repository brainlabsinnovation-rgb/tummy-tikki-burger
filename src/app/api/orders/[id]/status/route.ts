import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { status } = await request.json();
        const { id: orderId } = await params;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        // Prepare update object
        const updateData: any = {
            status,
            updatedAt: new Date().toISOString()
        };

        // If status is DELIVERED, also mark payment as PAID
        if (status === 'DELIVERED') {
            updateData.paymentStatus = 'PAID';
        }

        const { data, error } = await supabaseAdmin
            .from('Order')
            .update(updateData)
            .eq('id', orderId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, order: data });
    } catch (error: any) {
        console.error('Error updating order status:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
