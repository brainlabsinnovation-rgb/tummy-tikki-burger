'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Car } from 'lucide-react'

export default function Location() {
  return (
    <section id="contact" className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Visit Our <span className="text-orange-500">Location</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Come experience the best tikki burgers in Ahmedabad! We're open 24/7.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="aspect-w-16 aspect-h-12">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.1234567890!2d72.5947!3d23.0528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sTummy%20Tikki%20Burger!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-96 lg:h-full min-h-[400px]"
                title="Tummy Tikki Burger Location Map"
              />
            </div>
          </motion.div>

          {/* Location Info */}
          <motion.div
            className="space-y-6"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Address */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    📍 Our Address
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    2HWCMW5, Sai Prasad Apartment, 120 Feet Ring Road, Soni Ni Chal, 
                    Sattar Taluka Society, Usmanpura, Ahmedabad, Gujarat 380013
                  </p>
                  <div className="mt-3">
                    <a
                      href="https://maps.google.com/?q=Tummy+Tikki+Burger+Usmanpura+Ahmedabad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600 font-semibold inline-flex items-center gap-1"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🕐 Operating Hours
                  </h3>
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full inline-block font-bold mb-2">
                    OPEN 24 HOURS
                  </div>
                  <p className="text-gray-700">
                    Monday - Sunday: 12:00 AM - 11:59 PM
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    We never close! Order anytime, day or night.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    📞 Contact Us
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="tel:+919998060483"
                      className="block text-lg font-semibold text-gray-900 hover:text-orange-500 transition-colors"
                    >
                      +91 99980 60483
                    </a>
                    <a
                      href="https://wa.me/919998060483"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold transition-colors"
                    >
                      💬 WhatsApp Us
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Parking */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Car className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🚗 Parking Available
                  </h3>
                  <p className="text-gray-700">
                    Free parking space available for customers. Easy access from 120 Feet Ring Road.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Car className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-semibold">
                      10+ parking spaces available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 md:p-8 text-center text-white"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-4">
            🎉 Visit Us Today or Order Online!
          </h3>
          <p className="text-lg mb-6">
            Experience Ahmedabad's favorite 24/7 burger destination
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919998060483"
              className="bg-white text-orange-500 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition-colors"
            >
              📞 Call for Pickup
            </a>
            <a
              href="https://www.swiggy.com/restaurants/tummy-tikki-burger-usmanpura-ahmedabad"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-500 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition-colors"
            >
              🚚 Order Delivery
            </a>
            <a
              href="https://maps.google.com/?q=Tummy+Tikki+Burger+Usmanpura+Ahmedabad"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-500 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition-colors"
            >
              🗺️ Get Directions
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
