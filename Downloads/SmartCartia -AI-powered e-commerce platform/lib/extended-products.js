// Extended product data with 200 products across categories
const categories = [
  "Electronics",
  "Clothing",
  "Home Goods",
  "Books",
  "Beauty",
  "Sports",
  "Toys",
  "Jewelry",
  "Automotive",
  "Garden",
  "Mobile Devices",
  "Mobile Accessories",
]

const brands = {
  Electronics: [
    "Samsung",
    "Apple",
    "Sony",
    "LG",
    "Bose",
    "Dell",
    "HP",
    "Lenovo",
    "Asus",
    "JBL",
    "Philips",
    "Xiaomi",
    "OnePlus",
    "Panasonic",
    "Canon",
    "Nikon",
    "GoPro",
    "Logitech",
    "Microsoft",
    "Huawei",
  ],
  Clothing: [
    "Nike",
    "Adidas",
    "Puma",
    "Levi's",
    "H&M",
    "Zara",
    "Gap",
    "Calvin Klein",
    "Tommy Hilfiger",
    "Ralph Lauren",
    "Gucci",
    "Versace",
    "Armani",
    "Uniqlo",
    "Under Armour",
    "New Balance",
    "Reebok",
    "Converse",
    "Vans",
    "Lacoste",
  ],
  "Home Goods": [
    "IKEA",
    "Crate & Barrel",
    "Bed Bath & Beyond",
    "Williams-Sonoma",
    "Pottery Barn",
    "West Elm",
    "Wayfair",
    "Ashley Furniture",
    "La-Z-Boy",
    "Restoration Hardware",
    "Pier 1",
    "HomeGoods",
    "Target Home",
    "Anthropologie",
    "Ethan Allen",
    "Haverty's",
    "Rooms To Go",
    "Crate & Barrel",
    "CB2",
    "Arhaus",
  ],
  Books: [
    "Penguin Random House",
    "HarperCollins",
    "Simon & Schuster",
    "Hachette",
    "Macmillan",
    "Scholastic",
    "Wiley",
    "Oxford University Press",
    "Cambridge University Press",
    "Pearson",
    "McGraw Hill",
    "Bloomsbury",
    "Vintage",
    "Knopf",
    "Bantam",
    "Del Rey",
    "Tor Books",
    "Orbit",
    "Hay House",
    "Chronicle Books",
  ],
  Beauty: [
    "L'Oréal",
    "Estée Lauder",
    "Maybelline",
    "MAC",
    "Clinique",
    "Neutrogena",
    "Olay",
    "Dove",
    "Nivea",
    "Revlon",
    "CoverGirl",
    "Garnier",
    "Lancôme",
    "Shiseido",
    "Avon",
    "Chanel",
    "Dior",
    "Guerlain",
    "Yves Saint Laurent",
    "Bobbi Brown",
  ],
  Sports: [
    "Nike",
    "Adidas",
    "Under Armour",
    "Puma",
    "Reebok",
    "Wilson",
    "Spalding",
    "Callaway",
    "TaylorMade",
    "Titleist",
    "Speedo",
    "The North Face",
    "Columbia",
    "Patagonia",
    "Yeti",
    "Coleman",
    "Salomon",
    "Rossignol",
    "Burton",
    "Oakley",
  ],
  Toys: [
    "LEGO",
    "Mattel",
    "Hasbro",
    "Fisher-Price",
    "Nerf",
    "Barbie",
    "Hot Wheels",
    "Playmobil",
    "Melissa & Doug",
    "Nintendo",
    "PlayStation",
    "Xbox",
    "Ravensburger",
    "Crayola",
    "Play-Doh",
    "Funko",
    "Bandai",
    "Spin Master",
    "MGA Entertainment",
    "VTech",
  ],
  Jewelry: [
    "Tiffany & Co.",
    "Cartier",
    "Pandora",
    "Swarovski",
    "David Yurman",
    "Bulgari",
    "Harry Winston",
    "Chopard",
    "Van Cleef & Arpels",
    "Mikimoto",
    "Buccellati",
    "Graff",
    "Piaget",
    "Bvlgari",
    "Chaumet",
    "Pomellato",
    "Boucheron",
    "Messika",
    "Damiani",
    "Pasquale Bruni",
  ],
  Automotive: [
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Volkswagen",
    "Nissan",
    "Hyundai",
    "Kia",
    "Subaru",
    "Mazda",
    "Lexus",
    "Jeep",
    "Tesla",
    "Volvo",
    "Porsche",
    "Land Rover",
    "Jaguar",
  ],
  Garden: [
    "Scotts",
    "Miracle-Gro",
    "Black & Decker",
    "Craftsman",
    "Husqvarna",
    "John Deere",
    "Fiskars",
    "Gardena",
    "Troy-Bilt",
    "Stihl",
    "Toro",
    "Weber",
    "Char-Broil",
    "Keter",
    "Suncast",
    "Rubbermaid",
    "Lifetime",
    "Gorilla Carts",
    "Worx",
    "Greenworks",
  ],
  "Mobile Devices": [
    "Apple",
    "Samsung",
    "Google",
    "Xiaomi",
    "OnePlus",
    "Huawei",
    "Oppo",
    "Vivo",
    "Motorola",
    "Nokia",
    "Sony",
    "LG",
    "Asus",
    "Lenovo",
    "Realme",
    "Microsoft",
    "Amazon",
    "BlackBerry",
    "HTC",
    "ZTE",
  ],
  "Mobile Accessories": [
    "Anker",
    "Belkin",
    "Spigen",
    "OtterBox",
    "Mophie",
    "PopSockets",
    "JBL",
    "Logitech",
    "Jabra",
    "Sony",
    "Samsung",
    "Apple",
    "Zagg",
    "UAG",
    "Moment",
    "Razer",
    "Sennheiser",
    "Bose",
    "DJI",
    "Zhiyun",
  ],
}

