'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import AddToCartButton from './AddToCartButton'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  isVeg: boolean
  isAvailable: boolean
}

interface MenuData {
  [category: string]: MenuItem[]
}

export default function MenuGrid() {
  const [menuData, setMenuData] = useState<MenuData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fallbackMenuData: MenuData = {
    burger: [
      {
        id: 'regular-burger',
        name: 'Regular Tummy Tikki Burger',
        description: 'Our signature homemade tikki burger with fresh veggies',
        price: 89,
        category: 'burger',
        image: '',
        isVeg: true,
        isAvailable: true
      },
      {
        id: 'cheesy-burger',
        name: 'Cheesy Tummy Tikki Burger',
        description: 'Loaded with cheese for cheese lovers',
        price: 109,
        category: 'burger',
        image: '',
        isVeg: true,
        isAvailable: true
      },
      {
        id: 'paneer-burger',
        name: 'Paneer with Cheese Fully Loaded Burger',
        description: 'Premium paneer patty with extra cheese',
        price: 143,
        category: 'burger',
        image: '',
        isVeg: true,
        isAvailable: true
      }
    ],
    sandwich: [
      {
        id: 'grilled-sandwich',
        name: 'Butter Grilled Sandwich',
        description: 'Classic grilled sandwich with butter',
        price: 35,
        category: 'sandwich',
        image: '',
        isVeg: true,
        isAvailable: true
      },
      {
        id: 'jumbo-sandwich',
        name: 'Jumbo Wheat Bread Sandwich',
        description: 'Healthy option with fresh veggies and melted cheese',
        price: 120,
        category: 'sandwich',
        image: '',
        isVeg: true,
        isAvailable: true
      }
    ],
    sides: [
      {
        id: 'french-fries',
        name: 'French Fries',
        description: 'Crispy golden french fries',
        price: 60,
        category: 'sides',
        image: '',
        isVeg: true,
        isAvailable: true
      },
      {
        id: 'cheese-fries',
        name: 'Cheese Fries',
        description: 'French fries loaded with melted cheese',
        price: 80,
        category: 'sides',
        image: '',
        isVeg: true,
        isAvailable: true
      }
    ],
    beverage: [
      {
        id: 'cold-coffee',
        name: 'Cold Coffee',
        description: 'Refreshing cold coffee',
        price: 70,
        category: 'beverage',
        image: '',
        isVeg: true,
        isAvailable: true
      },
      {
        id: 'lime-soda',
        name: 'Fresh Lime Soda',
        description: 'Fresh and tangy lime soda',
        price: 50,
        category: 'beverage',
        image: '',
        isVeg: true,
        isAvailable: true
      },
      {
        id: 'masala-chaas',
        name: 'Masala Chaas',
        description: 'Traditional spiced buttermilk',
        price: 40,
        category: 'beverage',
        image: '',
        isVeg: true,
        isAvailable: true
      }
    ]
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu')
      if (!response.ok) {
        throw new Error('Failed to load menu from API')
      }
      const data = await response.json()
      setMenuData(data)
    } catch (error) {
      console.error('Error fetching menu:', error)
      setError('Menu service unavailable. Showing default menu.')
      setMenuData(fallbackMenuData)
    } finally {
      setLoading(false)
    }
  }

  const menuCategories = [
    {
      title: "🍔 Burgers",
      key: 'burger',
      items: menuData.burger || []
    },
    {
      title: "🥪 Sandwiches & Sides",
      key: 'sandwich',
      items: [...(menuData.sandwich || []), ...(menuData.sides || [])]
    },
    {
      title: "🥤 Beverages",
      key: 'beverage',
      items: menuData.beverage || []
    }
  ]

  if (loading) {
    return (
      <section id="menu" className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading delicious menu...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="menu" className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-orange-500">Menu</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Delicious homemade tikki burgers and more, starting at just Rs 89!
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <span className="text-2xl">🌱</span>
            <span className="font-semibold">100% Pure Vegetarian</span>
          </div>
        </motion.div>

        {menuCategories.map((category, categoryIndex) => (
          <div key={category.key} className="mb-12">
            <motion.h3
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              {category.title}
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item: MenuItem, itemIndex: number) => (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: (categoryIndex * 0.1) + (itemIndex * 0.1) }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-gray-900 flex-1">
                        {item.name}
                      </h4>
                      {item.id === 'regular-burger' && (
                        <Badge className="bg-green-500 text-white text-xs ml-2">
                          Most Popular
                        </Badge>
                      )}
                      {item.id === 'cheesy-burger' && (
                        <Badge className="bg-yellow-500 text-white text-xs ml-2">
                          Cheese Lovers
                        </Badge>
                      )}
                      {item.id === 'paneer-burger' && (
                        <Badge className="bg-purple-500 text-white text-xs ml-2">
                          Premium
                        </Badge>
                      )}
                      {item.id === 'grilled-sandwich' && (
                        <Badge className="bg-blue-500 text-white text-xs ml-2">
                          Cheapest
                        </Badge>
                      )}
                      {item.id === 'jumbo-sandwich' && (
                        <Badge className="bg-green-600 text-white text-xs ml-2">
                          Healthy
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-orange-500">
                        Rs {item.price}
                      </span>
                      <div className="flex items-center gap-1">
                        {item.isVeg && (
                          <span className="text-green-600 text-xs">🌱</span>
                        )}
                      </div>
                    </div>

                    <AddToCartButton 
                      item={item}
                      size="sm"
                      className="w-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {error && (
          <div className="mt-8 text-center text-sm text-orange-700 bg-orange-100 rounded-lg py-3">
            {error}
          </div>
        )}

        <motion.div
          className="text-center mt-12"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-6 py-3 rounded-full">
            <span className="text-2xl">🕐</span>
            <span className="font-bold">Available 24/7 - Order Anytime!</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
