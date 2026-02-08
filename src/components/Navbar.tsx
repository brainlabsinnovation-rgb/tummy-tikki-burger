'use client'

import { motion } from 'framer-motion'
import { Phone, Menu, X, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Open24x7Badge from './Open24x7Badge'
import CartIcon from './CartIcon'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl md:text-3xl">🍔</span>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">Tummy Tikki Burger</h1>
              <p className="text-xs text-gray-600">Since 2018</p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#menu" className="text-gray-700 hover:text-orange-500 font-semibold transition-colors">Menu</a>
            <a href="#offers" className="text-gray-700 hover:text-orange-500 font-semibold transition-colors">Offers</a>
            <a href="#contact" className="text-gray-700 hover:text-orange-500 font-semibold transition-colors">Contact</a>
            <Open24x7Badge />
            <CartIcon />
            <a
              href="tel:+919998060483"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <Link
              href="/admin/login"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 border border-gray-300 rounded-full hover:bg-gray-50 transition-all"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4">
              <a href="#menu" className="text-gray-700 hover:text-orange-500 font-semibold">Menu</a>
              <a href="#offers" className="text-gray-700 hover:text-orange-500 font-semibold">Offers</a>
              <a href="#contact" className="text-gray-700 hover:text-orange-500 font-semibold">Contact</a>
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg"
                onClick={() => {
                  const event = new CustomEvent('openCart')
                  window.dispatchEvent(event)
                  setIsMenuOpen(false)
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                View Cart
              </button>
              <div className="flex justify-center py-2">
                <Open24x7Badge />
              </div>
              <a
                href="tel:+919998060483"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg"
              >
                <Phone className="w-4 h-4" />
                Call Now: +91 99980 60483
              </a>
              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 border border-gray-300 rounded-full hover:bg-gray-50 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
