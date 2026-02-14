'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import AddToCartButton from './AddToCartButton'
import { MenuGridSkeleton } from './ui/Skeleton'

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

  // Dynamic category mapping with fallback icons
  const getCategoryTitle = (slug: string) => {
    const icons: Record<string, string> = {
      burger: "🍔",
      sandwich: "🥪",
      sides: "🍟",
      beverage: "🥤",
      dessert: "🍰",
      deals: "🏷️",
      pizza: "🍕"
    };
    const icon = icons[slug.toLowerCase()] || "🍴";
    // Capitalize slug for title
    const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return `${icon} ${title}`;
  };

  const menuCategories = Object.keys(menuData).map(slug => ({
    title: getCategoryTitle(slug),
    key: slug,
    items: menuData[slug] || []
  }));
  if (loading) {
    return (
      <section id="menu" className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 opacity-50">
              Loading our <span className="text-orange-500">Delicious</span> Menu...
            </h2>
          </div>
          <MenuGridSkeleton />
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
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: (categoryIndex * 0.1) + (itemIndex * 0.1) }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${!item.isAvailable ? 'grayscale opacity-60' : ''}`}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-gray-400 ${!item.isAvailable ? 'grayscale opacity-60' : ''}`}>
                          <span className="text-4xl">🍔</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {!item.isAvailable && (
                          <Badge className="bg-red-600/90 backdrop-blur-sm text-white border-transparent animate-pulse">
                            Sold Out
                          </Badge>
                        )}
                        {item.id === 'regular-burger' && item.isAvailable && (
                          <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-transparent">
                            Popular
                          </Badge>
                        )}
                        {item.id === 'paneer-burger' && item.isAvailable && (
                          <Badge className="bg-purple-500/90 backdrop-blur-sm text-white border-transparent">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                        <div className={`w-3 h-3 rounded-full border ${item.isVeg
                          ? 'bg-green-600 border-green-700'
                          : 'bg-red-600 border-red-700'
                          }`}></div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                          {item.name}
                        </h4>
                      </div>

                      <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-2 h-10">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-gray-900">
                          ₹{item.price}
                        </span>
                        <AddToCartButton
                          item={item}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>))}
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
