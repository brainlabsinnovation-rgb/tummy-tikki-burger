'use client'

import { motion } from 'framer-motion'
import { Star, Phone, Clock } from 'lucide-react'
import Open24x7Badge from './Open24x7Badge'
import { Button } from './ui/button'

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl animate-bounce">🍔</div>
        <div className="absolute top-20 right-20 text-6xl animate-pulse">🍟</div>
        <div className="absolute bottom-20 left-20 text-7xl animate-bounce" style={{ animationDelay: '1s' }}>🥤</div>
        <div className="absolute bottom-10 right-10 text-5xl animate-pulse" style={{ animationDelay: '0.5s' }}>🧀</div>
      </div>

      <div className="relative container mx-auto px-4 py-12 md:py-20">
        <div className="text-center space-y-6 md:space-y-8">
          {/* 24/7 Badge - Most Prominent */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex justify-center mb-4"
          >
            <Open24x7Badge />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Bite Into <span className="text-orange-500">Happiness!</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Ahmedabad's Most Loved Tikki Burgers Since 2018
          </motion.p>

          {/* Rating Badge */}
          <motion.div
            className="flex items-center justify-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg inline-flex mx-auto"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-bold text-lg">4.8</span>
            <span className="text-gray-600">(1,416+ Happy Customers)</span>
          </motion.div>

          {/* Price Display */}
          <motion.div
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl inline-block mx-auto shadow-xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className="text-2xl md:text-3xl font-bold">
              🍔 Burgers Starting at just Rs 89!
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => window.open('https://www.swiggy.com/restaurants/tummy-tikki-burger-usmanpura-ahmedabad', '_blank')}
            >
              <span className="text-xl">🟠</span> Order on Swiggy
            </Button>
            <Button
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => window.open('https://www.zomato.com/ahmedabad/tummy-tikki-burger-usmanpura', '_blank')}
            >
              <span className="text-xl">🔴</span> Order on Zomato
            </Button>
          </motion.div>

          {/* Quick Contact */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <a
              href="tel:+919998060483"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Phone className="w-5 h-5" />
              Call Now: +91 99980 60483
            </a>
            <a
              href="https://wa.me/919998060483"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-xl">💬</span>
              WhatsApp
            </a>
          </motion.div>

          {/* Animated Burger Stack */}
          <motion.div
            className="relative mt-12 mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.8, type: "spring" }}
          >
            <div className="text-6xl md:text-8xl animate-bounce">
              🍔
            </div>
            <motion.div
              className="absolute -top-4 -right-4 text-4xl md:text-5xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🧀
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 text-3xl md:text-4xl"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🍟
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
