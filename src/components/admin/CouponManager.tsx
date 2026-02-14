'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Tag, Calendar, IndianRupee, Percent, Settings2, Power, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coupon } from '@/lib/coupons';
import toast from 'react-hot-toast';

export default function CouponManager() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Coupon>>({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        minOrderAmount: 0,
        maxDiscount: 0,
        validFrom: '',
        validUntil: '',
        usageLimit: 100,
        isActive: true,
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/admin/coupons');
            const data = await res.json();
            setCoupons(data);
        } catch (error) {
            toast.error('Failed to fetch coupons');
        }
    };

    const handleEdit = (coupon: Coupon) => {
        setEditingId(coupon.id);
        setFormData({
            ...coupon,
            validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
            validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
        });
        setIsAdding(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? 'PATCH' : 'POST';
        const url = '/api/admin/coupons';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingId ? { ...formData, id: editingId } : formData),
            });

            if (res.ok) {
                toast.success(editingId ? 'Coupon updated' : 'Coupon created');
                resetForm();
                fetchCoupons();
            } else {
                const error = await res.json();
                toast.error(error.message || 'Operation failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                toast.success('Coupon deleted');
                fetchCoupons();
            }
        } catch (error) {
            toast.error('Failed to delete coupon');
        }
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({
            code: '',
            discountType: 'PERCENTAGE',
            discountValue: 0,
            minOrderAmount: 0,
            maxDiscount: 0,
            validFrom: '',
            validUntil: '',
            usageLimit: 100,
            isActive: true,
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Promotions & Coupons</h2>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Manage discount campaigns</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                >
                    <Plus className="w-4 h-4" />
                    New Coupon
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-8 rounded-[2rem] border-2 border-orange-100 shadow-xl"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Coupon Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-black text-sm uppercase tracking-widest text-gray-900 placeholder:text-gray-300"
                                        placeholder="E.G. SUMMER50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Discount Type</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                    >
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Discount Value</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-black text-sm text-gray-900"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
                                            {formData.discountType === 'PERCENTAGE' ? <Percent className="w-4 h-4" /> : <IndianRupee className="w-4 h-4" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Min Order (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Max Discount (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                                        disabled={formData.discountType === 'FIXED'}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-sm text-gray-900 disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Usage Limit</label>
                                    <input
                                        type="number"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Active Status</label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={`w-full px-6 py-4 border-2 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${formData.isActive ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                                    >
                                        <Power className="w-4 h-4" />
                                        {formData.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Valid From</label>
                                    <input
                                        type="date"
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Valid Until</label>
                                    <input
                                        type="date"
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-8 py-4 text-gray-400 hover:text-gray-600 font-black text-[10px] uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-500 transition-all shadow-xl active:scale-95"
                                >
                                    {editingId ? 'Update Campaign' : 'Launch Campaign'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {coupons.map((coupon) => (
                    <motion.div
                        key={coupon.id}
                        layout
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all group overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 -mr-16 -mt-16 transition-opacity" />

                        <div className="relative z-10 flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className={`p-4 rounded-2xl ${coupon.isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <Tag className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">{coupon.code}</h3>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${coupon.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                            {coupon.isActive ? 'Live' : 'Paused'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            <span className="text-[10px] font-bold">
                                                {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'No Expiry'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Eye className="w-3 h-3" />
                                            <span className="text-[10px] font-bold">Used {coupon.usageCount}/{coupon.usageLimit || '∞'} times</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleEdit(coupon)}
                                    className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(coupon.id)}
                                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-50 grid grid-cols-3 gap-4 relative z-10">
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Saving</p>
                                <p className="font-black text-orange-500 text-lg">
                                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                </p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Threshold</p>
                                <p className="font-black text-gray-900 text-lg">₹{coupon.minOrderAmount || 0}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Max Cap</p>
                                <p className="font-black text-gray-900 text-lg">
                                    {coupon.discountType === 'PERCENTAGE' ? `₹${coupon.maxDiscount || '∞'}` : 'Varies'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
