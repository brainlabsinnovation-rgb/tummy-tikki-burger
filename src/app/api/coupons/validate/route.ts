import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Coupon } from '@/lib/coupons';

export async function POST(req: Request) {
    try {
        const { code, cartTotal } = await req.json();

        if (!code) {
            return NextResponse.json({ valid: false, message: 'Coupon code is required', discountAmount: 0 });
        }

        // Fetch coupon
        const { data: coupon, error } = await supabaseAdmin
            .from('Coupon')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();

        if (error || !coupon) {
            return NextResponse.json({ valid: false, message: 'Invalid coupon code', discountAmount: 0 });
        }

        // Check active status
        if (!coupon.isActive) {
            return NextResponse.json({ valid: false, message: 'This coupon is no longer active', discountAmount: 0 });
        }

        const now = new Date();

        // Check start date
        if (coupon.validFrom && new Date(coupon.validFrom) > now) {
            return NextResponse.json({ valid: false, message: 'This coupon is not yet valid', discountAmount: 0 });
        }

        // Check expiry
        if (coupon.validUntil && new Date(coupon.validUntil) < now) {
            return NextResponse.json({ valid: false, message: 'This coupon has expired', discountAmount: 0 });
        }

        // Check usage limit
        if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
            return NextResponse.json({ valid: false, message: 'This coupon has reached its usage limit', discountAmount: 0 });
        }

        // Check min order amount
        if (cartTotal < (coupon.minOrderAmount || 0)) {
            return NextResponse.json({
                valid: false,
                message: `Minimum order of ₹${coupon.minOrderAmount} required for this coupon`,
                discountAmount: 0
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        } else {
            discountAmount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed cart total
        discountAmount = Math.min(discountAmount, cartTotal);

        return NextResponse.json({
            valid: true,
            discountAmount,
            coupon,
            message: 'Coupon applied successfully! 🎉'
        });

    } catch (error: any) {
        console.error('Error validating coupon:', error);
        return NextResponse.json({ valid: false, message: 'Internal server error', discountAmount: 0 }, { status: 500 });
    }
}
