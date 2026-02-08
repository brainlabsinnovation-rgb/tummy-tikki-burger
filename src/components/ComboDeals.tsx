'use client'

import { motion } from 'framer-motion'
import { Users, Clock, Moon } from 'lucide-react'

export default function ComboDeals() {
  const comboDeals = [
    {
      title: "Student Special",
      price: "Rs 149",
      originalPrice: "Rs 179",
      savings: "Save Rs 30",
      items: ["1 Burger", "1 French Fries", "1 Cold Coffee"],
      icon: "🎓",
      badge: "Most Popular",
      badgeColor: "bg-green-500",
      description: "Perfect for study sessions and late-night cravings!"
    },
    {
      title: "Duo Deal",
      price: "Rs 229",
      originalPrice: "Rs 278",
      savings: "Save Rs 49",
      items: ["2 Burgers", "2 Drinks"],
      icon: "👥",
      badge: "Best Value",
      badgeColor: "bg-blue-500",
      description: "Share the happiness with your best friend!"
    },
    {
      title: "Late Night Pack",
      price: "Rs 259",
      originalPrice: "Rs 319",
      savings: "Save Rs 60",
      items: ["1 Burger", "1 Garlic Bread", "1 Cold Coffee"],
      icon: "🌙",
      badge: "Night Special",
      badgeColor: "bg-purple-500",
      description: "Perfect fuel for your midnight adventures!"
    }
  ]

  return (
    <section id="offers" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Amazing <span className="text-orange-500">Combo Deals</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Get more value for your money with our specially curated combo packs
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Available 24/7 - Even at Midnight!</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {comboDeals.map((deal, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              {/* Badge */}
              {deal.badge && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div className={`${deal.badgeColor} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                    {deal.badge}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 h-full">
                {/* Icon */}
                <div className="text-4xl mb-4 text-center">{deal.icon}</div>
                
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
                  {deal.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 text-center">
                  {deal.description}
                </p>
                
                {/* Items */}
                <div className="bg-white rounded-xl p-4 mb-4">
                  <ul className="space-y-2">
                    {deal.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Pricing */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-orange-500">
                      {deal.price}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {deal.originalPrice}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <span>💰</span>
                    <span>{deal.savings}</span>
                  </div>
                </div>
                
                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105">
                  Order Combo Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 md:p-8 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              🎉 Limited Time Offer: Extra 10% Off on All Combos!
            </h3>
            <p className="text-lg mb-4">
              Use code: <span className="bg-white text-orange-500 px-3 py-1 rounded font-bold">TUMMY10</span>
            </p>
            <p className="text-sm opacity-90">
              Valid on all orders above Rs 200. Available 24/7!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
