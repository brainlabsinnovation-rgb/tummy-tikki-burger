import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: 'Razorpay is not configured' },
        { status: 500 }
      );
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', keySecret)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update order in database
      const { error } = await supabase
        .from('Order')
        .update({
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      return NextResponse.json({ verified: true });
    } else {
      // Update payment as failed
      const { error } = await supabase
        .from('Order')
        .update({
          paymentStatus: 'FAILED',
          updatedAt: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      return NextResponse.json({ verified: false }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
