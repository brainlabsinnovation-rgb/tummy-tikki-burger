'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { IndianRupee, ArrowLeft, Clock, MapPin, User, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface FormData {
  fullName: string
  phone: string
  email: string
  addressLine1: string
  addressLine2: string
  landmark: string
  pincode: string
  city: string
}

export default function Checkout() {
  const router = useRouter()
  const { items, clearCart, getSubtotal, getDeliveryFee, getTax, getGrandTotal } = useCartStore()
  const [isMounted, setIsMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    pincode: '',
    city: 'Ahmedabad'
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const subtotal = getSubtotal()
  const deliveryFee = getDeliveryFee()
  const tax = getTax()
  const grandTotal = getGrandTotal()

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
            <Link href="/#menu">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Go to Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name')
      return false
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number')
      return false
    }
    if (!formData.addressLine1.trim()) {
      toast.error('Please enter your address')
      return false
    }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
      toast.error('Please enter a valid 6-digit pincode')
      return false
    }
    return true
  }

  const handleCheckout = async () => {
    if (!validateForm()) return
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      toast.error('Payments are not configured. Please contact support.')
      return
    }

    setIsProcessing(true)

    try {
      // Step 1: Create order in database
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          deliveryDetails: formData,
          subtotal,
          deliveryFee,
          tax,
          total: grandTotal,
        }),
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create order')
      }

      const order = await orderRes.json()

      // Step 2: Create Razorpay order
      const razorpayRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      });

      if (!razorpayRes.ok) {
        throw new Error('Failed to create payment order')
      }

      const { orderId: razorpayOrderId } = await razorpayRes.json()

      // Step 3: Open Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(grandTotal * 100),
        currency: 'INR',
        name: 'Tummy Tikki Burger',
        description: `Order #${order.orderNumber}`,
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          // Verify payment with database order ID
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              orderId: order.id,
            }),
          });

          const { verified } = await verifyRes.json();

          if (verified) {
            toast.success('Order placed successfully! 🎉')
            clearCart()
            router.push(`/orders/${order.id}?success=true`)
          } else {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone,
          email: formData.email || '',
        },
        theme: {
          color: '#FF5722',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your order details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Form */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Delivery Information
              </h2>

              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 placeholder:text-gray-400"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 placeholder:text-gray-400"
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 placeholder:text-gray-400"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address Line 1 *
                      </label>
                      <textarea
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                        placeholder="123, Main Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address Line 2
                      </label>
                      <textarea
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                        placeholder="Apartment, Floor, etc."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Landmark
                        </label>
                        <input
                          type="text"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 placeholder:text-gray-400"
                          placeholder="Near City Mall"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 placeholder:text-gray-400"
                          placeholder="380001"
                          maxLength={6}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900"
                        placeholder="Ahmedabad"
                      />
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-orange-500">
                      <IndianRupee className="w-3 h-3 inline" />
                      {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900"><IndianRupee className="w-3 h-3 inline" />{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {deliveryFee === 0 ? 'FREE' : <><IndianRupee className="w-3 h-3 inline" />{deliveryFee}</>}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (5%)</span>
                  <span className="font-medium text-gray-900"><IndianRupee className="w-3 h-3 inline" />{tax}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-100">
                  <span className="text-gray-900">Total</span>
                  <span className="text-orange-600 text-xl">
                    <IndianRupee className="w-5 h-5 inline" />{grandTotal}
                  </span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700 text-sm">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Estimated Delivery</span>
                </div>
                <p className="text-orange-600 text-sm mt-1">40-45 minutes</p>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 mt-6"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${grandTotal}`
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secure payment powered by Razorpay
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
