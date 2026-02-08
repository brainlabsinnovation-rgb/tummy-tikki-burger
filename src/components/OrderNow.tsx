'use client'

import { motion } from 'framer-motion'
import { Phone, Clock, MapPin } from 'lucide-react'

export default function OrderNow() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Order Now - <span className="text-yellow-300">We're Open 24/7!</span>
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Craving burgers at midnight? We've got you covered! Order anytime, anywhere.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Delivery Apps */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-2xl"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              📱 Order on Delivery Apps
            </h3>
            <div className="space-y-4">
              <a
                href="https://www.swiggy.com/restaurants/tummy-tikki-burger-usmanpura-ahmedabad"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="flex items-center justify-center gap-3">
                  🟠 Order on Swiggy
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">Fast Delivery</span>
                </span>
              </a>
              <a
                href="https://www.zomato.com/ahmedabad/tummy-tikki-burger-usmanpura"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="flex items-center justify-center gap-3">
                  🔴 Order on Zomato
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">Best Offers</span>
                </span>
              </a>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                🚀 Average delivery time: Under 30 minutes
              </p>
            </div>
          </motion.div>

          {/* Direct Contact */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-2xl"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              📞 Direct Order & Pickup
            </h3>
            <div className="space-y-4">
              <a
                href="tel:+919998060483"
                className="block w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5" />
                  Call Now: +91 99980 60483
                </span>
              </a>
              <a
                href="https://wa.me/919998060483"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="flex items-center justify-center gap-3">
                  💬 WhatsApp Order
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">Quick Response</span>
                </span>
              </a>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                🏃‍♂️ Quick pickup available in under 10 minutes
              </p>
            </div>
          </motion.div>
        </div>

        {/* Special Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white">
            <Clock className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
            <h4 className="font-bold text-lg mb-2">24/7 Service</h4>
            <p className="text-white/80 text-sm">
              Order anytime, day or night. We never close!
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
            <h4 className="font-bold text-lg mb-2">Free Delivery</h4>
            <p className="text-white/80 text-sm">
              On orders above Rs 149 within 5km radius
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white">
            <Phone className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
            <h4 className="font-bold text-lg mb-2">Live Tracking</h4>
            <p className="text-white/80 text-sm">
              Track your order in real-time on delivery apps
            </p>
          </div>
        </motion.div>

        {/* Emergency Order Banner */}
        <motion.div
          className="mt-12 bg-yellow-400 text-gray-900 rounded-2xl p-6 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-3">
            🚨 Emergency Hunger? We've Got You!
          </h3>
          <p className="text-lg mb-4">
            Late night study sessions? Post-party cravings? Early morning hunger?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919998060483"
              className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-full font-bold transition-colors"
            >
              📞 Call Emergency Hotline
            </a>
            <a
              href="https://wa.me/919998060483?text=Hi!%20I%20need%20urgent%20burger%20delivery!"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-full font-bold transition-colors"
            >
              💬 WhatsApp Emergency Order
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