// Generate product descriptions
function generateDescription(category, name, brand) {
  const descriptions = {
    Electronics: [
      `Experience cutting-edge technology with this premium ${name} from ${brand}. Featuring state-of-the-art components and sleek design, it delivers exceptional performance for all your digital needs.`,
      `Elevate your tech experience with the ${brand} ${name}. Engineered for reliability and performance, it combines innovative features with user-friendly design.`,
      `The ${brand} ${name} represents the perfect balance of form and function. With its advanced technology and elegant design, it's an essential addition to your digital lifestyle.`,
      `Discover unparalleled quality with the ${name} by ${brand}. Built with precision engineering and premium materials, it offers superior performance and durability.`,
      `Transform your digital experience with the innovative ${brand} ${name}. Packed with cutting-edge features and designed for intuitive use, it sets a new standard in electronic excellence.`,
    ],
    Clothing: [
      `Elevate your wardrobe with this stylish ${name} from ${brand}. Crafted from premium materials, it offers both comfort and durability while keeping you on-trend.`,
      `The ${brand} ${name} combines contemporary design with exceptional comfort. Perfect for everyday wear, it features quality craftsmanship and attention to detail.`,
      `Make a statement with this fashionable ${name} by ${brand}. Designed with both style and functionality in mind, it's versatile enough for any occasion.`,
      `Experience the perfect blend of comfort and style with the ${brand} ${name}. Made from high-quality fabrics, it ensures lasting wear and timeless appeal.`,
      `The ${name} from ${brand} represents the pinnacle of fashion-forward design. With its premium construction and flattering fit, it's sure to become a wardrobe favorite.`,
    ],
    "Home Goods": [
      `Transform your living space with this elegant ${name} from ${brand}. Combining functionality with sophisticated design, it's the perfect addition to any home.`,
      `The ${brand} ${name} brings both style and practicality to your home. Crafted with attention to detail, it enhances your living environment while serving everyday needs.`,
      `Create a welcoming atmosphere with the beautifully designed ${name} by ${brand}. Its quality construction ensures durability, while its aesthetic appeal elevates your home décor.`,
      `The ${brand} ${name} seamlessly blends form and function. With its thoughtful design and quality materials, it adds both convenience and style to your living space.`,
      `Enhance your home with the sophisticated ${name} from ${brand}. Designed with both aesthetics and utility in mind, it's an investment in everyday luxury.`,
    ],
    Books: [
      `Immerse yourself in the captivating world of this ${name} from ${brand}. With its engaging narrative and thought-provoking themes, it promises hours of literary enjoyment.`,
      `The ${brand} ${name} offers a compelling reading experience that will stay with you long after the final page. Expertly crafted with rich characters and immersive storytelling.`,
      `Discover new perspectives with this insightful ${name} by ${brand}. Whether you're a casual reader or literary enthusiast, its engaging content offers something for everyone.`,
      `The ${name} from ${brand} represents storytelling at its finest. With its well-developed plot and memorable characters, it's a worthy addition to any book collection.`,
      `Expand your literary horizons with the thought-provoking ${brand} ${name}. Its masterful prose and engaging narrative make for an unforgettable reading experience.`,
    ],
    Beauty: [
      `Enhance your natural beauty with this premium ${name} from ${brand}. Formulated with high-quality ingredients, it delivers exceptional results for your skincare or makeup routine.`,
      `The ${brand} ${name} is designed to elevate your beauty regimen. With its innovative formula and luxurious application, it helps you achieve your desired look with ease.`,
      `Transform your beauty routine with the effective ${name} by ${brand}. Created with cutting-edge technology and quality ingredients, it delivers visible results you'll love.`,
      `Experience the difference with the ${brand} ${name}. Its carefully crafted formula provides both immediate benefits and long-term results for your skin or hair.`,
      `The ${name} from ${brand} combines science and luxury for optimal beauty results. Whether for daily use or special occasions, it helps you look and feel your best.`,
    ],
    Sports: [
      `Elevate your athletic performance with this professional-grade ${name} from ${brand}. Engineered for optimal performance, it helps you achieve your fitness goals with confidence.`,
      `The ${brand} ${name} is designed for serious sports enthusiasts. With its durable construction and performance-enhancing features, it's an essential addition to your athletic gear.`,
      `Take your training to the next level with the high-performance ${name} by ${brand}. Built to withstand intense use while providing the functionality you need for peak performance.`,
      `The ${brand} ${name} combines innovative design with durability for superior athletic performance. Whether you're a beginner or professional, it enhances your sporting experience.`,
      `Maximize your potential with the expertly crafted ${name} from ${brand}. Its quality construction and thoughtful design make it the perfect companion for your athletic pursuits.`,
    ],
    Toys: [
      `Inspire hours of imaginative play with this engaging ${name} from ${brand}. Designed for both fun and developmental benefits, it's a toy children will treasure.`,
      `The ${brand} ${name} combines entertainment with educational value. Its thoughtful design encourages creativity, problem-solving, and motor skill development.`,
      `Watch imagination come to life with the interactive ${name} by ${brand}. Created with child development in mind, it provides both entertainment and learning opportunities.`,
      `The ${brand} ${name} delivers endless fun while supporting key developmental milestones. Its durable construction ensures it will be enjoyed for years to come.`,
      `Encourage creative play with the innovative ${name} from ${brand}. Designed to engage young minds, it offers a perfect balance of entertainment and educational value.`,
    ],
    Jewelry: [
      `Make a lasting impression with this exquisite ${name} from ${brand}. Crafted with precision and attention to detail, it adds elegance to any outfit or occasion.`,
      `The ${brand} ${name} embodies timeless sophistication. With its premium materials and expert craftsmanship, it's a piece you'll cherish for years to come.`,
      `Elevate your style with the stunning ${name} by ${brand}. Its elegant design and quality construction make it perfect for both everyday wear and special occasions.`,
      `The ${brand} ${name} combines classic elegance with contemporary design. Meticulously crafted from fine materials, it's a statement piece that stands the test of time.`,
      `Add a touch of luxury to your collection with the beautiful ${name} from ${brand}. Its sophisticated design and exceptional quality make it a truly special piece.`,
    ],
    Automotive: [
      `Enhance your vehicle's performance with this premium ${name} from ${brand}. Engineered for reliability and efficiency, it's an essential upgrade for any car enthusiast.`,
      `The ${brand} ${name} represents the gold standard in automotive accessories. Its precision engineering ensures optimal performance and longevity for your vehicle.`,
      `Improve your driving experience with the high-quality ${name} by ${brand}. Designed specifically for automotive excellence, it delivers both functionality and value.`,
      `The ${brand} ${name} combines innovative technology with durability for superior automotive performance. Whether for maintenance or upgrade, it's a wise investment for your vehicle.`,
      `Maximize your vehicle's potential with the expertly crafted ${name} from ${brand}. Its quality construction and thoughtful design make it an essential addition to your automotive toolkit.`,
    ],
    Garden: [
      `Transform your outdoor space with this durable ${name} from ${brand}. Designed for both functionality and aesthetic appeal, it's an essential tool for any gardening enthusiast.`,
      `The ${brand} ${name} makes gardening more efficient and enjoyable. Its ergonomic design and quality construction ensure years of reliable performance in your garden.`,
      `Enhance your gardening experience with the innovative ${name} by ${brand}. Created with the needs of gardeners in mind, it combines practicality with lasting durability.`,
      `The ${brand} ${name} is a must-have for maintaining a beautiful garden. Its thoughtful design and sturdy construction make outdoor tasks simpler and more effective.`,
      `Cultivate your perfect garden with the high-performance ${name} from ${brand}. Whether you're a novice or experienced gardener, its quality and functionality will exceed your expectations.`,
    ],
    "Mobile Devices": [
      `Experience cutting-edge mobile technology with the ${brand} ${name}. Featuring a stunning display, powerful processor, and exceptional camera system, it redefines what a smartphone can do.`,
      `The ${brand} ${name} combines sleek design with unparalleled performance. With its advanced features and intuitive interface, it's the perfect companion for your digital lifestyle.`,
      `Elevate your mobile experience with the innovative ${name} by ${brand}. Packed with next-generation technology and designed for everyday convenience, it sets a new standard in mobile devices.`,
      `The ${brand} ${name} delivers premium performance in a beautifully crafted package. Its cutting-edge features and all-day battery life make it ideal for both work and entertainment.`,
      `Transform how you connect with the world using the ${name} from ${brand}. With its state-of-the-art technology and thoughtful design, it offers an unmatched mobile experience.`,
    ],
    "Mobile Accessories": [
      `Enhance your mobile device with this premium ${name} from ${brand}. Designed specifically to complement your smartphone or tablet, it adds both functionality and style.`,
      `The ${brand} ${name} is the perfect companion for your mobile device. Engineered for perfect compatibility and exceptional performance, it elevates your mobile experience.`,
      `Maximize the potential of your smartphone or tablet with the innovative ${name} by ${brand}. Its thoughtful design and quality construction make it an essential mobile accessory.`,
      `The ${brand} ${name} seamlessly integrates with your mobile lifestyle. Crafted with attention to detail and built to last, it's the accessory you didn't know you needed.`,
      `Add versatility to your mobile device with the expertly designed ${name} from ${brand}. Whether for protection, convenience, or enhanced functionality, it's a worthwhile investment.`,
    ],
  }

  const categoryDescriptions = descriptions[category] || descriptions["Electronics"]
  return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)]
}

