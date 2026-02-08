'use client'

import { motion } from 'framer-motion'
import { Phone, MapPin, Clock, Instagram, Facebook, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍔</span>
              <div>
                <h3 className="text-xl font-bold">Tummy Tikki Burger</h3>
                <p className="text-sm text-gray-400">Since 2018</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Ahmedabad's most loved 24/7 tikki burger destination. Bite into happiness anytime!
            </p>
            <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full inline-block">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-bold">OPEN 24/7</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#menu" className="text-gray-400 hover:text-orange-500 transition-colors">
                  🍔 Menu
                </a>
              </li>
              <li>
                <a href="#offers" className="text-gray-400 hover:text-orange-500 transition-colors">
                  🎉 Combo Deals
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-orange-500 transition-colors">
                  📍 Location
                </a>
              </li>
              <li>
                <a href="https://www.swiggy.com/restaurants/tummy-tikki-burger-usmanpura-ahmedabad" 
                   target="_blank" rel="noopener noreferrer"
                   className="text-gray-400 hover:text-orange-500 transition-colors">
                  🟠 Order on Swiggy
                </a>
              </li>
              <li>
                <a href="https://www.zomato.com/ahmedabad/tummy-tikki-burger-usmanpura" 
                   target="_blank" rel="noopener noreferrer"
                   className="text-gray-400 hover:text-orange-500 transition-colors">
                  🔴 Order on Zomato
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <a href="tel:+919998060483" className="text-gray-400 hover:text-orange-500 transition-colors">
                  +91 99980 60483
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span className="text-gray-400 text-sm">
                  Usmanpura, Ahmedabad
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-gray-400">24/7 Open</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <a href="mailto:info@tummytikkiburger.com" className="text-gray-400 hover:text-orange-500 transition-colors">
                  info@tummytikkiburger.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/tummy_tikki_burger"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Instagram className="w-5 h-5" />
                <span className="font-semibold">@tummy_tikki_burger</span>
              </a>
              <a
                href="https://www.facebook.com/tummytikkiburger"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-blue-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Facebook className="w-5 h-5" />
                <span className="font-semibold">Facebook</span>
              </a>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Special Features:</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">🌱 Pure Veg</span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">🅿️ Parking</span>
                <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs">🚚 Free Delivery</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-800 mt-8 pt-8 text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-2">
            © 2024 Tummy Tikki Burger. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Made with ❤️ in Ahmedabad | Serving happiness 24/7 since 2018
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">Jain Food Available</span>
            <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full">Student Friendly</span>
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Quick Service</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
