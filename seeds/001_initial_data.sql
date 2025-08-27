-- SmartCartia Database Seeds
-- Populate the database with initial data for development and demo

-- Insert Categories
INSERT INTO categories (id, name, description, image_url, sort_order) VALUES 
(uuid_generate_v4(), 'Electronics', 'Electronic devices and gadgets', '/electronics-category.png', 1),
(uuid_generate_v4(), 'Clothing', 'Fashion and apparel for all ages', '/clothing-category.png', 2),
(uuid_generate_v4(), 'Home & Garden', 'Home improvement and garden supplies', '/assorted-home-goods.png', 3),
(uuid_generate_v4(), 'Sports & Outdoors', 'Sports equipment and outdoor gear', '/assorted-sports-gear.png', 4),
(uuid_generate_v4(), 'Beauty & Personal Care', 'Cosmetics and personal care products', '/beauty-products-collection.png', 5),
(uuid_generate_v4(), 'Books & Media', 'Books, movies, music and educational materials', '/books-category.png', 6),
(uuid_generate_v4(), 'Toys & Games', 'Toys, games and entertainment for all ages', '/assorted-toys-games.png', 7),
(uuid_generate_v4(), 'Jewelry & Accessories', 'Fine jewelry and fashion accessories', '/assorted-jewelry-display.png', 8);

-- Insert Brands
INSERT INTO brands (id, name, description, is_active) VALUES 
(uuid_generate_v4(), 'TechNova', 'Premium technology and electronics brand', true),
(uuid_generate_v4(), 'StyleCraft', 'Modern fashion and lifestyle brand', true),
(uuid_generate_v4(), 'HomeEssentials', 'Quality home and garden products', true),
(uuid_generate_v4(), 'ActiveLife', 'Sports and outdoor adventure gear', true),
(uuid_generate_v4(), 'PureBeauty', 'Natural beauty and skincare products', true),
(uuid_generate_v4(), 'SmartReads', 'Educational books and media', true),
(uuid_generate_v4(), 'PlayZone', 'Fun toys and entertainment products', true),
(uuid_generate_v4(), 'LuxeAccents', 'Premium jewelry and accessories', true);