// Generate product names based on category
function generateProductName(category, brand) {
  const prefixes = {
    Electronics: [
      "Ultra",
      "Pro",
      "Smart",
      "Elite",
      "Premium",
      "Digital",
      "Wireless",
      "Advanced",
      "Quantum",
      "Precision",
    ],
    Clothing: [
      "Classic",
      "Modern",
      "Comfort",
      "Signature",
      "Essential",
      "Deluxe",
      "Luxury",
      "Urban",
      "Casual",
      "Premium",
    ],
    "Home Goods": [
      "Elegant",
      "Luxury",
      "Comfort",
      "Modern",
      "Classic",
      "Premium",
      "Designer",
      "Signature",
      "Deluxe",
      "Essential",
    ],
    Books: ["The", "A", "Complete", "Essential", "Ultimate", "Comprehensive", "Definitive", "Modern", "Classic", "New"],
    Beauty: [
      "Radiant",
      "Luxe",
      "Pure",
      "Natural",
      "Advanced",
      "Essential",
      "Premium",
      "Ultra",
      "Revitalizing",
      "Nourishing",
    ],
    Sports: [
      "Pro",
      "Elite",
      "Performance",
      "Ultra",
      "Advanced",
      "Precision",
      "Endurance",
      "Power",
      "Dynamic",
      "Extreme",
    ],
    Toys: ["Fun", "Adventure", "Magic", "Super", "Wonder", "Creative", "Interactive", "Ultimate", "Mega", "Deluxe"],
    Jewelry: [
      "Elegant",
      "Timeless",
      "Luxury",
      "Classic",
      "Signature",
      "Precious",
      "Exquisite",
      "Radiant",
      "Brilliant",
      "Eternal",
    ],
    Automotive: [
      "Performance",
      "Turbo",
      "Premium",
      "Ultra",
      "Advanced",
      "Pro",
      "Elite",
      "Precision",
      "Power",
      "Dynamic",
    ],
    Garden: [
      "Premium",
      "Professional",
      "Deluxe",
      "Essential",
      "Advanced",
      "Classic",
      "Ultra",
      "Precision",
      "Durable",
      "Ergonomic",
    ],
    "Mobile Devices": ["Ultra", "Pro", "Max", "Plus", "Premium", "Elite", "Smart", "Advanced", "Next-Gen", "Flagship"],
    "Mobile Accessories": [
      "Pro",
      "Ultra",
      "Premium",
      "Essential",
      "Advanced",
      "Smart",
      "Deluxe",
      "Elite",
      "Precision",
      "Ergonomic",
    ],
  }

  const productTypes = {
    Electronics: [
      "Smartphone",
      "Laptop",
      "Headphones",
      "Tablet",
      "Smart Watch",
      "Bluetooth Speaker",
      "Camera",
      "TV",
      "Gaming Console",
      "Wireless Earbuds",
      "Power Bank",
      "Monitor",
      "Keyboard",
      "Mouse",
      "Router",
      "External Hard Drive",
      "Fitness Tracker",
      "Drone",
      "VR Headset",
      "Smart Home Hub",
    ],
    Clothing: [
      "T-Shirt",
      "Jeans",
      "Dress",
      "Jacket",
      "Sweater",
      "Hoodie",
      "Shorts",
      "Skirt",
      "Coat",
      "Blouse",
      "Pants",
      "Shirt",
      "Blazer",
      "Sweatpants",
      "Cardigan",
      "Polo Shirt",
      "Tank Top",
      "Leggings",
      "Suit",
      "Vest",
    ],
    "Home Goods": [
      "Sofa",
      "Dining Table",
      "Bed Frame",
      "Coffee Table",
      "Armchair",
      "Bookshelf",
      "Desk",
      "Nightstand",
      "Dresser",
      "Ottoman",
      "Lamp",
      "Rug",
      "Mirror",
      "Cushion",
      "Throw Blanket",
      "Vase",
      "Picture Frame",
      "Wall Clock",
      "Candle Holder",
      "Plant Stand",
    ],
    Books: [
      "Novel",
      "Cookbook",
      "Biography",
      "Self-Help Guide",
      "History Book",
      "Science Fiction",
      "Mystery",
      "Romance",
      "Thriller",
      "Fantasy",
      "Poetry Collection",
      "Art Book",
      "Travel Guide",
      "Children's Book",
      "Graphic Novel",
      "Reference Book",
      "Memoir",
      "Philosophy Text",
      "Business Guide",
      "Psychology Book",
    ],
    Beauty: [
      "Moisturizer",
      "Serum",
      "Foundation",
      "Lipstick",
      "Mascara",
      "Eyeshadow Palette",
      "Face Mask",
      "Cleanser",
      "Toner",
      "Blush",
      "Highlighter",
      "Perfume",
      "Shampoo",
      "Conditioner",
      "Hair Mask",
      "Body Lotion",
      "Sunscreen",
      "Nail Polish",
      "Eyeliner",
      "Concealer",
    ],
    Sports: [
      "Running Shoes",
      "Yoga Mat",
      "Dumbbells",
      "Tennis Racket",
      "Basketball",
      "Soccer Ball",
      "Golf Clubs",
      "Bicycle",
      "Treadmill",
      "Resistance Bands",
      "Swimming Goggles",
      "Hiking Backpack",
      "Fitness Tracker",
      "Water Bottle",
      "Gym Bag",
      "Jump Rope",
      "Workout Gloves",
      "Skateboard",
      "Snowboard",
      "Camping Tent",
    ],
    Toys: [
      "Building Blocks",
      "Action Figure",
      "Doll",
      "Board Game",
      "Puzzle",
      "Remote Control Car",
      "Stuffed Animal",
      "Educational Toy",
      "Art Set",
      "Science Kit",
      "Play Kitchen",
      "Train Set",
      "Musical Instrument",
      "Outdoor Play Equipment",
      "Ride-On Toy",
      "Card Game",
      "Construction Set",
      "Robot",
      "Slime Kit",
      "Dress-Up Costume",
    ],
    Jewelry: [
      "Necklace",
      "Earrings",
      "Bracelet",
      "Ring",
      "Watch",
      "Pendant",
      "Anklet",
      "Brooch",
      "Cufflinks",
      "Tiara",
      "Charm",
      "Bangle",
      "Choker",
      "Locket",
      "Stud Earrings",
      "Hoop Earrings",
      "Tennis Bracelet",
      "Engagement Ring",
      "Wedding Band",
      "Statement Necklace",
    ],
    Automotive: [
      "Car Wax",
      "Tire Inflator",
      "Jump Starter",
      "Dash Cam",
      "Car Vacuum",
      "Floor Mats",
      "Seat Covers",
      "Air Freshener",
      "Phone Mount",
      "Steering Wheel Cover",
      "Car Cover",
      "Windshield Wipers",
      "Tool Kit",
      "Battery Charger",
      "Pressure Washer",
      "Car Shampoo",
      "Microfiber Cloths",
      "Car Organizer",
      "Headlight Restoration Kit",
      "Car Diagnostic Tool",
    ],
    Garden: [
      "Lawn Mower",
      "Garden Hose",
      "Pruning Shears",
      "Plant Pot",
      "Watering Can",
      "Garden Gloves",
      "Trowel",
      "Rake",
      "Shovel",
      "Wheelbarrow",
      "Garden Bench",
      "Bird Bath",
      "Garden Gnome",
      "Outdoor Lights",
      "Compost Bin",
      "Weed Killer",
      "Plant Food",
      "Hedge Trimmer",
      "Leaf Blower",
      "Garden Shed",
    ],
    "Mobile Devices": [
      "Smartphone",
      "Tablet",
      "Foldable Phone",
      "E-Reader",
      "Smart Watch",
      "Fitness Tracker",
      "Gaming Phone",
      "Mini Tablet",
      "Phablet",
      "Kids Tablet",
      "Rugged Phone",
      "Business Tablet",
      "Dual-Screen Phone",
      "5G Phone",
      "Budget Smartphone",
      "Premium Smartphone",
      "Convertible Tablet",
      "Cellular Smartwatch",
      "Media Player",
      "Mobile Hotspot",
    ],
    "Mobile Accessories": [
      "Phone Case",
      "Screen Protector",
      "Wireless Charger",
      "Power Bank",
      "Bluetooth Earbuds",
      "Phone Grip",
      "Car Mount",
      "Tablet Stand",
      "Stylus Pen",
      "Camera Lens Kit",
      "Bluetooth Keyboard",
      "Charging Cable",
      "Gimbal Stabilizer",
      "Phone Wallet",
      "Selfie Stick",
      "Armband",
      "Waterproof Case",
      "Bluetooth Speaker",
      "Phone Sanitizer",
      "Phone Cooler",
    ],
  }

  const prefix = prefixes[category][Math.floor(Math.random() * prefixes[category].length)]
  const productType = productTypes[category][Math.floor(Math.random() * productTypes[category].length)]

  // Sometimes include the brand in the name
  const includeBrand = Math.random() > 0.5
  return includeBrand ? `${brand} ${prefix} ${productType}` : `${prefix} ${productType}`
}

