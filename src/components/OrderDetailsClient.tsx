'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Clock, MapPin, Phone, User, IndianRupee, CheckCircle, XCircle, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OrderItem {
    id: string
    itemName: string
    quantity: number
    price: number
    itemImage?: string | null
    createdAt: Date | string
    // ... other fields if needed
}

interface Order {
    id: string
    orderNumber: string
    status: string
    paymentStatus: string
    subtotal: number
    deliveryFee: number
    tax: number
    total: number
    createdAt: Date | string
    estimatedDelivery?: Date | string | null
    deliveryName: string
    deliveryPhone: string
    deliveryEmail?: string | null
    addressLine1: string
    addressLine2?: string | null
    landmark?: string | null
    pincode: string
    city: string
    orderItems: OrderItem[]
    // ... other fields
}

interface OrderDetailsClientProps {
    order: Order
    success?: boolean
}

export default function OrderDetailsClient({ order, success: initialSuccess }: OrderDetailsClientProps) {
    const [success, setSuccess] = useState(initialSuccess)

    useEffect(() => {
        // If we wanted to client-side clear the query param, we could do it here,
        // but cleaner to just let the parent handle the initial state.
        if (initialSuccess) {
            // Maybe auto-hide after some time?
            const timer = setTimeout(() => setSuccess(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [initialSuccess])

    const getStatusColor = (status: string) => {
        const s = status.toUpperCase()
        switch (s) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800'
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
            case 'PREPARING': return 'bg-orange-100 text-orange-800'
            case 'OUT_FOR_DELIVERY': return 'bg-purple-100 text-purple-800'
            case 'DELIVERED': return 'bg-green-100 text-green-800'
            case 'CANCELLED': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusIcon = (status: string) => {
        const s = status.toUpperCase()
        switch (s) {
            case 'CONFIRMED': return <CheckCircle className="w-5 h-5" />
            case 'PREPARING': return <Clock className="w-5 h-5" />
            case 'OUT_FOR_DELIVERY': return <Truck className="w-5 h-5" />
            case 'DELIVERED': return <CheckCircle className="w-5 h-5" />
            case 'CANCELLED': return <XCircle className="w-5 h-5" />
            default: return <Clock className="w-5 h-5" />
        }
    }

    const formatDateTime = (date: Date | string | null | undefined) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Success Message */}
                {success && (
                    <motion.div
                        className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                                <h3 className="font-bold text-green-900">Order Placed Successfully! 🎉</h3>
                                <p className="text-green-700">Your order has been confirmed and is being prepared.</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Header */}
                <div className="mb-6">
                    <Link href="/orders" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Orders
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Order Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status */}
                        <motion.div
                            className="bg-white rounded-2xl shadow-lg p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span>{order.status.replace('_', ' ')}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Order Date:</span>
                                    <p className="font-medium">{formatDateTime(order.createdAt)}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Payment Status:</span>
                                    <p className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.paymentStatus}
                                    </p>
                                </div>
                                {order.estimatedDelivery && (
                                    <div>
                                        <span className="text-gray-600">Estimated Delivery:</span>
                                        <p className="font-medium">{formatDateTime(order.estimatedDelivery)}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Delivery Address */}
                        <motion.div
                            className="bg-white rounded-2xl shadow-lg p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-orange-500" />
                                Delivery Address
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium">{order.deliveryName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{order.deliveryPhone}</span>
                                </div>
                                <div className="text-gray-700">
                                    <p>{order.addressLine1}</p>
                                    {order.addressLine2 && <p>{order.addressLine2}</p>}
                                    {order.landmark && <p>{order.landmark}</p>}
                                    <p>{order.city}, {order.pincode}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Items */}
                        <motion.div
                            className="bg-white rounded-2xl shadow-lg p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.itemName}</h4>

                                            {/* Customizations Display */}
                                            {(item as any).customizations && (item as any).customizations.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1 mb-1">
                                                    {(item as any).customizations.map((c: any) => (
                                                        <span key={c.id} className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100 font-medium">
                                                            {c.type === 'removal' ? 'No ' : ''}{c.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="font-semibold text-orange-500">
                                            <IndianRupee className="w-4 h-4 inline" />
                                            {item.price * item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="lg:col-span-1">
                        <motion.div
                            className="bg-white rounded-2xl shadow-lg p-6 sticky top-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Price Details</h2>

                            {/* Price Breakdown */}
                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900"><IndianRupee className="w-3 h-3 inline" />{order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className={`font-medium ${order.deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                        {order.deliveryFee === 0 ? 'FREE' : <><IndianRupee className="w-3 h-3 inline" />{order.deliveryFee}</>}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax (5%)</span>
                                    <span className="font-medium text-gray-900"><IndianRupee className="w-3 h-3 inline" />{order.tax}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-100">
                                    <span className="text-gray-900">Total Paid</span>
                                    <span className="text-orange-600 text-xl">
                                        <IndianRupee className="w-5 h-5 inline" />{order.total}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 space-y-3">
                                <Link href="/#menu">
                                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                                        Order Again
                                    </Button>
                                </Link>
                                <Link href="tel:+919998060483">
                                    <Button variant="outline" className="w-full">
                                        Contact Restaurant
                                    </Button>
                                </Link>
                            </div>

                            {/* Help Section */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    If you have any questions about your order, feel free to contact us.
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-orange-500" />
                                        <span>+91 99980 60483</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        <span>24/7 Support</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
