'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export default function CustomerReviews() {
  const reviews = [
    {
      name: "Rahul Sharma",
      rating: 5,
      review: "Best burgers in Ahmedabad! The fact that they're open 24/7 is a lifesaver for late-night study sessions. The homemade tikki patties are amazing!",
      time: "2 weeks ago",
      emoji: "🎓"
    },
    {
      name: "Priya Patel",
      rating: 5,
      review: "Affordable, delicious, and always fresh! I order from here at least twice a week. The student special combo is perfect value for money.",
      time: "1 month ago",
      emoji: "💼"
    },
    {
      name: "Amit Kumar",
      rating: 5,
      review: "Craving burgers at 3 AM? Tummy Tikki Burger has your back! Quick delivery even at odd hours. Quality never compromises!",
      time: "3 weeks ago",
      emoji: "🌙"
    },
    {
      name: "Neha Desai",
      rating: 5,
      review: "Pure vegetarian paradise! Being Jain, I appreciate their Jain options. The paneer garlic bread is to die for. Highly recommended!",
      time: "2 months ago",
      emoji: "🌱"
    },
    {
      name: "Karan Mehta",
      rating: 5,
      review: "The cheesy tummy tikki burger is my go-to comfort food! Great taste, reasonable prices, and they're always open. What more could you ask for?",
      time: "1 week ago",
      emoji: "🍔"
    }
  ]

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="text-orange-500">Happy Customers</span> Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Join 1,416+ satisfied customers who love our 24/7 service!
          </p>
          <div className="mt-6 flex justify-center items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">4.8</span>
            <span className="text-gray-600">(1,416+ reviews)</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -left-3 text-orange-500 opacity-20">
                <Quote className="w-12 h-12" />
              </div>

              {/* Customer Emoji */}
              <div className="text-3xl mb-3">{review.emoji}</div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{review.review}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.time}</p>
                </div>
                <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
                  Verified Customer
                </div>
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
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 md:p-8 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              Join Our Happy Family! 🎉
            </h3>
            <p className="text-lg mb-4">
              Over 50,000+ burgers served since 2018!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.swiggy.com/restaurants/tummy-tikki-burger-usmanpura-ahmedabad"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition-colors"
              >
                Order on Swiggy
              </a>
              <a
                href="https://www.zomato.com/ahmedabad/tummy-tikki-burger-usmanpura"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition-colors"
              >
                Order on Zomato
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
