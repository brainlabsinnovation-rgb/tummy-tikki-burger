import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function CartIcon() {
  const { getTotalItems } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const totalItems = getTotalItems()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        // This will be handled by the parent component
        const event = new CustomEvent('openCart');
        window.dispatchEvent(event);
      }}
    >
      <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-orange-500 transition-colors" />

      {mounted && totalItems > 0 && (
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </motion.div>
      )}
    </motion.div>
  )
}