-- Create a function to get category and brand IDs for use in product inserts
DO $$
DECLARE
    electronics_id UUID;
    clothing_id UUID;
    home_garden_id UUID;
    sports_id UUID;
    beauty_id UUID;
    books_id UUID;
    toys_id UUID;
    jewelry_id UUID;
    
    technova_id UUID;
    stylecraft_id UUID;
    homeessentials_id UUID;
    activelife_id UUID;
    purebeauty_id UUID;
    smartreads_id UUID;
    playzone_id UUID;
    luxeaccents_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO electronics_id FROM categories WHERE name = 'Electronics';
    SELECT id INTO clothing_id FROM categories WHERE name = 'Clothing';
    SELECT id INTO home_garden_id FROM categories WHERE name = 'Home & Garden';
    SELECT id INTO sports_id FROM categories WHERE name = 'Sports & Outdoors';
    SELECT id INTO beauty_id FROM categories WHERE name = 'Beauty & Personal Care';
    SELECT id INTO books_id FROM categories WHERE name = 'Books & Media';
    SELECT id INTO toys_id FROM categories WHERE name = 'Toys & Games';
    SELECT id INTO jewelry_id FROM categories WHERE name = 'Jewelry & Accessories';
    
    -- Get brand IDs
    SELECT id INTO technova_id FROM brands WHERE name = 'TechNova';
    SELECT id INTO stylecraft_id FROM brands WHERE name = 'StyleCraft';
    SELECT id INTO homeessentials_id FROM brands WHERE name = 'HomeEssentials';
    SELECT id INTO activelife_id FROM brands WHERE name = 'ActiveLife';
    SELECT id INTO purebeauty_id FROM brands WHERE name = 'PureBeauty';
    SELECT id INTO smartreads_id FROM brands WHERE name = 'SmartReads';
    SELECT id INTO playzone_id FROM brands WHERE name = 'PlayZone';
    SELECT id INTO luxeaccents_id FROM brands WHERE name = 'LuxeAccents';

    -- Insert Electronics Products
    INSERT INTO products (id, name, description, short_description, sku, price, compare_price, category_id, brand_id, stock_quantity, is_featured, is_bestseller, is_new) VALUES 
    (uuid_generate_v4(), 'Wireless Bluetooth Headphones Pro', 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality', 'Premium noise-cancelling headphones with 30h battery', 'TN-WH-001', 8999.00, 12999.00, electronics_id, technova_id, 45, true, true, false),
    (uuid_generate_v4(), 'Smart Fitness Watch Series 5', 'Advanced fitness tracking smartwatch with GPS, heart rate monitoring, and 7-day battery life', 'Advanced fitness smartwatch with GPS tracking', 'TN-SW-002', 15999.00, 19999.00, electronics_id, technova_id, 32, true, false, true),
    (uuid_generate_v4(), 'Professional DSLR Camera Kit', 'Complete photography kit with 24MP camera, multiple lenses, and professional accessories', 'Professional 24MP DSLR camera with lens kit', 'TN-CAM-003', 85999.00, 99999.00, electronics_id, technova_id, 8, false, true, false),
    (uuid_generate_v4(), 'Gaming Mechanical Keyboard RGB', 'Mechanical gaming keyboard with customizable RGB lighting and macro keys', 'RGB mechanical gaming keyboard with macros', 'TN-KB-004', 6999.00, 8999.00, electronics_id, technova_id, 67, false, false, true),
    (uuid_generate_v4(), 'Portable Power Bank 20000mAh', 'High-capacity power bank with fast charging and multiple device support', 'Fast-charging 20000mAh portable power bank', 'TN-PB-005', 2999.00, 3999.00, electronics_id, technova_id, 120, true, false, false);

    -- Insert Clothing Products
    INSERT INTO products (id, name, description, short_description, sku, price, compare_price, category_id, brand_id, stock_quantity, is_featured, is_bestseller, is_new) VALUES 
    (uuid_generate_v4(), 'Premium Cotton T-Shirt', 'Ultra-soft organic cotton t-shirt with modern fit and sustainable production', 'Organic cotton t-shirt with modern fit', 'SC-TS-001', 1299.00, 1599.00, clothing_id, stylecraft_id, 89, true, true, false),
    (uuid_generate_v4(), 'Designer Denim Jacket', 'Classic denim jacket with contemporary styling and premium fabric', 'Classic denim jacket with modern styling', 'SC-DJ-002', 4999.00, 6999.00, clothing_id, stylecraft_id, 34, false, false, true),
    (uuid_generate_v4(), 'Business Formal Shirt', 'Professional dress shirt with wrinkle-free fabric and tailored fit', 'Wrinkle-free business shirt with tailored fit', 'SC-BS-003', 2499.00, 2999.00, clothing_id, stylecraft_id, 56, false, true, false),
    (uuid_generate_v4(), 'Casual Summer Dress', 'Lightweight floral dress perfect for casual outings and summer events', 'Lightweight floral summer dress', 'SC-SD-004', 3499.00, 4299.00, clothing_id, stylecraft_id, 43, true, false, true),
    (uuid_generate_v4(), 'Athletic Performance Shorts', 'Moisture-wicking athletic shorts with compression support', 'Moisture-wicking athletic shorts', 'SC-AS-005', 1899.00, 2399.00, clothing_id, stylecraft_id, 78, false, false, false);

    -- Insert Home & Garden Products
    INSERT INTO products (id, name, description, short_description, sku, price, compare_price, category_id, brand_id, stock_quantity, is_featured, is_bestseller, is_new) VALUES 
    (uuid_generate_v4(), 'Ergonomic Office Chair', 'Premium ergonomic office chair with lumbar support and adjustable height', 'Ergonomic office chair with lumbar support', 'HE-OC-001', 12999.00, 15999.00, home_garden_id, homeessentials_id, 23, true, true, false),
    (uuid_generate_v4(), 'Ceramic Dinner Set 24-Piece', 'Elegant ceramic dinner set for 6 people with modern design', 'Elegant 24-piece ceramic dinner set', 'HE-DS-002', 5999.00, 7999.00, home_garden_id, homeessentials_id, 18, false, false, true),
    (uuid_generate_v4(), 'Smart LED Table Lamp', 'WiFi-enabled LED lamp with adjustable brightness and color temperature', 'Smart WiFi LED lamp with brightness control', 'HE-TL-003', 3499.00, 4299.00, home_garden_id, homeessentials_id, 41, true, false, true),
    (uuid_generate_v4(), 'Garden Tool Set Professional', 'Complete 10-piece garden tool set with ergonomic handles', 'Professional 10-piece garden tool set', 'HE-GT-004', 4999.00, 6499.00, home_garden_id, homeessentials_id, 29, false, true, false),
    (uuid_generate_v4(), 'Cozy Throw Blanket Wool', 'Soft wool throw blanket perfect for cozy evenings', 'Soft wool throw blanket for comfort', 'HE-TB-005', 2799.00, 3499.00, home_garden_id, homeessentials_id, 67, false, false, false);

    -- Insert Sports & Outdoors Products
    INSERT INTO products (id, name, description, short_description, sku, price, compare_price, category_id, brand_id, stock_quantity, is_featured, is_bestseller, is_new) VALUES 
    (uuid_generate_v4(), 'Professional Basketball', 'Official size basketball with superior grip and durability', 'Official size basketball with superior grip', 'AL-BB-001', 2499.00, 2999.00, sports_id, activelife_id, 56, true, true, false),
    (uuid_generate_v4(), 'Hiking Backpack 40L', 'Waterproof hiking backpack with multiple compartments and comfort padding', 'Waterproof 40L hiking backpack', 'AL-HB-002', 7999.00, 9999.00, sports_id, activelife_id, 31, false, false, true),
    (uuid_generate_v4(), 'Yoga Mat Premium', 'Non-slip yoga mat with extra cushioning and eco-friendly materials', 'Non-slip premium yoga mat with cushioning', 'AL-YM-003', 1999.00, 2499.00, sports_id, activelife_id, 89, true, false, false),
    (uuid_generate_v4(), 'Camping Tent 4-Person', 'Waterproof 4-person camping tent with easy setup', 'Waterproof 4-person camping tent', 'AL-CT-004', 12999.00, 15999.00, sports_id, activelife_id, 14, false, true, true),
    (uuid_generate_v4(), 'Resistance Bands Set', 'Complete resistance training set with multiple resistance levels', 'Complete resistance bands training set', 'AL-RB-005', 1499.00, 1999.00, sports_id, activelife_id, 95, false, false, false);

    -- Insert Beauty Products
    INSERT INTO products (id, name, description, short_description, sku, price, compare_price, category_id, brand_id, stock_quantity, is_featured, is_bestseller, is_new) VALUES 
    (uuid_generate_v4(), 'Organic Face Moisturizer', 'Natural organic face moisturizer with SPF 30 protection', 'Organic face moisturizer with SPF 30', 'PB-FM-001', 1799.00, 2299.00, beauty_id, purebeauty_id, 73, true, true, false),
    (uuid_generate_v4(), 'Vitamin C Serum', 'Brightening vitamin C serum for radiant and youthful skin', 'Brightening vitamin C serum for radiant skin', 'PB-VS-002', 2999.00, 3799.00, beauty_id, purebeauty_id, 52, false, false, true),
    (uuid_generate_v4(), 'Essential Oils Gift Set', '6-piece essential oils set for aromatherapy and relaxation', '6-piece essential oils aromatherapy set', 'PB-EO-003', 3499.00, 4299.00, beauty_id, purebeauty_id, 38, true, false, true),
    (uuid_generate_v4(), 'Professional Makeup Brush Set', 'Complete 12-piece makeup brush set with premium synthetic bristles', '12-piece professional makeup brush set', 'PB-MB-004', 2499.00, 3199.00, beauty_id, purebeauty_id, 46, false, true, false),
    (uuid_generate_v4(), 'Natural Hair Care Kit', 'Complete hair care kit with shampoo, conditioner, and hair mask', 'Natural hair care kit with 3 products', 'PB-HC-005', 2199.00, 2799.00, beauty_id, purebeauty_id, 64, false, false, false);

    -- Insert Books & Media
    INSERT INTO products (id, name, description, short_description, sku, price, compare_price, category_id, brand_id, stock_quantity, is_featured, is_bestseller, is_new) VALUES 
    (uuid_generate_v4(), 'Business Strategy Masterclass', 'Comprehensive guide to modern business strategy and leadership', 'Modern business strategy and leadership guide', 'SR-BS-001', 1999.00, 2499.00, books_id, smartreads_id, 87, true, true, false),
    (uuid_generate_v4(), 'Digital Marketing Handbook', 'Complete handbook for digital marketing success in 2024', 'Complete digital marketing handbook 2024', 'SR-DM-002', 2299.00, 2799.00, books_id, smartreads_id, 65, false, false, true),
    (uuid_generate_v4(), 'Programming Python Mastery', 'Advanced Python programming guide with practical projects', 'Advanced Python programming with projects', 'SR-PP-003', 2799.00, 3299.00, books_id, smartreads_id, 43, true, false, true),
    (uuid_generate_v4(), 'Mindfulness and Meditation', 'Practical guide to mindfulness and meditation for beginners', 'Mindfulness and meditation guide for beginners', 'SR-MM-004', 1599.00, 1999.00, books_id, smartreads_id, 76, false, true, false),
    (uuid_generate_v4(), 'Creative Photography Course', 'Complete photography course with techniques and inspiration', 'Complete creative photography course', 'SR-PC-005', 3299.00, 3999.00, books_id, smartreads_id, 34, false, false, false);

    -- Insert Toys & Games
    INSERT INTO products (id, name, description, short_description, sku, price, compare_price, category_id, brand_id, stock_quantity, is_featured, is_bestseller, is_new) VALUES 
    (uuid_generate_v4(), 'Educational Building Blocks', 'STEM learning building blocks set for creative construction', 'STEM learning building blocks for creativity', 'PZ-BB-001', 2999.00, 3799.00, toys_id, playzone_id, 58, true, true, false),
    (uuid_generate_v4(), 'Remote Control Drone', 'Easy-to-fly drone with HD camera and beginner-friendly controls', 'HD camera drone with beginner controls', 'PZ-RD-002', 8999.00, 11999.00, toys_id, playzone_id, 22, false, false, true),
    (uuid_generate_v4(), 'Strategy Board Game', 'Award-winning strategy board game for 2-4 players', 'Award-winning strategy game for 2-4 players', 'PZ-BG-003', 3499.00, 4299.00, toys_id, playzone_id, 41, true, false, true),
    (uuid_generate_v4(), 'Art Supplies Deluxe Set', 'Complete art set with paints, brushes, and drawing materials', 'Complete deluxe art supplies set', 'PZ-AS-004', 2799.00, 3499.00, toys_id, playzone_id, 67, false, true, false),
    (uuid_generate_v4(), 'Interactive Learning Tablet', 'Educational tablet for kids with learning apps and parental controls', 'Educational kids tablet with learning apps', 'PZ-LT-005', 12999.00, 15999.00, toys_id, playzone_id, 19, true, false, true);

    -- Insert Jewelry & Accessories
    INSERT INTO products (id, name, description, short_description, sku, price, compare_price, category_id, brand_id, stock_quantity, is_featured, is_bestseller, is_new) VALUES 
    (uuid_generate_v4(), 'Sterling Silver Necklace', 'Elegant sterling silver necklace with contemporary pendant design', 'Elegant sterling silver contemporary necklace', 'LA-SN-001', 8999.00, 11999.00, jewelry_id, luxeaccents_id, 28, true, true, false),
    (uuid_generate_v4(), 'Luxury Watch Collection', 'Premium stainless steel watch with sapphire crystal', 'Premium stainless steel luxury watch', 'LA-LW-002', 25999.00, 32999.00, jewelry_id, luxeaccents_id, 12, false, false, true),
    (uuid_generate_v4(), 'Diamond Stud Earrings', 'Classic diamond stud earrings in 14k white gold setting', 'Classic diamond studs in 14k white gold', 'LA-DE-003', 15999.00, 19999.00, jewelry_id, luxeaccents_id, 18, true, false, true),
    (uuid_generate_v4(), 'Leather Handbag Designer', 'Handcrafted leather handbag with modern design and premium finish', 'Handcrafted designer leather handbag', 'LA-LH-004', 12999.00, 16999.00, jewelry_id, luxeaccents_id, 23, false, true, false),
    (uuid_generate_v4(), 'Fashion Sunglasses Collection', 'Designer sunglasses with UV protection and premium frames', 'Designer sunglasses with UV protection', 'LA-FS-005', 4999.00, 6999.00, jewelry_id, luxeaccents_id, 45, false, false, false);
END $$;