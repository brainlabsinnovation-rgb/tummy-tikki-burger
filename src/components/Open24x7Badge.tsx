'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

export default function Open24x7Badge() {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold shadow-lg"
      animate={{
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 0 20px rgba(255, 0, 0, 0.5)',
          '0 0 30px rgba(255, 165, 0, 0.8)',
          '0 0 20px rgba(255, 0, 0, 0.5)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Clock className="w-5 h-5" />
      <span className="text-lg">OPEN 24/7</span>
    </motion.div>
  )
}
