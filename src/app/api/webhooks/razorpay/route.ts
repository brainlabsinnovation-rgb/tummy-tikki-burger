import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
    try {
        const text = await req.text();
        const signature = req.headers.get('x-razorpay-signature');
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!secret) {
            console.error('RAZORPAY_WEBHOOK_SECRET is not set');
            return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
        }

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(text)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const body = JSON.parse(text);
        const event = body.event;
        const payload = body.payload;

        console.log(`✅ Received webhook event: ${event}`);

        // Handle payment success events
        if (event === 'payment.captured' || event === 'order.paid') {
            const payment = payload.payment.entity;
            const razorpayOrderId = payment.order_id;
            const paymentId = payment.id;

            if (!razorpayOrderId) {
                console.error('No order_id in payment entity');
                return NextResponse.json({ error: 'No order_id in payment entity' }, { status: 400 });
            }

            console.log(`💳 Processing payment for Razorpay Order ID: ${razorpayOrderId}`);

            // Update order using Supabase Admin client
            const { data: order, error: updateError } = await supabaseAdmin
                .from('Order')
                .update({
                    paymentStatus: 'PAID',
                    status: 'CONFIRMED',
                    razorpayPaymentId: paymentId,
                    razorpaySignature: signature, // Store signature for audit trail
                    updatedAt: new Date().toISOString()
                })
                .eq('razorpayOrderId', razorpayOrderId)
                .select()
                .single();

            if (updateError) {
                console.error('❌ Error updating order:', updateError);
                return NextResponse.json(
                    { error: 'Failed to update order', details: updateError.message },
                    { status: 500 }
                );
            }

            if (!order) {
                console.error(`❌ Order not found for Razorpay Order ID: ${razorpayOrderId}`);
                return NextResponse.json(
                    { error: 'Order not found' },
                    { status: 404 }
                );
            }

            console.log(`✅ Order ${order.id} updated via webhook: PAID`);
            console.log(`   - Payment ID: ${paymentId}`);
            console.log(`   - Status: ${order.status}`);
            console.log(`   - Payment Status: ${order.paymentStatus}`);

            // Fetch order items for the confirmation email
            const { data: orderWithItems } = await supabaseAdmin
                .from('Order')
                .select('*, orderItems:OrderItem(*)')
                .eq('id', order.id)
                .single();

            // Trigger Email Notification (Non-blocking)
            if (orderWithItems) {
                const { sendOrderConfirmation } = await import('@/lib/mail');
                sendOrderConfirmation(orderWithItems).catch(err => console.error('Email trigger failed:', err));
            }

            // Revalidate dashboard and order page
            revalidatePath('/admin/dashboard');
            revalidatePath(`/orders/${order.id}`);

            return NextResponse.json({
                received: true,
                orderId: order.id,
                status: order.status
            });
        }

        // Handle payment failed events
        if (event === 'payment.failed') {
            const payment = payload.payment.entity;
            const razorpayOrderId = payment.order_id;

            if (razorpayOrderId) {
                console.log(`❌ Payment failed for Razorpay Order ID: ${razorpayOrderId}`);

                const { error: updateError } = await supabaseAdmin
                    .from('Order')
                    .update({
                        paymentStatus: 'FAILED',
                        status: 'CANCELLED',
                        updatedAt: new Date().toISOString()
                    })
                    .eq('razorpayOrderId', razorpayOrderId);

                if (updateError) {
                    console.error('Error updating failed payment:', updateError);
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('❌ Webhook Error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
