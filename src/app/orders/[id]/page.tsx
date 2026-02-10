'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Clock, MapPin, Phone, User, IndianRupee, CheckCircle, XCircle, Truck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  createdAt: string
  estimatedDelivery?: string
  deliveryName: string
  deliveryPhone: string
  deliveryEmail?: string
  addressLine1: string
  addressLine2?: string
  landmark?: string
  pincode: string
  city: string
  order_items: any[]
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      setSuccess(true)
    }
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      // This would typically fetch from an API endpoint
      // For now, we'll show a mock order or redirect if not found
      setLoading(false)
    } catch (error) {
      console.error('Error fetching order:', error)
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="w-5 h-5" />
      case 'PREPARING': return <Clock className="w-5 h-5" />
      case 'OUT_FOR_DELIVERY': return <Truck className="w-5 h-5" />
      case 'DELIVERED': return <CheckCircle className="w-5 h-5" />
      case 'CANCELLED': return <XCircle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  // Mock order data for demonstration
  const mockOrder: Order = {
    id: orderId,
    orderNumber: `TTB${Date.now()}`,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    subtotal: 289,
    deliveryFee: 0,
    tax: 14.45,
    total: 303.45,
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 40 * 60 * 1000).toISOString(),
    deliveryName: 'John Doe',
    deliveryPhone: '9876543210',
    deliveryEmail: 'john@example.com',
    addressLine1: '123, Main Street',
    addressLine2: 'Apartment 4B',
    landmark: 'Near City Mall',
    pincode: '380001',
    city: 'Ahmedabad',
    order_items: [
      {
        id: '1',
        quantity: 2,
        price: 89,
        item_name: 'Regular Tummy Tikki Burger',
        item_description: 'Our signature homemade tikki burger with fresh veggies'
      },
      {
        id: '2',
        quantity: 1,
        price: 111,
        item_name: 'Cheesy Tummy Tikki Burger',
        item_description: 'Loaded with cheese for cheese lovers'
      }
    ]
  }

  const orderData = order || mockOrder

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
                <h2 className="text-xl font-bold text-gray-900">Order #{orderData.orderNumber}</h2>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
                  {getStatusIcon(orderData.status)}
                  <span>{orderData.status.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Order Date:</span>
                  <p className="font-medium">{formatDateTime(orderData.createdAt)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Payment Status:</span>
                  <p className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${orderData.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {orderData.paymentStatus}
                  </p>
                </div>
                {orderData.estimatedDelivery && (
                  <div>
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <p className="font-medium">{formatDateTime(orderData.estimatedDelivery)}</p>
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
                  <span className="font-medium">{orderData.deliveryName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{orderData.deliveryPhone}</span>
                </div>
                <div className="text-gray-700">
                  <p>{orderData.addressLine1}</p>
                  {orderData.addressLine2 && <p>{orderData.addressLine2}</p>}
                  {orderData.landmark && <p>{orderData.landmark}</p>}
                  <p>{orderData.city}, {orderData.pincode}</p>
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
                {orderData.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.item_name}</h4>
                      <p className="text-sm text-gray-600">{item.item_description}</p>
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
                  <span className="font-medium text-gray-900"><IndianRupee className="w-3 h-3 inline" />{orderData.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={`font-medium ${orderData.deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {orderData.deliveryFee === 0 ? 'FREE' : <><IndianRupee className="w-3 h-3 inline" />{orderData.deliveryFee}</>}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (5%)</span>
                  <span className="font-medium text-gray-900"><IndianRupee className="w-3 h-3 inline" />{orderData.tax}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-100">
                  <span className="text-gray-900">Total Paid</span>
                  <span className="text-orange-600 text-xl">
                    <IndianRupee className="w-5 h-5 inline" />{orderData.total}
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
