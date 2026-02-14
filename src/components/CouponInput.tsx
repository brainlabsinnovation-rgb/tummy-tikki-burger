'use client';

import { useState } from 'react';
import { Tag, Ticket, X, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function CouponInput() {
    const [code, setCode] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const { getSubtotal, setAppliedCoupon, appliedCoupon, discountAmount } = useCartStore();

    const handleApplyCoupon = async () => {
        if (!code.trim()) return;

        setIsValidating(true);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code.trim().toUpperCase(),
                    cartTotal: getSubtotal()
                })
            });

            const data = await res.json();

            if (data.valid) {
                setAppliedCoupon(data.coupon, data.discountAmount);
                toast.success(data.message);
                setCode('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            toast.error('Failed to apply coupon. Please try again.');
        } finally {
            setIsValidating(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null, 0);
        toast('Coupon removed', { icon: 'ℹ️' });
    };

    return (
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Ticket className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider leading-none">Apply Coupon</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Unlock delicious savings!</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {appliedCoupon ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-green-50 border-2 border-green-100 rounded-2xl p-4 relative overflow-hidden group"
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-500 text-white p-1.5 rounded-full">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-black text-green-700 text-sm leading-none uppercase tracking-tighter">
                                        {appliedCoupon.code}
                                    </p>
                                    <p className="text-[10px] font-bold text-green-600 mt-1">
                                        ₹{discountAmount} SAVED! 🎉
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemoveCoupon}
                                className="p-2 hover:bg-green-100 rounded-xl text-green-400 hover:text-green-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Decorative circle */}
                        <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-green-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-2"
                    >
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="ENTER CODE"
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-xl px-4 py-3 font-black text-sm uppercase tracking-widest text-gray-900 transition-all outline-none placeholder:text-gray-300 placeholder:font-bold"
                            />
                            {isValidating && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent" />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleApplyCoupon}
                            disabled={!code.trim() || isValidating}
                            className={`px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${!code.trim() || isValidating
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-100'
                                }`}
                        >
                            Apply
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
