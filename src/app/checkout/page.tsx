'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { IndianRupee, ArrowLeft, Clock, MapPin, User, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import toast from 'react-hot-toast'
import CouponInput from '@/components/CouponInput'

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
  const {
    items,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getDiscount,
    getGrandTotal,
    appliedCoupon
  } = useCartStore()
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
  const discount = getDiscount()
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
          discountAmount: discount,
          couponCode: appliedCoupon?.code || null,
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
          <Link href="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6 font-bold uppercase tracking-widest text-[10px]">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Checkout</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Complete your order details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Form */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 md:p-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-orange-500" />
                </div>
                Delivery Information
              </h2>

              <div className="space-y-10">
                {/* Contact Information */}
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-900 font-bold"
                        placeholder="E.G. JOHN DOE"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-900 font-bold"
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-900 font-bold"
                        placeholder="EMAIL@EXAMPLE.COM"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Address Line 1</label>
                      <textarea
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-900 font-bold resize-none"
                        placeholder="HOUSE NO, STREET, AREA"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Address Line 2</label>
                      <textarea
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-900 font-bold resize-none"
                        placeholder="APARTMENT, FLOOR, ETC. (OPTIONAL)"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Landmark</label>
                        <input
                          type="text"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-900 font-bold"
                          placeholder="NEAR CITY MALL"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-900 font-bold"
                          placeholder="380001"
                          maxLength={6}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-900 font-bold"
                        placeholder="AHMEDABAD"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            <CouponInput />

            <motion.div
              className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 sticky top-4 overflow-hidden border border-white"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none" />

              <h2 className="text-xl font-black text-gray-900 mb-6 relative z-10">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto scrollbar-hide relative z-10">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex flex-col group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm group-hover:text-orange-500 transition-colors">{item.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.customizations?.map((c) => (
                            <span key={c.id} className="text-[10px] font-black uppercase tracking-tighter bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded-lg border border-gray-100">
                              {c.type === 'removal' ? 'No ' : ''}{c.name}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-black text-gray-900 text-sm">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t-2 border-dashed border-gray-100 pt-6 space-y-4 relative z-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-black text-gray-900">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-black text-green-600 uppercase tracking-widest text-[10px]">Discount Applied</span>
                    <span className="font-black text-green-600">-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm">
                  <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Delivery Fee</span>
                  <span className={`font-black ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">GST (5%)</span>
                  <span className="font-black text-gray-900">₹{tax}</span>
                </div>

                <div className="pt-6 mt-4 border-t-2 border-gray-900/5">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Grand Total</p>
                      <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{grandTotal}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest animate-pulse">Ready to eat!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-8 p-5 bg-gradient-to-br from-orange-50 to-white rounded-3xl border border-orange-100 flex items-center gap-4 relative z-10">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Est. Delivery</p>
                  <p className="font-black text-orange-600">40-45 Minutes</p>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-gray-900 text-white h-16 rounded-[1.5rem] mt-8 text-xl font-black shadow-2xl shadow-gray-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                      Processing...
                    </>
                  ) : (
                    <>Pay ₹{grandTotal}</>
                  )}
                </span>
              </button>

              <div className="flex items-center justify-center gap-3 mt-6 relative z-10 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                <div className="h-px bg-gray-200 flex-1" />
                <img src="/razorpay-icon.png" alt="Razorpay" className="h-4 object-contain" />
                <div className="h-px bg-gray-200 flex-1" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
