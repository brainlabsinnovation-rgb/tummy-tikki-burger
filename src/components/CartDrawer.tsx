'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Minus, ShoppingCart, Trash2, IndianRupee } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import AddToCartButton from './AddToCartButton'

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getGrandTotal
  } = useCartStore()

  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true)
    window.addEventListener('openCart', handleOpenCart)
    return () => window.removeEventListener('openCart', handleOpenCart)
  }, [])

  const subtotal = getSubtotal()
  const deliveryFee = getDeliveryFee()
  const tax = getTax()
  const grandTotal = getGrandTotal()
  const totalItems = getTotalItems()

  const handleCheckout = () => {
    setIsOpen(false)
    window.location.href = '/checkout'
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Your Cart</h2>
                  {totalItems > 0 && (
                    <span className="bg-white text-orange-500 px-2 py-1 rounded-full text-sm font-bold">
                      {totalItems}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some delicious burgers to get started!</p>
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-gray-50 rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-3xl">
                            {item.category === 'burger' ? '🍔' :
                              item.category === 'sandwich' ? '🥪' :
                                item.category === 'sides' ? '🍟' : '🥤'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600 mb-2 truncate">{item.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors text-gray-700"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-semibold w-8 text-center text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors text-gray-700"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-bold text-orange-600">
                                <IndianRupee className="w-4 h-4 inline" />
                                {item.price * item.quantity}
                              </span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t bg-white p-6 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900"><IndianRupee className="w-3 h-3 inline" />{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {deliveryFee === 0 ? 'FREE' : <><IndianRupee className="w-3 h-3 inline" />{deliveryFee}</>}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (5%)</span>
                    <span className="font-semibold text-gray-900"><IndianRupee className="w-3 h-3 inline" />{tax}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-100">
                    <span className="text-gray-900">Total</span>
                    <span className="text-orange-600 text-xl">
                      <IndianRupee className="w-5 h-5 inline" />{grandTotal}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all rounded-xl"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-6 text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50 rounded-xl"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