// Generate a list of 200 products
function generateProducts(count = 200) {
  const products = []
  let id = 1

  for (let i = 0; i < count; i++) {
    // Distribute products across categories
    const category = categories[i % categories.length]
    const categoryBrands = brands[category]
    const brand = categoryBrands[Math.floor(Math.random() * categoryBrands.length)]
    const name = generateProductName(category, brand)
    const description = generateDescription(category, name, brand)

    // Generate a price based on category
    let basePrice
    switch (category) {
      case "Electronics":
        basePrice = Math.floor(Math.random() * 900) + 100 // 100-999
        break
      case "Clothing":
        basePrice = Math.floor(Math.random() * 80) + 20 // 20-99
        break
      case "Home Goods":
        basePrice = Math.floor(Math.random() * 400) + 50 // 50-449
        break
      case "Books":
        basePrice = Math.floor(Math.random() * 30) + 10 // 10-39
        break
      case "Beauty":
        basePrice = Math.floor(Math.random() * 70) + 15 // 15-84
        break
      case "Sports":
        basePrice = Math.floor(Math.random() * 150) + 30 // 30-179
        break
      case "Toys":
        basePrice = Math.floor(Math.random() * 60) + 15 // 15-74
        break
      case "Jewelry":
        basePrice = Math.floor(Math.random() * 500) + 50 // 50-549
        break
      case "Automotive":
        basePrice = Math.floor(Math.random() * 200) + 20 // 20-219
        break
      case "Garden":
        basePrice = Math.floor(Math.random() * 150) + 25 // 25-174
        break
      case "Mobile Devices":
        basePrice = Math.floor(Math.random() * 800) + 200 // 200-999
        break
      case "Mobile Accessories":
        basePrice = Math.floor(Math.random() * 70) + 10 // 10-79
        break
      default:
        basePrice = Math.floor(Math.random() * 100) + 10 // 10-109
    }

    // Add cents to make price look more realistic
    const price = basePrice + Math.floor(Math.random() * 100) / 100

    // Generate rating between 3.5 and 5.0
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1)

    // Generate number of reviews
    const reviewCount = Math.floor(Math.random() * 500) + 5

    // Determine if product is in stock (90% chance)
    const inStock = Math.random() < 0.9

    // Generate stock quantity if in stock
    const stockQuantity = inStock ? Math.floor(Math.random() * 100) + 1 : 0

    // Determine if product is new (30% chance)
    const isNew = Math.random() < 0.3

    // Determine if product is featured (20% chance)
    const isFeatured = Math.random() < 0.2

    // Determine if product is a best seller (15% chance)
    const isBestSeller = Math.random() < 0.15

    // Generate colors for applicable categories
    const colors = []
    if (
      [
        "Clothing",
        "Electronics",
        "Home Goods",
        "Sports",
        "Automotive",
        "Mobile Devices",
        "Mobile Accessories",
      ].includes(category)
    ) {
      const availableColors = [
        "Black",
        "White",
        "Gray",
        "Silver",
        "Blue",
        "Red",
        "Green",
        "Yellow",
        "Purple",
        "Pink",
        "Brown",
        "Orange",
        "Gold",
        "Navy",
        "Teal",
        "Burgundy",
        "Beige",
        "Charcoal",
        "Turquoise",
        "Olive",
      ]

      // Add 1-5 colors
      const numColors = Math.floor(Math.random() * 5) + 1
      for (let j = 0; j < numColors; j++) {
        const color = availableColors[Math.floor(Math.random() * availableColors.length)]
        if (!colors.includes(color)) {
          colors.push(color)
        }
      }
    }

    // Generate sizes for clothing
    const sizes = []
    if (category === "Clothing") {
      const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]
      // Add 3-6 sizes
      const numSizes = Math.floor(Math.random() * 4) + 3
      for (let j = 0; j < numSizes; j++) {
        const size = availableSizes[j]
        sizes.push(size)
      }
    }

    // Generate specifications for electronics and mobile devices
    const specifications = {}
    if (["Electronics", "Mobile Devices"].includes(category)) {
      if (name.includes("Smartphone") || name.includes("Phone")) {
        specifications.processor = [
          "Snapdragon 8 Gen 2",
          "A16 Bionic",
          "Exynos 2200",
          "Dimensity 9000",
          "Snapdragon 888",
        ][Math.floor(Math.random() * 5)]
        specifications.ram = ["4GB", "6GB", "8GB", "12GB", "16GB"][Math.floor(Math.random() * 5)]
        specifications.storage = ["64GB", "128GB", "256GB", "512GB", "1TB"][Math.floor(Math.random() * 5)]
        specifications.camera = [
          "12MP + 12MP",
          "48MP + 12MP + 12MP",
          "108MP + 12MP + 10MP",
          "50MP + 48MP + 12MP",
          "200MP + 12MP + 10MP",
        ][Math.floor(Math.random() * 5)]
        specifications.battery = ["3000mAh", "4000mAh", "4500mAh", "5000mAh", "6000mAh"][Math.floor(Math.random() * 5)]
        specifications.screen = [
          "6.1 inch OLED",
          "6.4 inch AMOLED",
          "6.7 inch Super AMOLED",
          "6.8 inch Dynamic AMOLED",
          "7.0 inch LTPO AMOLED",
        ][Math.floor(Math.random() * 5)]
      } else if (name.includes("Tablet") || name.includes("iPad")) {
        specifications.processor = [
          "A15 Bionic",
          "Snapdragon 8 Gen 1",
          "MediaTek Helio G99",
          "Snapdragon 870",
          "Intel Core i5",
        ][Math.floor(Math.random() * 5)]
        specifications.ram = ["3GB", "4GB", "6GB", "8GB", "16GB"][Math.floor(Math.random() * 5)]
        specifications.storage = ["32GB", "64GB", "128GB", "256GB", "512GB"][Math.floor(Math.random() * 5)]
        specifications.screen = [
          "8.3 inch LCD",
          "10.2 inch Retina",
          "10.9 inch Liquid Retina",
          "11 inch OLED",
          "12.9 inch Mini-LED",
        ][Math.floor(Math.random() * 5)]
        specifications.battery = ["7000mAh", "8000mAh", "9000mAh", "10000mAh", "11000mAh"][
          Math.floor(Math.random() * 5)
        ]
      } else if (name.includes("Laptop")) {
        specifications.processor = [
          "Intel Core i5",
          "Intel Core i7",
          "Intel Core i9",
          "AMD Ryzen 5",
          "AMD Ryzen 7",
          "AMD Ryzen 9",
          "Apple M1",
          "Apple M2",
        ][Math.floor(Math.random() * 8)]
        specifications.ram = ["8GB", "16GB", "32GB", "64GB"][Math.floor(Math.random() * 4)]
        specifications.storage = ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"][Math.floor(Math.random() * 4)]
        specifications.graphics = [
          "Intel Iris Xe",
          "NVIDIA RTX 3050",
          "NVIDIA RTX 3060",
          "NVIDIA RTX 3070",
          "AMD Radeon RX 6600M",
          "Apple M2 GPU",
        ][Math.floor(Math.random() * 6)]
        specifications.screen = ["13.3 inch IPS", "14 inch LED", "15.6 inch OLED", "16 inch Mini-LED", "17.3 inch IPS"][
          Math.floor(Math.random() * 5)
        ]
      } else if (name.includes("Headphones") || name.includes("Earbuds")) {
        specifications.driver = ["40mm", "45mm", "50mm", "10mm", "11mm", "13.4mm"][Math.floor(Math.random() * 6)]
        specifications.batteryLife = ["5 hours", "8 hours", "20 hours", "30 hours", "40 hours", "60 hours"][
          Math.floor(Math.random() * 6)
        ]
        specifications.connectivity = [
          "Bluetooth 5.0",
          "Bluetooth 5.1",
          "Bluetooth 5.2",
          "Bluetooth 5.3",
          "Wired 3.5mm",
        ][Math.floor(Math.random() * 5)]
        specifications.noiseCancellation = [true, false][Math.floor(Math.random() * 2)]
      }
    }

    // Generate compatibility for mobile accessories
    const compatibility = []
    if (category === "Mobile Accessories") {
      const devices = ["iPhone", "Samsung Galaxy", "Google Pixel", "OnePlus", "Xiaomi", "iPad", "Android Tablets"]
      // Add 1-4 compatible devices
      const numDevices = Math.floor(Math.random() * 4) + 1
      for (let j = 0; j < numDevices; j++) {
        const device = devices[Math.floor(Math.random() * devices.length)]
        if (!compatibility.includes(device)) {
          compatibility.push(device)
        }
      }
    }

    // Generate image URL
    const imageUrl = `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(name)}`

    // Add product to list
    products.push({
      id: id++,
      name,
      brand,
      category,
      description,
      price,
      rating: Number.parseFloat(rating),
      reviewCount,
      inStock,
      stockQuantity,
      isNew,
      isFeatured,
      isBestSeller,
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
      specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
      compatibility: compatibility.length > 0 ? compatibility : undefined,
      imageUrl,
    })
  }

  return products
}

