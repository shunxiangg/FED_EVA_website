const products = [
  { 
    id: 1,
    name: "Laptop",
    category: "electronics",
    price: 800,
    condition: "new",
    description: "Powerful laptop for everyday use",
    image: "images/laptop.jpg"
  },
  { 
    id: 2,
    name: "Sofa",
    category: "furniture",
    price: 1200,
    condition: "second-hand",
    description: "Comfortable 3-seater sofa",
    image: "images/sofa.jpg"
  },
  { 
    id: 3,
    name: "Smartphone",
    category: "electronics",
    price: 500,
    condition: "new",
    description: "Latest model smartphone",
    image: "images/phone.jpg"
  },
  { 
    id: 4,
    name: "JavaScript Book",
    category: "books",
    price: 25,
    condition: "new",
    description: "Complete guide to JavaScript",
    image: "images/book.jpg"
  },
  { 
    id: 5,
    name: "T-Shirt",
    category: "clothing",
    price: 30,
    condition: "second-hand",
    description: "Cotton T-shirt, size M",
    image: "images/tshirt.jpg"
  },
  { 
    id: 6,
    name: "Lipstick",
    category: "cosmetics",
    price: 20,
    condition: "new",
    description: "Long-lasting matte lipstick",
    image: "images/lipstick.jpg"
  },
  { 
    id: 7,
    name: "Foundation",
    category: "cosmetics",
    price: 40,
    condition: "new",
    description: "Full-coverage foundation for flawless skin",
    image: "images/foundation.jpg"
  },
  { 
    id: 8,
    name: "Leather Jacket",
    category: "clothing",
    price: 150,
    condition: "new",
    description: "Stylish black leather jacket, size L",
    image: "images/jacket.jpg"
  },
  { 
    id: 9,
    name: "Office Chair",
    category: "furniture",
    price: 250,
    condition: "new",
    description: "Ergonomic office chair for comfort",
    image: "images/office-chair.jpg"
  },
  { 
    id: 10,
    name: "Fridge",
    category: "electronics",
    price: 700,
    condition: "new",
    description: "Energy-efficient refrigerator with smart features",
    image: "images/fridge.jpg"
  },
  { 
    id: 11,
    name: "E-Book Reader",
    category: "electronics",
    price: 120,
    condition: "new",
    description: "Portable e-book reader with adjustable screen",
    image: "images/ebook-reader.jpg"
  },
  { 
    id: 12,
    name: "Coffee Table",
    category: "furniture",
    price: 180,
    condition: "new",
    description: "Modern wooden coffee table",
    image: "images/coffeetable.jpg"
  },
  { 
    id: 13,
    name: "Sunglasses",
    category: "clothing",
    price: 50,
    condition: "new",
    description: "Polarized sunglasses with UV protection",
    image: "images/sunglasses.jpg"
  },
  { 
    id: 14,
    name: "Massage Oil",
    category: "cosmetics",
    price: 15,
    condition: "new",
    description: "Relaxing lavender massage oil",
    image: "images/massage-oil.jpg"
  },
  { 
    id: 15,
    name: "Smartwatch",
    category: "electronics",
    price: 250,
    condition: "new",
    description: "Fitness tracking smartwatch with heart rate monitor",
    image: "images/smartwatch.jpg"
  },
  { 
    id: 16,
    name: "Running Shoes",
    category: "clothing",
    price: 75,
    condition: "new",
    description: "Comfortable running shoes, size 9",
    image: "images/running-shoes.jpg"
  },
  { 
    id: 17,
    name: "Table Lamp",
    category: "furniture",
    price: 40,
    condition: "new",
    description: "Adjustable table lamp with LED light",
    image: "images/table-lamp.jpg"
  },
  { 
    id: 18,
    name: "Pillow",
    category: "furniture",
    price: 35,
    condition: "new",
    description: "Memory foam pillow for better sleep",
    image: "images/pillow.jpg"
  },
  { 
    id: 19,
    name: "Yoga Mat",
    category: "clothing",
    price: 25,
    condition: "new",
    description: "Non-slip yoga mat for fitness routines",
    image: "images/yoga-mat.jpg"
  },
  { 
    id: 20,
    name: "Cooking Pot",
    category: "furniture",
    price: 60,
    condition: "new",
    description: "Non-stick cooking pot with lid",
    image: "images/cooking-pot.jpg"
  },
  { 
    id: 21,
    name: "Blush",
    category: "cosmetics",
    price: 18,
    condition: "new",
    description: "Soft pink blush for a natural glow",
    image: "images/blush.jpg"
  },
  { 
    id: 22,
    name: "Nail Polish",
    category: "cosmetics",
    price: 8,
    condition: "new",
    description: "Quick-dry, long-lasting nail polish",
    image: "images/nailpolish.jpg"
  },
  { 
    id: 23,
    name: "Face Cream",
    category: "cosmetics",
    price: 30,
    condition: "new",
    description: "Hydrating face cream with SPF 15",
    image: "images/face-cream.jpg"
  },
  { 
    id: 24,
    name: "Perfume",
    category: "cosmetics",
    price: 55,
    condition: "new",
    description: "Fresh floral fragrance, long-lasting",
    image: "images/perfume.jpg"
  },
  { 
    id: 25,
    name: "Toothbrush",
    category: "cosmetics",
    price: 5,
    condition: "new",
    description: "Soft bristles, eco-friendly toothbrush",
    image: "images/toothbrush.jpg"
  },
  { 
    id: 26,
    name: "Wooden Shelf",
    category: "furniture",
    price: 100,
    condition: "new",
    description: "Rustic wooden shelf with three tiers",
    image: "images/wooden-shelf.jpg"
  },
  { 
    id: 27,
    name: "Blender",
    category: "electronics",
    price: 150,
    condition: "new",
    description: "High-speed blender for smoothies",
    image: "images/blender.jpg"
  },
  { 
    id: 28,
    name: "Winter Jacket",
    category: "clothing",
    price: 200,
    condition: "new",
    description: "Warm insulated winter jacket, size L",
    image: "images/winter-jacket.jpg"
  },
  { 
    id: 29,
    name: "Desk Organizer",
    category: "furniture",
    price: 35,
    condition: "new",
    description: "Wooden desk organizer for office supplies",
    image: "images/desk-organizer.jpg"
  },
  { 
    id: 30,
    name: "Headphones",
    category: "electronics",
    price: 120,
    condition: "new",
    description: "Noise-canceling over-ear headphones",
    image: "images/headphones.jpg"
  },
  
  // Book Products (new additions)
  { 
    id: 31,
    name: "Primary 1 English Book",
    category: "books",
    price: 12,
    condition: "new",
    description: "Basic English book for Primary 1 students",
    image: "images/primary1-english.jpg"
  },
  { 
    id: 32,
    name: "Secondary 2 Mathematics Book",
    category: "books",
    price: 25,
    condition: "new",
    description: "Mathematics book for Secondary 2 students",
    image: "images/secondary2-math.jpg"
  },
  { 
    id: 33,
    name: "Primary 3 Science Book",
    category: "books",
    price: 15,
    condition: "new",
    description: "Science book for Primary 3 students",
    image: "images/primary3-science.jpg"
  },
  { 
    id: 34,
    name: "Humanities Textbook for Secondary 4",
    category: "books",
    price: 30,
    condition: "new",
    description: "Humanities textbook for Secondary 4 students",
    image: "images/humanities-secondary4.jpg"
  },
  { 
    id: 35,
    name: "Secondary 5 Ten Year Series Mathematics",
    category: "books",
    price: 35,
    condition: "new",
    description: "Ten Year Series for Mathematics (Secondary 5)",
    image: "images/tys-math.jpg"
  },
  { 
    id: 36,
    name: "Primary 4 English Book",
    category: "books",
    price: 18,
    condition: "new",
    description: "English book for Primary 4 students",
    image: "images/primary4-english.jpg"
  },
  { 
    id: 37,
    name: "Secondary 3 Science Textbook",
    category: "books",
    price: 28,
    condition: "new",
    description: "Comprehensive Science textbook for Secondary 3 students",
    image: "images/secondary3-science.jpg"
  },
  { 
    id: 38,
    name: "Primary 6 Math Book",
    category: "books",
    price: 20,
    condition: "new",
    description: "Math book for Primary 6 students",
    image: "images/primary6-math.jpg"
  },
  { 
    id: 39,
    name: "Secondary 1 Geography Book",
    category: "books",
    price: 22,
    condition: "new",
    description: "Geography book for Secondary 1 students",
    image: "images/secondary1-geography.jpg"
  },
  { 
    id: 40,
    name: "Secondary 2 Ten Year Series English",
    category: "books",
    price: 35,
    condition: "new",
    description: "Ten Year Series for English (Secondary 2)",
    image: "images/tys-english.jpg"
  },

  // Second-hand items
  { 
    id: 41,
    name: "Used Laptop",
    category: "electronics",
    price: 400,
    condition: "second-hand",
    description: "Pre-owned laptop, good condition",
    image: "images/used-laptop.jpg"
  },
  { 
    id: 42,
    name: "Second-hand Sofa",
    category: "furniture",
    price: 800,
    condition: "second-hand",
    description: "Well-maintained second-hand 3-seater sofa",
    image: "images/secondhand-sofa.jpg"
  },
  { 
    id: 43,
    name: "Used Smartphone",
    category: "electronics",
    price: 250,
    condition: "second-hand",
    description: "Gently used smartphone with minor scratches",
    image: "images/used-phone.jpg"
  },
  { 
    id: 44,
    name: "Second-hand Running Shoes",
    category: "clothing",
    price: 40,
    condition: "second-hand",
    description: "Lightly used running shoes, size 9",
    image: "images/secondhand-running-shoes.jpg"
  },
  { 
    id: 45,
    name: "Used Coffee Table",
    category: "furniture",
    price: 90,
    condition: "second-hand",
    description: "Pre-owned coffee table with minor wear",
    image: "images/used-coffeetable.jpg"
  },
  { 
    id: 46,
    name: "Second-hand Winter Jacket",
    category: "clothing",
    price: 100,
    condition: "second-hand",
    description: "Used winter jacket, good condition, size M",
    image: "images/secondhand-winter-jacket.jpg"
  }
];

// Categories and conditions
const categories = ['all', 'electronics', 'furniture', 'clothing', 'books', 'cosmetics'];
const conditions = ['all', 'new', 'second-hand'];
