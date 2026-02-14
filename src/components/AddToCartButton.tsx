'use client'

import { Plus, ShoppingCart, PowerOff } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface AddToCartButtonProps {
  item: {
    id: string
    name: string
    description: string
    price: number
    category: string
    image: string
    isVeg: boolean
    isAvailable: boolean
  }
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function AddToCartButton({ item, size = 'md', className = '' }: AddToCartButtonProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem(item)
    toast.success(`${item.name} added to cart! 🍔`, {
      position: 'top-center',
      duration: 2000,
      style: {
        background: '#FF5722',
        color: 'white',
      },
    })
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <motion.button
      onClick={handleAddToCart}
      className={`${item.isAvailable ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'} text-white font-semibold rounded-full transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl ${sizeClasses[size]} ${className}`}
      whileHover={item.isAvailable ? { scale: 1.05 } : {}}
      whileTap={item.isAvailable ? { scale: 0.95 } : {}}
      disabled={!item.isAvailable}
    >
      {item.isAvailable ? (
        <>
          <ShoppingCart className={iconSizes[size]} />
          <span>Add to Cart</span>
          <Plus className={iconSizes[size]} />
        </>
      ) : (
        <>
          <PowerOff className={iconSizes[size]} />
          <span>Sold Out</span>
        </>
      )}
    </motion.button>
  )
}
