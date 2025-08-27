-- Add product images for the seeded products
-- This script adds primary and additional images for products

DO $$
DECLARE
    product_record RECORD;
BEGIN
    -- Add images for Electronics products
    FOR product_record IN 
        SELECT p.id, p.sku FROM products p 
        JOIN brands b ON p.brand_id = b.id 
        WHERE b.name = 'TechNova'
    LOOP
        CASE product_record.sku
            WHEN 'TN-WH-001' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/diverse-people-listening-headphones.png', 'Wireless Bluetooth Headphones Pro', 0, true),
                (product_record.id, '/electronics-components.png', 'Headphones Components', 1, false);
            
            WHEN 'TN-SW-002' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/smart-watch.png', 'Smart Fitness Watch Series 5', 0, true);
            
            WHEN 'TN-CAM-003' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/dslr-camera.png', 'Professional DSLR Camera Kit', 0, true);
            
            WHEN 'TN-KB-004' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/gaming-keyboard.png', 'Gaming Mechanical Keyboard RGB', 0, true);
            
            WHEN 'TN-PB-005' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/power-bank.png', 'Portable Power Bank 20000mAh', 0, true);
        END CASE;
    END LOOP;

    -- Add images for Clothing products
    FOR product_record IN 
        SELECT p.id, p.sku FROM products p 
        JOIN brands b ON p.brand_id = b.id 
        WHERE b.name = 'StyleCraft'
    LOOP
        CASE product_record.sku
            WHEN 'SC-TS-001' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/cotton-tshirt.png', 'Premium Cotton T-Shirt', 0, true),
                (product_record.id, '/diverse-clothing-rack.png', 'Clothing Collection', 1, false);
            
            WHEN 'SC-DJ-002' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/denim-jacket.png', 'Designer Denim Jacket', 0, true);
            
            WHEN 'SC-BS-003' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/classic-dress-shirt.png', 'Business Formal Shirt', 0, true);
            
            WHEN 'SC-SD-004' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/summer-dress.png', 'Casual Summer Dress', 0, true);
            
            WHEN 'SC-AS-005' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/athletic-shorts.png', 'Athletic Performance Shorts', 0, true);
        END CASE;
    END LOOP;

    -- Add images for Home & Garden products
    FOR product_record IN 
        SELECT p.id, p.sku FROM products p 
        JOIN brands b ON p.brand_id = b.id 
        WHERE b.name = 'HomeEssentials'
    LOOP
        CASE product_record.sku
            WHEN 'HE-OC-001' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/ergonomic-office-chair.png', 'Ergonomic Office Chair', 0, true),
                (product_record.id, '/comfortable-armchair.png', 'Office Furniture', 1, false);
            
            WHEN 'HE-DS-002' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/ceramic-dinner-set.png', 'Ceramic Dinner Set 24-Piece', 0, true);
            
            WHEN 'HE-TL-003' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/smart-led-lamp.png', 'Smart LED Table Lamp', 0, true);
            
            WHEN 'HE-GT-004' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/garden-tools.png', 'Garden Tool Set Professional', 0, true);
            
            WHEN 'HE-TB-005' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/cozy-throw-blanket.png', 'Cozy Throw Blanket Wool', 0, true);
        END CASE;
    END LOOP;

    -- Add images for Sports & Outdoors products
    FOR product_record IN 
        SELECT p.id, p.sku FROM products p 
        JOIN brands b ON p.brand_id = b.id 
        WHERE b.name = 'ActiveLife'
    LOOP
        CASE product_record.sku
            WHEN 'AL-BB-001' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/basketball.png', 'Professional Basketball', 0, true);
            
            WHEN 'AL-HB-002' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/hiking-backpack.png', 'Hiking Backpack 40L', 0, true);
            
            WHEN 'AL-YM-003' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/yoga-mat.png', 'Yoga Mat Premium', 0, true);
            
            WHEN 'AL-CT-004' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/camping-tent.png', 'Camping Tent 4-Person', 0, true);
            
            WHEN 'AL-RB-005' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/resistance-bands.png', 'Resistance Bands Set', 0, true);
        END CASE;
    END LOOP;

    -- Add images for Beauty products
    FOR product_record IN 
        SELECT p.id, p.sku FROM products p 
        JOIN brands b ON p.brand_id = b.id 
        WHERE b.name = 'PureBeauty'
    LOOP
        CASE product_record.sku
            WHEN 'PB-FM-001' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/face-moisturizer.png', 'Organic Face Moisturizer', 0, true),
                (product_record.id, '/beauty-products-collection.png', 'Beauty Collection', 1, false);
            
            WHEN 'PB-VS-002' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/vitamin-c-serum.png', 'Vitamin C Serum', 0, true);
            
            WHEN 'PB-EO-003' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/essential-oils.png', 'Essential Oils Gift Set', 0, true);
            
            WHEN 'PB-MB-004' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/makeup-brushes.png', 'Professional Makeup Brush Set', 0, true);
            
            WHEN 'PB-HC-005' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/hair-care-kit.png', 'Natural Hair Care Kit', 0, true);
        END CASE;
    END LOOP;

    -- Add images for Books & Media products
    FOR product_record IN 
        SELECT p.id, p.sku FROM products p 
        JOIN brands b ON p.brand_id = b.id 
        WHERE b.name = 'SmartReads'
    LOOP
        CASE product_record.sku
            WHEN 'SR-BS-001' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/business-book.png', 'Business Strategy Masterclass', 0, true);
            
            WHEN 'SR-DM-002' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/digital-marketing-book.png', 'Digital Marketing Handbook', 0, true);
            
            WHEN 'SR-PP-003' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/programming-book.png', 'Programming Python Mastery', 0, true);
            
            WHEN 'SR-MM-004' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/mindfulness-book.png', 'Mindfulness and Meditation', 0, true);
            
            WHEN 'SR-PC-005' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/photography-book.png', 'Creative Photography Course', 0, true);
        END CASE;
    END LOOP;

    -- Add images for Toys & Games products
    FOR product_record IN 
        SELECT p.id, p.sku FROM products p 
        JOIN brands b ON p.brand_id = b.id 
        WHERE b.name = 'PlayZone'
    LOOP
        CASE product_record.sku
            WHEN 'PZ-BB-001' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/building-blocks.png', 'Educational Building Blocks', 0, true);
            
            WHEN 'PZ-RD-002' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/drone.png', 'Remote Control Drone', 0, true);
            
            WHEN 'PZ-BG-003' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/board-game.png', 'Strategy Board Game', 0, true);
            
            WHEN 'PZ-AS-004' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/art-supplies.png', 'Art Supplies Deluxe Set', 0, true);
            
            WHEN 'PZ-LT-005' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/learning-tablet.png', 'Interactive Learning Tablet', 0, true);
        END CASE;
    END LOOP;

    -- Add images for Jewelry & Accessories products
    FOR product_record IN 
        SELECT p.id, p.sku FROM products p 
        JOIN brands b ON p.brand_id = b.id 
        WHERE b.name = 'LuxeAccents'
    LOOP
        CASE product_record.sku
            WHEN 'LA-SN-001' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/silver-necklace.png', 'Sterling Silver Necklace', 0, true);
            
            WHEN 'LA-LW-002' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/luxury-watch.png', 'Luxury Watch Collection', 0, true);
            
            WHEN 'LA-DE-003' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/diamond-earrings.png', 'Diamond Stud Earrings', 0, true);
            
            WHEN 'LA-LH-004' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/leather-handbag.png', 'Leather Handbag Designer', 0, true);
            
            WHEN 'LA-FS-005' THEN
                INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
                (product_record.id, '/sunglasses.png', 'Fashion Sunglasses Collection', 0, true);
        END CASE;
    END LOOP;

    RAISE NOTICE 'Product images added successfully';
END $$;