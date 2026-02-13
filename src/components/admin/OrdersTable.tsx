'use client';

import { useState, Fragment } from 'react';
import { CheckCircle, XCircle, Package, Truck, Check, ChevronDown, ChevronUp, MapPin, Phone, User, ShoppingBag, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderItem {
    id: string;
    itemName: string;
    quantity: number;
    price: number;
    subtotal: number;
}

interface Order {
    id: string;
    orderNumber: string;
    createdAt: string;
    deliveryName: string;
    deliveryPhone: string;
    deliveryEmail?: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    pincode: string;
    city: string;
    state: string;
    status: string;
    paymentStatus: string;
    total: number;
    orderItems?: OrderItem[];
}

export default function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [loading, setLoading] = useState<string | null>(null);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const router = useRouter();

    const updateStatus = async (orderId: string, newStatus: string) => {
        setLoading(orderId);
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');
            const result = await response.json();

            if (result.success && result.order) {
                setOrders(orders.map(order =>
                    order.id === orderId ? { ...order, ...result.order } : order
                ));
            } else {
                setOrders(orders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                ));
            }

            router.refresh();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update status');
        } finally {
            setLoading(null);
        }
    };

    const toggleExpand = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            case 'PENDING': return 'bg-orange-100 text-orange-700';
            case 'PREPARING': return 'bg-blue-100 text-blue-700';
            case 'OUT_FOR_DELIVERY': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Details</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Payment</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <Fragment key={order.id}>
                                    <tr
                                        className={`group transition-all duration-300 cursor-pointer ${expandedOrder === order.id ? 'bg-orange-50/30' : 'hover:bg-gray-50/50'}`}
                                        onClick={() => toggleExpand(order.id)}
                                    >
                                        <td className="px-6 py-6 font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl transition-colors ${expandedOrder === order.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-500'}`}>
                                                    {expandedOrder === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <span className="font-black text-gray-900 block tracking-tight">#{order.orderNumber.split('-')[1]}</span>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="font-bold text-gray-900 leading-none">{order.deliveryName}</p>
                                            <p className="text-[10px] font-black text-gray-400 mt-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                                <Phone className="w-3 h-3 text-orange-400" />
                                                {order.deliveryPhone}
                                            </p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${getStatusColor(order.status)}`}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${order.paymentStatus === 'PAID'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-orange-100 text-orange-500'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-green-500' : 'bg-orange-500'}`} />
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-2">
                                                {order.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(order.id, 'PREPARING')}
                                                            disabled={loading === order.id}
                                                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95"
                                                        >
                                                            <CheckCircle className="w-3 h-3" />
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(order.id, 'CANCELLED')}
                                                            disabled={loading === order.id}
                                                            className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}

                                                {order.status === 'PREPARING' && (
                                                    <button
                                                        onClick={() => updateStatus(order.id, 'OUT_FOR_DELIVERY')}
                                                        disabled={loading === order.id}
                                                        className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 active:scale-95"
                                                    >
                                                        <Truck className="w-3 h-3" />
                                                        Dispatch
                                                    </button>
                                                )}

                                                {order.status === 'OUT_FOR_DELIVERY' && (
                                                    <button
                                                        onClick={() => updateStatus(order.id, 'DELIVERED')}
                                                        disabled={loading === order.id}
                                                        className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Delivered
                                                    </button>
                                                )}

                                                {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Completed</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <p className="font-black text-gray-900 text-lg">₹{order.total}</p>
                                        </td>
                                    </tr>
                                    {expandedOrder === order.id && (
                                        <tr className="bg-orange-50/20 border-l-4 border-l-orange-500">
                                            <td colSpan={6} className="px-12 py-8">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                    {/* Items List */}
                                                    <div>
                                                        <h4 className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest mb-6">
                                                            <ShoppingBag className="w-4 h-4 text-orange-500" />
                                                            Order Items ({order.orderItems?.length || 0})
                                                        </h4>
                                                        <div className="space-y-4">
                                                            {order.orderItems?.map((item) => (
                                                                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center font-black text-orange-500 text-sm">
                                                                            {item.quantity}x
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-gray-900 text-sm">{item.itemName}</p>
                                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">₹{item.price} per unit</p>
                                                                        </div>
                                                                    </div>
                                                                    <p className="font-black text-gray-900">₹{item.subtotal}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Delivery & Customer Info */}
                                                    <div>
                                                        <h4 className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-widest mb-6">
                                                            <MapPin className="w-4 h-4 text-orange-500" />
                                                            Delivery Address
                                                        </h4>
                                                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                                                            <div>
                                                                <div className="flex items-start gap-4">
                                                                    <div className="mt-1 p-2 bg-gray-50 rounded-lg">
                                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-gray-900 leading-relaxed">
                                                                            {order.addressLine1}
                                                                            {order.addressLine2 && <>, {order.addressLine2}</>}
                                                                        </p>
                                                                        {order.landmark && (
                                                                            <p className="mt-2 text-sm text-orange-600 font-bold flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-lg w-fit">
                                                                                <TrendingUp className="w-3 h-3 rotate-45" />
                                                                                Landmark: {order.landmark}
                                                                            </p>
                                                                        )}
                                                                        <p className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                                            {order.pincode} • {order.city}, {order.state}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="pt-6 border-t border-gray-50 flex flex-wrap gap-8">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-blue-50 rounded-lg">
                                                                        <User className="w-4 h-4 text-blue-500" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Person</p>
                                                                        <p className="font-bold text-gray-900">{order.deliveryName}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-green-50 rounded-lg">
                                                                        <Phone className="w-4 h-4 text-green-500" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                                                        <p className="font-bold text-gray-900">{order.deliveryPhone}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                                    No orders found yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