// Generate 20 mobile device products
function generateMobileDeviceProducts() {
  const mobileProducts = [
    {
      id: 101,
      name: "Premium Flagship Smartphone",
      brand: "Samsung",
      category: "Mobile Devices",
      description:
        "Experience the ultimate in mobile technology with our flagship smartphone. Featuring a stunning 6.8-inch Dynamic AMOLED display, powerful Snapdragon 8 Gen 2 processor, and a revolutionary camera system that captures incredible detail in any light.",
      price: 999.99,
      rating: 4.8,
      reviewCount: 356,
      inStock: true,
      stockQuantity: 42,
      isNew: true,
      isFeatured: true,
      isBestSeller: true,
      colors: ["Phantom Black", "Cosmic Silver", "Burgundy"],
      specifications: {
        processor: "Snapdragon 8 Gen 2",
        ram: "12GB",
        storage: "512GB",
        camera: "108MP + 12MP + 10MP",
        battery: "5000mAh",
        screen: "6.8 inch Dynamic AMOLED",
      },
      imageUrl: "/premium-smartphone.png",
    },
    {
      id: 102,
      name: "Budget-Friendly Smartphone",
      brand: "Xiaomi",
      category: "Mobile Devices",
      description:
        "Get exceptional value with this feature-packed budget smartphone. Offering a smooth 90Hz display, capable processor, and all-day battery life, it delivers everything you need without breaking the bank.",
      price: 249.99,
      rating: 4.5,
      reviewCount: 289,
      inStock: true,
      stockQuantity: 78,
      isNew: false,
      isFeatured: true,
      isBestSeller: true,
      colors: ["Blue", "Black", "Green"],
      specifications: {
        processor: "MediaTek Dimensity 700",
        ram: "6GB",
        storage: "128GB",
        camera: "48MP + 8MP + 2MP",
        battery: "5000mAh",
        screen: "6.5 inch LCD 90Hz",
      },
      imageUrl: "/budget-smartphone.png",
    },
    {
      id: 103,
      name: "Pro Tablet with Keyboard Support",
      brand: "Apple",
      category: "Mobile Devices",
      description:
        "Transform your workflow with this powerful tablet. With its stunning display, desktop-class performance, and support for a precision keyboard and stylus, it's the ultimate tool for creativity and productivity on the go.",
      price: 799.99,
      rating: 4.9,
      reviewCount: 178,
      inStock: true,
      stockQuantity: 35,
      isNew: true,
      isFeatured: true,
      isBestSeller: false,
      colors: ["Space Gray", "Silver", "Gold"],
      specifications: {
        processor: "Apple M2",
        ram: "8GB",
        storage: "256GB",
        screen: "11 inch Liquid Retina",
        battery: "10000mAh",
      },
      imageUrl: "/pro-tablet.png",
    },
    {
      id: 104,
      name: "Budget Tablet for Entertainment",
      brand: "Amazon",
      category: "Mobile Devices",
      description:
        "Enjoy your favorite content on this affordable tablet. Perfect for streaming, reading, and casual gaming, it offers a vibrant HD display and long battery life at an unbeatable price.",
      price: 149.99,
      rating: 4.3,
      reviewCount: 412,
      inStock: true,
      stockQuantity: 92,
      isNew: false,
      isFeatured: false,
      isBestSeller: true,
      colors: ["Black", "Blue", "Plum"],
      specifications: {
        processor: "MediaTek MT8183",
        ram: "3GB",
        storage: "32GB",
        screen: "10.1 inch HD",
        battery: "9000mAh",
      },
      imageUrl: "/budget-tablet.png",
    },
    {
      id: 105,
      name: "Foldable Smartphone",
      brand: "Samsung",
      category: "Mobile Devices",
      description:
        "Experience the future of smartphones with this innovative foldable device. Unfold to reveal a tablet-sized screen for immersive viewing, then fold it back to a compact phone that fits easily in your pocket.",
      price: 1499.99,
      rating: 4.6,
      reviewCount: 156,
      inStock: true,
      stockQuantity: 28,
      isNew: true,
      isFeatured: true,
      isBestSeller: false,
      colors: ["Phantom Black", "Cream", "Lavender"],
      specifications: {
        processor: "Snapdragon 8 Gen 2",
        ram: "12GB",
        storage: "512GB",
        camera: "50MP + 12MP + 10MP",
        battery: "4400mAh",
        screen: "7.6 inch Dynamic AMOLED when unfolded",
      },
      imageUrl: "/foldable-smartphone.png",
    },
    {
      id: 106,
      name: "Gaming Smartphone",
      brand: "Asus",
      category: "Mobile Devices",
      description:
        "Dominate your games with this purpose-built gaming smartphone. Featuring a high-refresh display, advanced cooling system, and customizable gaming controls, it delivers desktop-quality gaming in the palm of your hand.",
      price: 899.99,
      rating: 4.7,
      reviewCount: 203,
      inStock: true,
      stockQuantity: 45,
      isNew: true,
      isFeatured: false,
      isBestSeller: false,
      colors: ["Storm Black", "Phantom Blue"],
      specifications: {
        processor: "Snapdragon 8 Gen 2",
        ram: "16GB",
        storage: "512GB",
        camera: "50MP + 13MP + 5MP",
        battery: "6000mAh",
        screen: "6.78 inch AMOLED 165Hz",
      },
      imageUrl: "/gaming-smartphone.png",
    },
    {
      id: 107,
      name: "E-Reader Tablet",
      brand: "Amazon",
      category: "Mobile Devices",
      description:
        "Enjoy your favorite books with this specialized e-reader tablet. Its paper-like display is easy on the eyes even after hours of reading, and the weeks-long battery life means you can take it anywhere without worrying about charging.",
      price: 129.99,
      rating: 4.8,
      reviewCount: 387,
      inStock: true,
      stockQuantity: 64,
      isNew: false,
      isFeatured: false,
      isBestSeller: true,
      colors: ["Black", "White"],
      specifications: {
        processor: "Custom E-ink processor",
        ram: "1GB",
        storage: "8GB",
        screen: "7 inch E-ink display",
        battery: "1500mAh (weeks of battery life)",
      },
      imageUrl: "/e-reader-tablet.png",
    },
    {
      id: 108,
      name: "Kids Tablet with Parental Controls",
      brand: "Amazon",
      category: "Mobile Devices",
      description:
        "The perfect first tablet for children. Built tough to withstand drops and bumps, it comes with a comprehensive suite of parental controls and access to thousands of kid-friendly books, games, and videos.",
      price: 99.99,
      rating: 4.4,
      reviewCount: 298,
      inStock: true,
      stockQuantity: 83,
      isNew: false,
      isFeatured: false,
      isBestSeller: false,
      colors: ["Blue", "Pink", "Purple"],
      specifications: {
        processor: "MediaTek MT8163",
        ram: "2GB",
        storage: "32GB",
        screen: "8 inch HD",
        battery: "6000mAh",
      },
      imageUrl: "/kids-tablet.png",
    },
    {
      id: 109,
      name: "Premium Phone Case",
      brand: "OtterBox",
      category: "Mobile Accessories",
      description:
        "Protect your investment with this premium phone case. Combining military-grade drop protection with a sleek design, it keeps your device safe without adding unnecessary bulk.",
      price: 49.99,
      rating: 4.7,
      reviewCount: 342,
      inStock: true,
      stockQuantity: 76,
      isNew: false,
      isFeatured: true,
      isBestSeller: true,
      colors: ["Black", "Navy Blue", "Red", "Clear"],
      compatibility: ["iPhone 13", "iPhone 14", "iPhone 15"],
      imageUrl: "/premium-phone-case.png",
    },
    {
      id: 110,
      name: "Tablet Keyboard Case",
      brand: "Logitech",
      category: "Mobile Accessories",
      description:
        "Transform your tablet into a productivity powerhouse with this keyboard case. Featuring laptop-quality keys, a built-in trackpad, and adjustable viewing angles, it's perfect for working on the go.",
      price: 119.99,
      rating: 4.6,
      reviewCount: 187,
      inStock: true,
      stockQuantity: 42,
      isNew: true,
      isFeatured: true,
      isBestSeller: false,
      colors: ["Black", "Gray"],
      compatibility: ["iPad Pro 11-inch", "iPad Air"],
      imageUrl: "/tablet-keyboard-case.png",
    },
    {
      id: 111,
      name: "Wireless Charging Pad",
      brand: "Anker",
      category: "Mobile Accessories",
      description:
        "Simplify your charging routine with this sleek wireless charging pad. Just place your compatible device on top and enjoy fast, efficient charging without the hassle of cables.",
      price: 29.99,
      rating: 4.5,
      reviewCount: 456,
      inStock: true,
      stockQuantity: 98,
      isNew: false,
      isFeatured: false,
      isBestSeller: true,
      colors: ["Black", "White"],
      compatibility: ["iPhone", "Samsung Galaxy", "Google Pixel", "AirPods"],
      imageUrl: "/wireless-charger.png",
    },
    {
      id: 112,
      name: "Smartphone Camera Lens Kit",
      brand: "Moment",
      category: "Mobile Accessories",
      description:
        "Take your mobile photography to the next level with this professional-grade lens kit. Includes wide-angle, macro, and telephoto lenses that easily attach to your phone for DSLR-quality photos.",
      price: 99.99,
      rating: 4.4,
      reviewCount: 213,
      inStock: true,
      stockQuantity: 37,
      isNew: true,
      isFeatured: false,
      isBestSeller: false,
      compatibility: ["iPhone", "Samsung Galaxy", "Google Pixel"],
      imageUrl: "/camera-lens-kit.png",
    },
    {
      id: 113,
      name: "Smartphone Gimbal Stabilizer",
      brand: "DJI",
      category: "Mobile Accessories",
      description:
        "Capture smooth, professional-looking video with this handheld gimbal stabilizer. Its 3-axis stabilization eliminates camera shake, while intelligent tracking and gesture controls make filming easier than ever.",
      price: 129.99,
      rating: 4.8,
      reviewCount: 178,
      inStock: true,
      stockQuantity: 45,
      isNew: true,
      isFeatured: true,
      isBestSeller: false,
      colors: ["Black", "White"],
      compatibility: ["iPhone", "Samsung Galaxy", "Google Pixel", "Most smartphones up to 280g"],
      imageUrl: "/gimbal-stabilizer.png",
    },
    {
      id: 114,
      name: "Rugged Tablet Case",
      brand: "UAG",
      category: "Mobile Accessories",
      description:
        "Designed for adventure, this rugged tablet case offers exceptional protection against drops, dust, and impacts. Perfect for outdoor use or industrial environments where durability is essential.",
      price: 69.99,
      rating: 4.7,
      reviewCount: 156,
      inStock: true,
      stockQuantity: 53,
      isNew: false,
      isFeatured: false,
      isBestSeller: false,
      colors: ["Black", "Orange", "Blue"],
      compatibility: ["iPad Pro", "iPad Air", "Samsung Galaxy Tab"],
      imageUrl: "/rugged-tablet-case.png",
    },
    {
      id: 115,
      name: "Phone Ring Holder & Stand",
      brand: "PopSockets",
      category: "Mobile Accessories",
      description:
        "Add grip and functionality to your phone with this stylish ring holder. It prevents drops while texting or taking photos, and doubles as a convenient stand for hands-free viewing.",
      price: 14.99,
      rating: 4.3,
      reviewCount: 521,
      inStock: true,
      stockQuantity: 124,
      isNew: false,
      isFeatured: false,
      isBestSeller: true,
      colors: ["Black", "Rose Gold", "Blue Marble", "Wood Grain"],
      compatibility: ["Works with most smartphones and cases"],
      imageUrl: "/ring-holder.png",
    },
    {
      id: 116,
      name: "Precision Stylus Pen",
      brand: "Apple",
      category: "Mobile Accessories",
      description:
        "Unleash your creativity with this precision stylus pen. With pressure sensitivity, tilt recognition, and virtually no lag, it offers a natural drawing and writing experience on your compatible tablet.",
      price: 129.99,
      rating: 4.9,
      reviewCount: 287,
      inStock: true,
      stockQuantity: 42,
      isNew: false,
      isFeatured: true,
      isBestSeller: true,
      colors: ["White", "Space Gray"],
      compatibility: ["iPad Pro", "iPad Air", "iPad Mini"],
      imageUrl: "/stylus-pen.png",
    },
    {
      id: 117,
      name: "High-Capacity Power Bank",
      brand: "Anker",
      category: "Mobile Accessories",
      description:
        "Never run out of battery again with this powerful 20,000mAh power bank. It can charge multiple devices simultaneously and features fast-charging technology to get you powered up quickly.",
      price: 49.99,
      rating: 4.7,
      reviewCount: 678,
      inStock: true,
      stockQuantity: 86,
      isNew: false,
      isFeatured: false,
      isBestSeller: true,
      colors: ["Black", "White"],
      compatibility: ["iPhone", "iPad", "Samsung Galaxy", "Google Pixel", "Most USB-C and USB-A devices"],
      imageUrl: "/power-bank.png",
    },
    {
      id: 118,
      name: "Privacy Screen Protector",
      brand: "Zagg",
      category: "Mobile Accessories",
      description:
        "Keep your sensitive information safe with this privacy screen protector. It limits the viewing angle so only you can see your screen, while also protecting against scratches and fingerprints.",
      price: 39.99,
      rating: 4.5,
      reviewCount: 312,
      inStock: true,
      stockQuantity: 67,
      isNew: false,
      isFeatured: false,
      isBestSeller: false,
      compatibility: ["iPhone", "Samsung Galaxy", "Google Pixel"],
      imageUrl: "/privacy-screen-protector.png",
    },
    {
      id: 119,
      name: "Foldable Bluetooth Keyboard",
      brand: "Microsoft",
      category: "Mobile Accessories",
      description:
        "Type comfortably anywhere with this ultra-portable foldable keyboard. It connects wirelessly to your phone or tablet and folds to pocket size when not in use, perfect for productivity on the go.",
      price: 79.99,
      rating: 4.4,
      reviewCount: 198,
      inStock: true,
      stockQuantity: 41,
      isNew: true,
      isFeatured: false,
      isBestSeller: false,
      colors: ["Black", "Gray"],
      compatibility: ["iOS", "Android", "Windows"],
      imageUrl: "/foldable-keyboard.png",
    },
    {
      id: 120,
      name: "Car Phone Mount",
      brand: "Belkin",
      category: "Mobile Accessories",
      description:
        "Drive safely with this sturdy car phone mount. It securely holds your device at the perfect viewing angle for navigation, and the quick-release mechanism makes it easy to attach and remove your phone.",
      price: 24.99,
      rating: 4.6,
      reviewCount: 423,
      inStock: true,
      stockQuantity: 92,
      isNew: false,
      isFeatured: false,
      isBestSeller: true,
      colors: ["Black"],
      compatibility: ["Works with most smartphones up to 6.7 inches"],
      imageUrl: "/car-mount.png",
    },
  ]

  return mobileProducts
}

// Export the functions and data
module.exports = {
  categories,
  brands,
  generateDescription,
  generateProductName,
  generateProducts,
  generateMobileDeviceProducts,
}
