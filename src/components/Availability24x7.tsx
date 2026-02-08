'use client'

import { motion } from 'framer-motion'
import { Clock, Moon, Sun, Coffee } from 'lucide-react'
import Open24x7Badge from './Open24x7Badge'

export default function Availability24x7() {
  const timeSlots = [
    {
      icon: Moon,
      title: "Late Night Cravings",
      time: "10 PM - 4 AM",
      description: "Midnight hunger? We've got you covered with hot, fresh burgers anytime!",
      emoji: "🌙"
    },
    {
      icon: Coffee,
      title: "Early Morning Breakfast",
      time: "4 AM - 8 AM",
      description: "Start your day with our delicious breakfast options and burgers!",
      emoji: "🌅"
    },
    {
      icon: Sun,
      title: "All Day Dining",
      time: "8 AM - 10 PM",
      description: "Perfect for lunch, dinner, or anytime snacks with friends and family!",
      emoji: "☀️"
    }
  ]

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-6">
            <Open24x7Badge />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Always <span className="text-red-500">Open,</span> Always <span className="text-orange-500">Fresh!</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            No more waiting for restaurants to open! Tummy Tikki Burger serves delicious homemade tikki burgers 24 hours a day, 7 days a week. Your hunger doesn't check the clock, and neither do we!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {timeSlots.map((slot, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">{slot.emoji}</div>
                <div className="flex justify-center mb-4">
                  <slot.icon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {slot.title}
                </h3>
                <p className="text-orange-500 font-semibold mb-3">
                  {slot.time}
                </p>
                <p className="text-gray-600">
                  {slot.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-8 md:p-12 text-center text-white"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-6xl mb-6 animate-pulse">🍔</div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            No Time Restrictions, No Compromises!
          </h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Whether it's 3 AM study sessions, post-party hunger pangs, or early morning breakfast cravings - 
            we're here with the same quality and taste, 24/7!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919998060483"
              className="bg-white text-red-500 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-colors transform hover:scale-105"
            >
              📞 Call Anytime
            </a>
            <a
              href="https://wa.me/919998060483"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white hover:bg-green-700 px-8 py-3 rounded-full font-bold transition-colors transform hover:scale-105"
            >
              💬 WhatsApp Order
            </a>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full">
            <Clock className="w-6 h-6" />
            <span className="font-bold text-lg">Average Delivery Time: Under 30 Minutes - Even at Midnight!</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
