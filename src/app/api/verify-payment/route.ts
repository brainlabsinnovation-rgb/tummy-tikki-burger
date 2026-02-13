import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Verify payment body:', body);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId // Our internal order ID
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

      // Update order in database using Supabase Admin
      const { data, error } = await supabaseAdmin
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
        .select()
        .single();

      if (error) {
        console.error('Error updating order status:', error);
        // Payment verified but DB update failed
        return NextResponse.json(
          { error: 'Payment verified but order update failed', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        verified: true,
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      // Payment verification failed
      // Optional: Update order status to FAILED
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
