'use client'

import { motion } from 'framer-motion'
import { ChefHat, Clock, DollarSign, Star } from 'lucide-react'

export default function WhyTummyTikki() {
  const features = [
    {
      icon: ChefHat,
      title: "Homemade Tikki Patties",
      description: "Fresh patties made daily, never frozen. Authentic taste with quality ingredients.",
      emoji: "👨‍🍳",
      color: "from-orange-400 to-red-500"
    },
    {
      icon: Clock,
      title: "Open 24/7",
      description: "Craving burgers at midnight? We're always here for you, anytime day or night!",
      emoji: "🌙",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: DollarSign,
      title: "Under Rs 150 Budget Friendly",
      description: "Delicious burgers that don't break the bank. Quality food at student-friendly prices.",
      emoji: "💰",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Star,
      title: "4.8 Star Rated",
      description: "Loved by 1,416+ happy customers. Ahmedabad's most loved tikki burger joint.",
      emoji: "⭐",
      color: "from-yellow-400 to-orange-500"
    }
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why <span className="text-orange-500">Tummy Tikki</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover what makes us Ahmedabad's favorite 24/7 burger destination
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} mb-4`}>
                  <span className="text-2xl">{feature.emoji}</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="mt-4 flex items-center text-orange-500 font-semibold group-hover:text-orange-600 transition-colors">
                  <span className="text-sm">Learn More</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
