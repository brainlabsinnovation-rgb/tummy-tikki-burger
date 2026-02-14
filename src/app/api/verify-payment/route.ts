import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment successful

      // Update order and get order data to check for coupon code
      const { data: order, error } = await supabaseAdmin
        .from('Order')
        .update({
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          updatedAt: new Date().toISOString(),
          confirmedAt: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select('couponCode')
        .single();

      if (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json(
          { error: 'Payment verified but order update failed', details: error.message },
          { status: 500 }
        );
      }

      // If a coupon was used, increment its usage count via RPC or direct update
      // Supabase JS doesn't have an atomic increment easily in-built without RPC
      // But we can do it via a quick fetch-then-update or just use an SQL statement
      if (order?.couponCode) {
        // We'll use a raw increment update for reliability
        await supabaseAdmin.rpc('increment_coupon_usage', { code_param: order.couponCode });
      }

      return NextResponse.json({
        verified: true,
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      await supabaseAdmin
        .from('Order')
        .update({
          paymentStatus: 'FAILED',
          updatedAt: new Date().toISOString()
        })
        .eq('id', orderId);

      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
