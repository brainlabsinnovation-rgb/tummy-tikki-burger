'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, Clock, IndianRupee, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  estimatedDelivery?: string
  order_items: any[]
}

export default function OrdersPage() {
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!phone.trim() || !/^\d{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/orders?phone=${phone}`)
      const data = await response.json()
      setOrders(data)
      setSearched(true)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Orders</h1>
          <p className="text-gray-600">Enter your phone number to view your order history</p>
        </div>

        {/* Search Section */}
        <motion.div
          className="max-w-md mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex gap-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                maxLength={10}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                  <div className="text-6xl mb-4">🍔</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-6">
                    {phone ? `No orders found for phone number ${phone}` : 'Enter your phone number to track your orders'}
                  </p>
                  <Link href="/#menu">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Place Your First Order
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Found {orders.length} order{orders.length > 1 ? 's' : ''}
                </h2>
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            Order #{order.orderNumber}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateTime(order.createdAt)}</span>
                          </div>
                          {order.estimatedDelivery && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Est. {formatDateTime(order.estimatedDelivery)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-gray-600">Items:</span>
                          <div className="flex flex-wrap gap-1">
                            {order.order_items.slice(0, 3).map((item: any, index: number) => (
                              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {item.quantity}x {item.item_name}
                              </span>
                            ))}
                            {order.order_items.length > 3 && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                +{order.order_items.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-500">
                            <IndianRupee className="w-5 h-5 inline" />
                            {order.total}
                          </div>
                        </div>
                        
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            View Details
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Quick Actions */}
        {!searched && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/#menu" className="block">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    🍔 Order Food
                  </Button>
                </Link>
                <Link href="/tel:+919998060483" className="block">
                  <Button variant="outline" className="w-full">
                    📞 Call Restaurant
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
