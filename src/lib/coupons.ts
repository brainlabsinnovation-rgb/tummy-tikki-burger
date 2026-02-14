export interface Coupon {
    id: string;
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minOrderAmount: number;
    maxDiscount?: number;
    validFrom?: string;
    validUntil?: string;
    usageLimit?: number;
    usageCount: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CouponValidationResponse {
    valid: boolean;
    discountAmount: number;
    coupon?: Coupon;
    message: string;
}
