-- Insert Admin User
INSERT INTO "Admin" ("id", "email", "password", "name", "createdAt") 
VALUES 
('admin-1', 'admin@tummytikki.com', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'Admin User', NOW())
ON CONFLICT ("email") DO NOTHING;

-- Insert Menu Items
INSERT INTO "MenuItem" ("id", "name", "description", "price", "category", "isVeg", "isAvailable", "image", "createdAt", "updatedAt") VALUES
('regular-burger', 'Regular Tummy Tikki Burger', 'Our signature homemade tikki burger with fresh veggies', 89, 'burger', true, true, '/images/regular-burger.jpg', NOW(), NOW()),
('cheesy-burger', 'Cheesy Tummy Tikki Burger', 'Loaded with cheese for cheese lovers', 109, 'burger', true, true, '/images/cheesy-burger.jpg', NOW(), NOW()),
('paneer-burger', 'Paneer with Cheese Fully Loaded Burger', 'Premium paneer patty with extra cheese', 143, 'burger', true, true, '/images/paneer-burger.jpg', NOW(), NOW()),
('grilled-sandwich', 'Butter Grilled Sandwich', 'Classic grilled sandwich with butter', 35, 'sandwich', true, true, '/images/grilled-sandwich.jpg', NOW(), NOW()),
('jumbo-sandwich', 'Jumbo Wheat Bread Sandwich', 'Healthy option with fresh veggies and melted cheese', 120, 'sandwich', true, true, '/images/jumbo-sandwich.jpg', NOW(), NOW()),
('corn-garlic-bread', 'Sweet Corn Garlic Bread', 'Garlic bread topped with sweet corn', 150, 'sides', true, true, '/images/corn-garlic-bread.jpg', NOW(), NOW()),
('paneer-garlic-bread', 'Paneer Garlic Bread', 'Spicy paneer topping on garlic bread', 160, 'sides', true, true, '/images/paneer-garlic-bread.jpg', NOW(), NOW()),
('french-fries', 'French Fries', 'Crispy golden french fries', 60, 'sides', true, true, '/images/french-fries.jpg', NOW(), NOW()),
('cheese-fries', 'Cheese Fries', 'French fries loaded with melted cheese', 80, 'sides', true, true, '/images/cheese-fries.jpg', NOW(), NOW()),
('cold-coffee', 'Cold Coffee', 'Refreshing cold coffee', 70, 'beverage', true, true, '/images/cold-coffee.jpg', NOW(), NOW()),
('lime-soda', 'Fresh Lime Soda', 'Fresh and tangy lime soda', 50, 'beverage', true, true, '/images/lime-soda.jpg', NOW(), NOW()),
('masala-chaas', 'Masala Chaas', 'Traditional spiced buttermilk', 40, 'beverage', true, true, '/images/masala-chaas.jpg', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;
