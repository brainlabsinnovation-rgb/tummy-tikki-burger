import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@tummytikki.com' },
    update: {},
    create: {
      email: 'admin@tummytikki.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  });

  // Create Menu Items
  const menuItems = [
    {
      id: 'regular-burger',
      name: 'Regular Tummy Tikki Burger',
      description: 'Our signature homemade tikki burger with fresh veggies',
      price: 89,
      category: 'burger',
      isVeg: true,
      isAvailable: true,
      image: '/images/regular-burger.jpg',
    },
    {
      id: 'cheesy-burger',
      name: 'Cheesy Tummy Tikki Burger',
      description: 'Loaded with cheese for cheese lovers',
      price: 109,
      category: 'burger',
      isVeg: true,
      isAvailable: true,
      image: '/images/cheesy-burger.jpg',
    },
    {
      id: 'paneer-burger',
      name: 'Paneer with Cheese Fully Loaded Burger',
      description: 'Premium paneer patty with extra cheese',
      price: 143,
      category: 'burger',
      isVeg: true,
      isAvailable: true,
      image: '/images/paneer-burger.jpg',
    },
    {
      id: 'grilled-sandwich',
      name: 'Butter Grilled Sandwich',
      description: 'Classic grilled sandwich with butter',
      price: 35,
      category: 'sandwich',
      isVeg: true,
      isAvailable: true,
      image: '/images/grilled-sandwich.jpg',
    },
    {
      id: 'jumbo-sandwich',
      name: 'Jumbo Wheat Bread Sandwich',
      description: 'Healthy option with fresh veggies and melted cheese',
      price: 120,
      category: 'sandwich',
      isVeg: true,
      isAvailable: true,
      image: '/images/jumbo-sandwich.jpg',
    },
    {
      id: 'corn-garlic-bread',
      name: 'Sweet Corn Garlic Bread',
      description: 'Garlic bread topped with sweet corn',
      price: 150,
      category: 'sides',
      isVeg: true,
      isAvailable: true,
      image: '/images/corn-garlic-bread.jpg',
    },
    {
      id: 'paneer-garlic-bread',
      name: 'Paneer Garlic Bread',
      description: 'Spicy paneer topping on garlic bread',
      price: 160,
      category: 'sides',
      isVeg: true,
      isAvailable: true,
      image: '/images/paneer-garlic-bread.jpg',
    },
    {
      id: 'french-fries',
      name: 'French Fries',
      description: 'Crispy golden french fries',
      price: 60,
      category: 'sides',
      isVeg: true,
      isAvailable: true,
      image: '/images/french-fries.jpg',
    },
    {
      id: 'cheese-fries',
      name: 'Cheese Fries',
      description: 'French fries loaded with melted cheese',
      price: 80,
      category: 'sides',
      isVeg: true,
      isAvailable: true,
      image: '/images/cheese-fries.jpg',
    },
    {
      id: 'cold-coffee',
      name: 'Cold Coffee',
      description: 'Refreshing cold coffee',
      price: 70,
      category: 'beverage',
      isVeg: true,
      isAvailable: true,
      image: '/images/cold-coffee.jpg',
    },
    {
      id: 'lime-soda',
      name: 'Fresh Lime Soda',
      description: 'Fresh and tangy lime soda',
      price: 50,
      category: 'beverage',
      isVeg: true,
      isAvailable: true,
      image: '/images/lime-soda.jpg',
    },
    {
      id: 'masala-chaas',
      name: 'Masala Chaas',
      description: 'Traditional spiced buttermilk',
      price: 40,
      category: 'beverage',
      isVeg: true,
      isAvailable: true,
      image: '/images/masala-chaas.jpg',
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
