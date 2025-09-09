import React, { useState, useEffect } from 'react';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const categories = ['All', 'Electronics', 'Books', 'Clothing', 'Music', 'Software', 'Gaming', 'Health', 'Home', 'Art', 'Travel', 'Food'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    // Simulate API call with realistic products
    setTimeout(() => {
      const mockProducts = [
        // Electronics
        {
          id: 1,
          name: 'MacBook Pro M3',
          price: 1999.99,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
          category: 'Electronics',
          description: 'Latest MacBook Pro with M3 chip, perfect for development',
          rating: 4.9,
          reviews: 1250
        },
        {
          id: 2,
          name: 'AirPods Pro',
          price: 249.99,
          image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&q=80',
          category: 'Electronics',
          description: 'Wireless earbuds with noise cancellation',
          rating: 4.8,
          reviews: 2341
        },
        {
          id: 3,
          name: 'iPhone 15 Pro',
          price: 1099.99,
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
          category: 'Electronics',
          description: 'Latest iPhone with advanced camera system',
          rating: 4.8,
          reviews: 8901
        },
        {
          id: 4,
          name: 'Samsung 4K Smart TV',
          price: 799.99,
          image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
          category: 'Electronics',
          description: '55-inch 4K UHD Smart TV with HDR',
          rating: 4.5,
          reviews: 1789
        },
        {
          id: 5,
          name: 'Sony Wireless Headphones',
          price: 299.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
          category: 'Electronics',
          description: 'Premium wireless headphones with ANC',
          rating: 4.7,
          reviews: 3456
        },
        
        // Books
        {
          id: 6,
          name: 'React Programming Book',
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80',
          category: 'Books',
          description: 'Master React.js with this comprehensive guide',
          rating: 4.7,
          reviews: 890
        },
        {
          id: 7,
          // eslint-disable-next-line no-script-url
          name: 'JavaScript: The Good Parts',
          price: 34.99,
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
          category: 'Books',
          description: 'Essential JavaScript programming guide',
          rating: 4.6,
          reviews: 2134
        },
        {
          id: 8,
          name: 'Clean Code',
          price: 42.99,
          image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
          category: 'Books',
          description: 'A handbook of agile software craftsmanship',
          rating: 4.8,
          reviews: 4567
        },
        {
          id: 9,
          name: 'Design Patterns',
          price: 54.99,
          image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
          category: 'Books',
          description: 'Elements of reusable object-oriented software',
          rating: 4.5,
          reviews: 1234
        },
        {
          id: 10,
          name: 'The Art of Computer Programming',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80',
          category: 'Books',
          description: 'Knuth\'s legendary computer science series',
          rating: 4.9,
          reviews: 567
        },
        
        // Clothing
        {
          id: 11,
          name: 'Developer Hoodie',
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
          category: 'Clothing',
          description: 'Premium quality hoodie for developers',
          rating: 4.5,
          reviews: 456
        },
        {
          id: 12,
          name: 'Coding T-Shirt Collection',
          price: 29.99,
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
          category: 'Clothing',
          description: 'Funny programming themed t-shirts',
          rating: 4.3,
          reviews: 789
        },
        {
          id: 13,
          name: 'Tech Conference Sweatshirt',
          price: 65.99,
          image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80',
          category: 'Clothing',
          description: 'Comfortable sweatshirt for tech events',
          rating: 4.4,
          reviews: 234
        },
        {
          id: 14,
          name: 'Premium Sneakers',
          price: 149.99,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
          category: 'Clothing',
          description: 'Comfortable sneakers for daily wear',
          rating: 4.6,
          reviews: 1567
        },
        
        // Music
        {
          id: 15,
          name: 'Spotify Premium (1 Year)',
          price: 99.99,
          image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80',
          category: 'Music',
          description: 'Premium music streaming service',
          rating: 4.6,
          reviews: 15670
        },
        {
          id: 16,
          name: 'Apple Music (1 Year)',
          price: 119.99,
          image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=800&q=80',
          category: 'Music',
          description: 'High-quality music streaming with lossless audio',
          rating: 4.4,
          reviews: 8901
        },
        {
          id: 17,
          name: 'Vinyl Record Collection',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=800&q=80',
          category: 'Music',
          description: 'Classic albums on vinyl records',
          rating: 4.8,
          reviews: 567
        },
        {
          id: 18,
          name: 'Professional Microphone',
          price: 179.99,
          image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=800&q=80',
          category: 'Music',
          description: 'Studio-grade microphone for recording',
          rating: 4.7,
          reviews: 1234
        },
        
        // Software
        {
          id: 19,
          name: 'VS Code Extensions Pack',
          price: 29.99,
          image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&q=80',
          category: 'Software',
          description: 'Essential VS Code extensions for developers',
          rating: 4.9,
          reviews: 3456
        },
        {
          id: 20,
          name: 'Adobe Creative Suite',
          price: 599.99,
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
          category: 'Software',
          description: 'Complete creative suite for professionals',
          rating: 4.7,
          reviews: 9876
        },
        {
          id: 21,
          name: 'Microsoft Office 365',
          price: 99.99,
          image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec1f363?w=800&q=80',
          category: 'Software',
          description: 'Complete productivity suite',
          rating: 4.5,
          reviews: 12345
        },
        {
          id: 22,
          name: 'IntelliJ IDEA Ultimate',
          price: 149.99,
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
          category: 'Software',
          description: 'Professional IDE for Java development',
          rating: 4.8,
          reviews: 2345
        },
        
        // Gaming
        {
          id: 23,
          name: 'Gaming Mechanical Keyboard',
          price: 159.99,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
          category: 'Gaming',
          description: 'RGB mechanical keyboard for gaming',
          rating: 4.6,
          reviews: 2891
        },
        {
          id: 24,
          name: 'Gaming Mouse',
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1587202372775-98927b643c3b?w=800&q=80',
          category: 'Gaming',
          description: 'High-precision gaming mouse with RGB',
          rating: 4.5,
          reviews: 1567
        },
        {
          id: 25,
          name: 'VR Headset',
          price: 399.99,
          image: 'https://images.unsplash.com/photo-1581472723648-909f4851d4ae?w=800&q=80',
          category: 'Gaming',
          description: 'Immersive virtual reality headset',
          rating: 4.4,
          reviews: 891
        },
        {
          id: 26,
          name: 'Gaming Chair',
          price: 299.99,
          image: 'https://images.unsplash.com/photo-1513185041617-8ab03f83d6c5?w=800&q=80',
          category: 'Gaming',
          description: 'Ergonomic gaming chair with lumbar support',
          rating: 4.7,
          reviews: 1789
        },
        
        // Health
        {
          id: 27,
          name: 'Fitness Tracker',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&q=80',
          category: 'Health',
          description: 'Advanced fitness tracker with heart rate monitor',
          rating: 4.5,
          reviews: 3456
        },
        {
          id: 28,
          name: 'Yoga Mat Premium',
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1599050751795-5d0b08b11f49?w=800&q=80',
          category: 'Health',
          description: 'Non-slip premium yoga mat',
          rating: 4.6,
          reviews: 1234
        },
        {
          id: 29,
          name: 'Protein Powder',
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
          category: 'Health',
          description: 'High-quality whey protein supplement',
          rating: 4.3,
          reviews: 2567
        },
        
        // Home
        {
          id: 30,
          name: 'Smart Home Hub',
          price: 149.99,
          image: 'https://images.unsplash.com/photo-1587578932405-7a5e447d4a03?w=800&q=80',
          category: 'Home',
          description: 'Central hub for smart home devices',
          rating: 4.4,
          reviews: 1567
        },
        {
          id: 31,
          name: 'Robot Vacuum',
          price: 299.99,
          image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
          category: 'Home',
          description: 'Autonomous robot vacuum cleaner',
          rating: 4.5,
          reviews: 2891
        },
        {
          id: 32,
          name: 'Air Purifier',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1556449890-0361b5b52c43?w=800&q=80',
          category: 'Home',
          description: 'HEPA air purifier for clean air',
          rating: 4.6,
          reviews: 1789
        },
        
        // Art
        {
          id: 33,
          name: 'Digital Drawing Tablet',
          price: 249.99,
          image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec1f363?w=800&q=80',
          category: 'Art',
          description: 'Professional drawing tablet for digital art',
          rating: 4.7,
          reviews: 1234
        },
        {
          id: 34,
          name: 'Art Supply Set',
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1505745226314-22f2b2fd0c9b?w=800&q=80',
          category: 'Art',
          description: 'Complete set of professional art supplies',
          rating: 4.4,
          reviews: 567
        },
        
        // Travel
        {
          id: 35,
          name: 'Travel Backpack',
          price: 129.99,
          image: 'https://images.unsplash.com/photo-1555617766-5ce8f04967f8?w=800&q=80',
          category: 'Travel',
          description: 'Durable travel backpack with laptop compartment',
          rating: 4.6,
          reviews: 2345
        },
        {
          id: 36,
          name: 'Portable Charger',
          price: 39.99,
          image: 'https://images.unsplash.com/photo-1622519407655-c9e1cbb24980?w=800&q=80',
          category: 'Travel',
          description: 'High-capacity portable phone charger',
          rating: 4.5,
          reviews: 3456
        },
        
        // Food
        {
          id: 37,
          name: 'Premium Coffee Beans',
          price: 24.99,
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
          category: 'Food',
          description: 'Single-origin specialty coffee beans',
          rating: 4.8,
          reviews: 1789
        },
        {
          id: 38,
          name: 'Organic Tea Collection',
          price: 34.99,
          image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80',
          category: 'Food',
          description: 'Assorted organic tea varieties',
          rating: 4.5,
          reviews: 891
        },
        {
          id: 39,
          name: 'Gourmet Chocolate Box',
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80',
          category: 'Food',
          description: 'Luxury chocolate collection',
          rating: 4.7,
          reviews: 1234
        },
        {
          id: 40,
          name: 'Cooking Spice Set',
          price: 39.99,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
          category: 'Food',
          description: 'Professional cooking spices and herbs',
          rating: 4.4,
          reviews: 567
        },
        
        // Additional Electronics with Real Features
        {
          id: 41,
          name: 'Dell XPS 13 Laptop',
          price: 1299.99,
          image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
          category: 'Electronics',
          description: '13.3" 4K Display, Intel i7, 16GB RAM, 512GB SSD, Windows 11 Pro',
          features: ['4K InfinityEdge Display', '11th Gen Intel Core i7', '16GB LPDDR4x', '512GB PCIe SSD', 'Thunderbolt 4', '12+ hour battery'],
          rating: 4.7,
          reviews: 3456
        },
        {
          id: 42,
          name: 'Canon EOS R5 Camera',
          price: 3899.99,
          image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80',
          category: 'Electronics',
          description: '45MP Full-Frame Mirrorless Camera with 8K Video Recording',
          features: ['45MP CMOS Sensor', '8K RAW Video', 'In-body Stabilization', 'Dual Card Slots', 'Weather Sealed', 'WiFi & Bluetooth'],
          rating: 4.9,
          reviews: 891
        },
        {
          id: 43,
          name: 'Samsung Galaxy S24 Ultra',
          price: 1199.99,
          image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
          category: 'Electronics',
          description: '512GB, Titanium Gray, S Pen Included, 200MP Camera',
          features: ['6.8" Dynamic AMOLED', '200MP Main Camera', 'S Pen Included', '5000mAh Battery', '45W Fast Charging', 'IP68 Rating'],
          rating: 4.8,
          reviews: 5671
        },
        {
          id: 44,
          name: 'LG UltraWide Monitor 34"',
          price: 449.99,
          image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
          category: 'Electronics',
          description: '34" 21:9 UltraWide QHD IPS Monitor with USB-C',
          features: ['3440x1440 Resolution', 'IPS Panel', 'USB-C Connectivity', '99% sRGB', 'HDR10 Support', 'Height Adjustable'],
          rating: 4.6,
          reviews: 2134
        },
        
        // Professional Software with Real Features
        {
          id: 45,
          name: 'Adobe Creative Cloud',
          price: 599.99,
          image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80',
          category: 'Software',
          description: 'Complete Creative Suite - Photoshop, Illustrator, Premiere Pro & More',
          features: ['Photoshop 2024', 'Illustrator', 'Premiere Pro', 'After Effects', 'Lightroom', '100GB Cloud Storage'],
          rating: 4.7,
          reviews: 15670
        },
        {
          id: 46,
          name: 'JetBrains IntelliJ Ultimate',
          price: 149.99,
          image: 'https://picsum.photos/300/300?random=36',
          category: 'Software',
          description: 'Professional Java IDE with Advanced Features',
          features: ['Smart Code Completion', 'Built-in Debugger', 'Version Control', 'Database Tools', 'Framework Support', 'Refactoring Tools'],
          rating: 4.8,
          reviews: 3456
        },
        {
          id: 47,
          name: 'Figma Pro Plan',
          price: 144.00,
          image: 'https://picsum.photos/300/300?random=37',
          category: 'Software',
          description: 'Professional Design Tool with Unlimited Projects',
          features: ['Unlimited Projects', 'Version History', 'Team Libraries', 'Advanced Components', 'Dev Mode', 'Audio Conversations'],
          rating: 4.9,
          reviews: 8901
        },
        
        // Gaming Gear with Specifications
        {
          id: 48,
          name: 'ASUS ROG Gaming Laptop',
          price: 1899.99,
          image: 'https://picsum.photos/300/300?random=38',
          category: 'Gaming',
          description: 'RTX 4060, AMD Ryzen 7, 16GB RAM, 1TB SSD',
          features: ['RTX 4060 8GB', 'AMD Ryzen 7 7735HS', '16GB DDR5', '1TB PCIe SSD', '144Hz Display', 'RGB Keyboard'],
          rating: 4.7,
          reviews: 2345
        },
        {
          id: 49,
          name: 'PlayStation 5 Console',
          price: 499.99,
          image: 'https://picsum.photos/300/300?random=39',
          category: 'Gaming',
          description: 'Latest Gaming Console with Ray Tracing & 4K Gaming',
          features: ['Custom AMD RDNA 2 GPU', 'Ultra-High Speed SSD', 'Ray Tracing Support', '4K Gaming', 'DualSense Controller', '3D Audio'],
          rating: 4.8,
          reviews: 12340
        },
        {
          id: 50,
          name: 'Logitech G Pro X Superlight',
          price: 149.99,
          image: 'https://picsum.photos/300/300?random=40',
          category: 'Gaming',
          description: 'Ultra-Lightweight Wireless Gaming Mouse',
          features: ['<63g Weight', 'HERO 25K Sensor', '70-hour Battery', 'Zero Additive PTFE', 'LIGHTSPEED Wireless', 'Pro-Grade Precision'],
          rating: 4.9,
          reviews: 5671
        },
        
        // Health & Fitness with Real Benefits
        {
          id: 51,
          name: 'Apple Watch Series 9',
          price: 399.99,
          image: 'https://picsum.photos/300/300?random=41',
          category: 'Health',
          description: 'GPS + Cellular, Health Monitoring, Fitness Tracking',
          features: ['ECG Monitoring', 'Blood Oxygen', 'Sleep Tracking', 'Crash Detection', 'Water Resistant', 'Always-On Display'],
          rating: 4.7,
          reviews: 8901
        },
        {
          id: 52,
          name: 'Peloton Bike+',
          price: 2495.00,
          image: 'https://picsum.photos/300/300?random=42',
          category: 'Health',
          description: 'Interactive Fitness Bike with Live Classes',
          features: ['22" HD Touchscreen', 'Live & On-Demand Classes', 'Auto-Follow Resistance', 'Heart Rate Monitoring', '12-month Warranty', 'White Glove Delivery'],
          rating: 4.6,
          reviews: 3456
        },
        
        // Home & Smart Devices
        {
          id: 53,
          name: 'Nest Learning Thermostat',
          price: 249.99,
          image: 'https://picsum.photos/300/300?random=43',
          category: 'Home',
          description: 'Smart Thermostat with Energy Saving Features',
          features: ['Auto-Schedule Learning', 'Energy History', 'Remote Control', 'HVAC Monitoring', 'Works with Alexa', 'Professional Installation'],
          rating: 4.5,
          reviews: 4567
        },
        {
          id: 54,
          name: 'Ring Video Doorbell Pro',
          price: 249.99,
          image: 'https://picsum.photos/300/300?random=44',
          category: 'Home',
          description: '1080p HD Video, Two-Way Talk, Motion Detection',
          features: ['1080p HD Video', '160° Field of View', 'Advanced Motion Detection', 'Two-Way Audio', 'Night Vision', 'Works with Alexa'],
          rating: 4.4,
          reviews: 6789
        },
        
        // Books with Real Knowledge
        {
          id: 55,
          name: 'System Design Interview',
          price: 45.99,
          image: 'https://picsum.photos/300/300?random=45',
          category: 'Books',
          description: 'An Insider\'s Guide to System Design Interviews',
          features: ['Step-by-step Problem Solving', 'Real Interview Questions', '15+ Case Studies', 'Scalability Concepts', 'Best Practices', 'Industry Insights'],
          rating: 4.8,
          reviews: 2345
        },
        {
          id: 56,
          name: 'Machine Learning Yearning',
          price: 39.99,
          image: 'https://picsum.photos/300/300?random=46',
          category: 'Books',
          description: 'Technical Strategy for AI Engineers by Andrew Ng',
          features: ['AI Strategy Guide', 'Practical ML Advice', 'Error Analysis', 'Data Strategy', 'Team Management', 'Case Studies'],
          rating: 4.9,
          reviews: 1890
        },
        
        // Art & Creativity Tools
        {
          id: 57,
          name: 'Wacom Cintiq Pro 24',
          price: 1999.99,
          image: 'https://picsum.photos/300/300?random=47',
          category: 'Art',
          description: 'Professional Pen Display for Digital Artists',
          features: ['24" 4K Display', '8192 Pressure Levels', 'Color Accurate', 'Multi-Touch', 'Pen Tilt Recognition', 'ExpressKeys'],
          rating: 4.8,
          reviews: 1234
        },
        {
          id: 58,
          name: 'iPad Pro 12.9" M2',
          price: 1099.99,
          image: 'https://picsum.photos/300/300?random=48',
          category: 'Art',
          description: 'Professional Tablet for Digital Art & Design',
          features: ['M2 Chip Performance', '12.9" Liquid Retina XDR', 'Apple Pencil Support', 'ProRes Video Recording', '2TB Storage Option', 'Magic Keyboard Compatible'],
          rating: 4.7,
          reviews: 3456
        },
        
        // Travel & Lifestyle
        {
          id: 59,
          name: 'Peak Design Travel Backpack',
          price: 279.95,
          image: 'https://picsum.photos/300/300?random=49',
          category: 'Travel',
          description: '35L Camera & Laptop Backpack for Professionals',
          features: ['35L Capacity', 'Camera Cube Compatible', 'Laptop Compartment', 'External Access', 'Weatherproof', 'Lifetime Warranty'],
          rating: 4.9,
          reviews: 2345
        },
        {
          id: 60,
          name: 'Sony WH-1000XM5 Headphones',
          price: 399.99,
          image: 'https://picsum.photos/300/300?random=50',
          category: 'Travel',
          description: 'Industry Leading Noise Canceling Headphones',
          features: ['Industry-leading ANC', '30-hour Battery', 'Quick Charge', 'Multipoint Connection', 'Speak-to-Chat', 'Premium Comfort'],
          rating: 4.8,
          reviews: 7890
        },
        
        // Enhanced Electronics Collection
        {
          id: 61,
          name: 'Tesla Model S Plaid Key Fob',
          price: 175.00,
          image: 'https://picsum.photos/300/300?random=51',
          category: 'Electronics',
          description: 'Premium Key Fob for Tesla Model S Plaid',
          features: ['NFC Technology', 'Premium Materials', 'Long Range', 'Quick Response', 'Sleek Design', 'Tesla Official'],
          rating: 4.9,
          reviews: 892
        },
        {
          id: 62,
          name: 'Meta Quest 3 VR Headset',
          price: 499.99,
          image: 'https://picsum.photos/300/300?random=52',
          category: 'Gaming',
          description: 'Next-Gen Mixed Reality VR Headset',
          features: ['4K+ Display', 'Mixed Reality', '128GB Storage', 'Hand Tracking', 'Wireless Freedom', 'Meta Store Access'],
          rating: 4.8,
          reviews: 5432
        },
        {
          id: 63,
          name: 'DJI Air 3 Drone',
          price: 1099.00,
          image: 'https://picsum.photos/300/300?random=53',
          category: 'Electronics',
          description: 'Professional Dual-Camera Drone with 46-Min Flight Time',
          features: ['Dual 4K Cameras', '46-min Flight Time', 'Omnidirectional Sensing', '20km Video Range', 'ActiveTrack 360°', 'Professional Video'],
          rating: 4.9,
          reviews: 3210
        },
        {
          id: 64,
          name: 'Framework Laptop 13',
          price: 1399.00,
          image: 'https://picsum.photos/300/300?random=54',
          category: 'Electronics',
          description: 'Modular, Repairable, Upgradeable 13.5" Laptop',
          features: ['Modular Ports', 'Intel 12th Gen', '13.5" 2256x1504', '32GB RAM Option', 'Repairable Design', 'Linux Compatible'],
          rating: 4.7,
          reviews: 1876
        },
        {
          id: 65,
          name: 'Bambu Lab X1 Carbon 3D Printer',
          price: 1199.00,
          image: 'https://picsum.photos/300/300?random=55',
          category: 'Electronics',
          description: 'High-Speed Multi-Color 3D Printer with AI',
          features: ['Auto Bed Leveling', '16-Color Printing', 'AI Error Detection', 'Cloud Printing', '256x256x256mm', 'Enclosed Chamber'],
          rating: 4.8,
          reviews: 2543
        },
        
        // Professional Software & Development Tools
        {
          id: 66,
          name: 'GitHub Copilot Individual',
          price: 120.00,
          image: 'https://picsum.photos/300/300?random=56',
          category: 'Software',
          description: 'AI-Powered Coding Assistant (Annual Subscription)',
          features: ['AI Code Suggestions', 'Multi-Language Support', 'Context Aware', 'IDE Integration', 'Code Explanation', 'Real-time Assistance'],
          rating: 4.6,
          reviews: 15430
        },
        {
          id: 67,
          name: 'Notion Pro Plan',
          price: 96.00,
          image: 'https://picsum.photos/300/300?random=57',
          category: 'Software',
          description: 'All-in-One Workspace for Teams (Annual)',
          features: ['Unlimited Blocks', 'Advanced Permissions', 'Version History', 'Team Collaboration', 'API Access', 'Priority Support'],
          rating: 4.7,
          reviews: 23456
        },
        {
          id: 68,
          name: 'Docker Desktop Pro',
          price: 60.00,
          image: 'https://picsum.photos/300/300?random=58',
          category: 'Software',
          description: 'Container Development Platform (Annual)',
          features: ['Image Access Management', 'Remote Builds', 'Advanced Security', 'Single Sign-On', 'Enhanced Support', 'Docker Scout'],
          rating: 4.5,
          reviews: 8765
        },
        
        // Advanced Gaming Gear
        {
          id: 69,
          name: 'Valve Index VR Kit',
          price: 999.00,
          image: 'https://picsum.photos/300/300?random=59',
          category: 'Gaming',
          description: 'Premium PC VR System with Controllers & Base Stations',
          features: ['130° FOV', '120Hz Display', 'Finger Tracking', 'Room-Scale VR', 'Precision Audio', 'SteamVR 2.0'],
          rating: 4.8,
          reviews: 4321
        },
        {
          id: 70,
          name: 'Razer Blade 18 Gaming Laptop',
          price: 3499.99,
          image: 'https://picsum.photos/300/300?random=60',
          category: 'Gaming',
          description: 'RTX 4090, Intel i9-13950HX, 32GB DDR5, 1TB SSD',
          features: ['RTX 4090 16GB', 'Intel i9-13950HX', '18" QHD+ 240Hz', '32GB DDR5', '1TB NVMe SSD', 'Per-Key RGB'],
          rating: 4.9,
          reviews: 1234
        },
        {
          id: 71,
          name: 'Herman Miller x Logitech Embody',
          price: 1695.00,
          image: 'https://picsum.photos/300/300?random=61',
          category: 'Gaming',
          description: 'Ergonomic Gaming Chair Designed for Health',
          features: ['Postural Support', 'Cooling Foam', 'Adjustable Arms', 'Tilt Limiter', '12-Year Warranty', 'Health-Positive'],
          rating: 4.9,
          reviews: 2876
        },
        
        // Health & Fitness Advanced
        {
          id: 72,
          name: 'Oura Ring Gen3',
          price: 399.00,
          image: 'https://picsum.photos/300/300?random=62',
          category: 'Health',
          description: 'Advanced Health & Sleep Tracking Ring',
          features: ['Sleep Stages', 'HRV Monitoring', 'Body Temperature', 'Activity Tracking', '7-Day Battery', 'Waterproof'],
          rating: 4.4,
          reviews: 12340
        },
        {
          id: 73,
          name: 'Theragun PRO Massager',
          price: 599.00,
          image: 'https://picsum.photos/300/300?random=63',
          category: 'Health',
          description: 'Professional Percussive Therapy Device',
          features: ['60lb Force', 'OLED Screen', '6 Attachments', 'Bluetooth Connectivity', '150min Battery', 'Ergonomic Design'],
          rating: 4.7,
          reviews: 8765
        },
        {
          id: 74,
          name: 'Withings Body Comp Scale',
          price: 199.95,
          image: 'https://picsum.photos/300/300?random=64',
          category: 'Health',
          description: 'Advanced Body Composition Wi-Fi Scale',
          features: ['Body Fat %', 'Muscle Mass', 'Bone Mass', 'Water %', 'Visceral Fat', 'Weather Display'],
          rating: 4.3,
          reviews: 5432
        },
        
        // Smart Home Advanced
        {
          id: 75,
          name: 'Ecobee SmartThermostat Premium',
          price: 329.99,
          image: 'https://picsum.photos/300/300?random=65',
          category: 'Home',
          description: 'Smart Thermostat with Voice Control & Air Quality Monitor',
          features: ['Air Quality Monitor', 'Spotify Built-in', 'SmartSensor Included', 'Alexa Built-in', 'Energy Saving', 'Remote Access'],
          rating: 4.6,
          reviews: 6789
        },
        {
          id: 76,
          name: 'Philips Hue Play Gradient Lightstrip',
          price: 199.99,
          image: 'https://picsum.photos/300/300?random=66',
          category: 'Home',
          description: 'Immersive TV Backlighting with Sync Box',
          features: ['Gradient Colors', 'Screen Mirroring', 'Music Sync', 'Voice Control', 'Easy Installation', '16M Colors'],
          rating: 4.5,
          reviews: 4321
        },
        {
          id: 77,
          name: 'August Wi-Fi Smart Lock Pro',
          price: 279.99,
          image: 'https://picsum.photos/300/300?random=67',
          category: 'Home',
          description: 'Keyless Entry Smart Lock with Built-in Wi-Fi',
          features: ['Wi-Fi Built-in', 'Auto-Lock/Unlock', 'Guest Access', 'Voice Control', 'Activity Log', 'Easy Installation'],
          rating: 4.4,
          reviews: 3456
        },
        
        // Professional Art & Design
        {
          id: 78,
          name: 'Eizo ColorEdge CG2700X Monitor',
          price: 2499.00,
          image: 'https://picsum.photos/300/300?random=68',
          category: 'Art',
          description: '27" 4K Hardware Calibration Monitor for Professionals',
          features: ['Hardware Calibration', '99% Adobe RGB', 'Built-in Sensor', 'USB-C 96W PD', '5-Year Warranty', 'ColorNavigator 7'],
          rating: 4.9,
          reviews: 876
        },
        {
          id: 79,
          name: 'Arturia KeyLab Essential 88',
          price: 449.00,
          image: 'https://picsum.photos/300/300?random=69',
          category: 'Music',
          description: '88-Key MIDI Controller with Analog Lab Software',
          features: ['88 Keys', '9 Faders', '8 Rotary Knobs', 'Analog Lab Lite', 'Ableton Live Lite', 'USB/MIDI'],
          rating: 4.7,
          reviews: 2109
        },
        {
          id: 80,
          name: 'Procreate Dreams Animation App',
          price: 19.99,
          image: 'https://picsum.photos/300/300?random=70',
          category: 'Art',
          description: 'Professional 2D Animation App for iPad',
          features: ['Timeline Animation', 'Onion Skinning', 'Live Animation', 'Flipbook Mode', 'Audio Support', 'Procreate Integration'],
          rating: 4.6,
          reviews: 15432
        },
        
        // Premium Lifestyle & Luxury
        {
          id: 81,
          name: 'Patagonia Nano Puff Jacket',
          price: 229.00,
          image: 'https://picsum.photos/300/300?random=71',
          category: 'Clothing',
          description: 'Lightweight Insulated Jacket for Outdoor Adventures',
          features: ['PrimaLoft Gold Insulation', 'DWR Finish', 'Packable Design', 'Fair Trade Certified', 'Recycled Materials', 'Lifetime Repair'],
          rating: 4.8,
          reviews: 4567
        },
        {
          id: 82,
          name: 'Allbirds Tree Runners',
          price: 98.00,
          image: 'https://picsum.photos/300/300?random=72',
          category: 'Clothing',
          description: 'Sustainable Sneakers Made from Eucalyptus Tree Fiber',
          features: ['Eucalyptus Tree Fiber', 'Merino Wool Lining', 'SweetFoam Soles', 'Machine Washable', 'Carbon Neutral', 'Odor Resistant'],
          rating: 4.4,
          reviews: 12890
        },
        {
          id: 83,
          name: 'YETI Rambler 30 oz Tumbler',
          price: 39.99,
          image: 'https://picsum.photos/300/300?random=73',
          category: 'Travel',
          description: 'Insulated Stainless Steel Travel Tumbler',
          features: ['Double-Wall Vacuum', 'No Sweat Design', 'Dishwasher Safe', 'MagSlider Lid', '18/8 Stainless Steel', 'Lifetime Warranty'],
          rating: 4.7,
          reviews: 8765
        },
        {
          id: 84,
          name: 'Native Union Drop Wireless Charger',
          price: 79.99,
          image: 'https://picsum.photos/300/300?random=74',
          category: 'Electronics',
          description: 'Premium Leather Wireless Charging Pad',
          features: ['Italian Leather', '10W Fast Charging', 'LED Indicator', 'Case Friendly', 'FOD Protection', 'Design Award Winner'],
          rating: 4.5,
          reviews: 3456
        },
        
        // Food & Gourmet
        {
          id: 85,
          name: 'Blue Bottle Coffee Subscription',
          price: 180.00,
          image: 'https://picsum.photos/300/300?random=75',
          category: 'Food',
          description: 'Premium Single-Origin Coffee Subscription (3 Months)',
          features: ['Single-Origin Beans', 'Freshly Roasted', 'Curated Selection', 'Brewing Guides', 'Free Shipping', 'Expert Recommendations'],
          rating: 4.8,
          reviews: 5432
        },
        {
          id: 86,
          name: 'Williams Sonoma Olive Oil Collection',
          price: 125.00,
          image: 'https://picsum.photos/300/300?random=76',
          category: 'Food',
          description: 'Premium Extra Virgin Olive Oil Gift Set',
          features: ['Cold-Pressed', 'Estate Bottled', 'Harvest Date Certified', 'Tasting Notes', 'Gift Packaging', 'Artisanal Quality'],
          rating: 4.6,
          reviews: 2109
        },
        
        // Professional Books & Learning
        {
          id: 87,
          name: 'Designing Data-Intensive Applications',
          price: 54.99,
          image: 'https://picsum.photos/300/300?random=77',
          category: 'Books',
          description: 'The Complete Guide to Large-Scale Distributed Systems',
          features: ['System Design Patterns', 'Real-World Examples', 'Expert Insights', 'Industry Standard', 'Comprehensive Coverage', 'Future-Proof Concepts'],
          rating: 4.9,
          reviews: 6789
        },
        {
          id: 88,
          name: 'Coursera Plus Annual Subscription',
          price: 399.00,
          image: 'https://picsum.photos/300/300?random=78',
          category: 'Books',
          description: 'Unlimited Access to 7000+ Courses from Top Universities',
          features: ['University Certificates', 'Hands-on Projects', 'Industry Recognition', 'Mobile Learning', 'Expert Instructors', 'Career Support'],
          rating: 4.7,
          reviews: 34567
        },
        {
          id: 89,
          name: 'MasterClass All-Access Pass',
          price: 180.00,
          image: 'https://picsum.photos/300/300?random=79',
          category: 'Books',
          description: 'Learn from the World\'s Best Experts (Annual)',
          features: ['180+ Classes', 'Celebrity Instructors', 'Mobile & TV Apps', 'Offline Viewing', 'Community Access', 'New Classes Monthly'],
          rating: 4.6,
          reviews: 23456
        },
        
        // Advanced Audio & Music
        {
          id: 90,
          name: 'Audio-Technica AT2020USB+',
          price: 169.00,
          image: 'https://picsum.photos/300/300?random=80',
          category: 'Music',
          description: 'Professional USB Condenser Microphone',
          features: ['Studio Quality', 'USB & XLR Output', 'Zero-latency Monitoring', 'A/D Converter', 'Podcast Ready', 'Professional Grade'],
          rating: 4.7,
          reviews: 8901
        },
        {
          id: 91,
          name: 'Focal Clear MG Professional',
          price: 1499.00,
          image: 'https://picsum.photos/300/300?random=81',
          category: 'Music',
          description: 'Open-back High-End Headphones for Audio Professionals',
          features: ['Magnesium Drivers', 'Open-back Design', 'Professional Mixing', 'Comfort Headband', 'Detachable Cable', 'French Engineering'],
          rating: 4.9,
          reviews: 1234
        },
        
        // Home Automation & Security
        {
          id: 92,
          name: 'SimpliSafe 12-Piece Security System',
          price: 299.99,
          image: 'https://picsum.photos/300/300?random=82',
          category: 'Home',
          description: 'Complete Wireless Home Security System',
          features: ['24/7 Monitoring', '12 Sensors Included', 'Mobile App Control', 'No Long-term Contract', 'Easy DIY Setup', 'Award Winning'],
          rating: 4.6,
          reviews: 12345
        },
        {
          id: 93,
          name: 'Ubiquiti Dream Machine Pro',
          price: 449.00,
          image: 'https://picsum.photos/300/300?random=83',
          category: 'Electronics',
          description: 'Enterprise Network Management & Security Gateway',
          features: ['10Gbps Switching', 'IDS/IPS Engine', 'Network Video Recorder', 'VPN Server', 'Cloud Management', 'Enterprise Grade'],
          rating: 4.8,
          reviews: 3210
        },
        
        // Sustainable Tech & Eco Products
        {
          id: 94,
          name: 'Fairphone 4 Sustainable Smartphone',
          price: 579.00,
          image: 'https://picsum.photos/300/300?random=84',
          category: 'Electronics',
          description: 'Modular, Repairable, Ethically Sourced Smartphone',
          features: ['Modular Design', 'Fair Materials', '5-Year Warranty', 'Removable Battery', 'Recycled Plastics', 'Social Impact'],
          rating: 4.4,
          reviews: 2876
        },
        {
          id: 95,
          name: 'Goal Zero Yeti 1500X Power Station',
          price: 1999.95,
          image: 'https://picsum.photos/300/300?random=85',
          category: 'Travel',
          description: 'Portable Solar Generator for Off-Grid Power',
          features: ['1516Wh Capacity', 'Solar Charging', 'Multiple Outlets', 'WiFi App Control', 'Silent Operation', 'Emergency Ready'],
          rating: 4.7,
          reviews: 4321
        },
        
        // Final Premium Tech Items
        {
          id: 96,
          name: 'Synology DS923+ NAS',
          price: 569.99,
          image: 'https://picsum.photos/300/300?random=86',
          category: 'Electronics',
          description: '4-Bay Network Attached Storage for Home & Office',
          features: ['4-Bay Design', 'AMD Ryzen R1600', 'Scalable Storage', 'Data Protection', 'Media Server', 'Remote Access'],
          rating: 4.8,
          reviews: 5432
        },
        {
          id: 97,
          name: 'Fluke 87V Digital Multimeter',
          price: 425.00,
          image: 'https://picsum.photos/300/300?random=87',
          category: 'Electronics',
          description: 'Industrial True-RMS Digital Multimeter',
          features: ['True RMS', 'Temperature Measurement', 'Frequency Counter', '4000 Count Display', 'Safety Rated', 'Lifetime Warranty'],
          rating: 4.9,
          reviews: 1876
        },
        {
          id: 98,
          name: 'Anker SOLIX F2000 Power Station',
          price: 1599.00,
          image: 'https://picsum.photos/300/300?random=88',
          category: 'Electronics',
          description: '2048Wh LiFePO4 Portable Power Station',
          features: ['2048Wh Capacity', 'LiFePO4 Battery', '2400W Output', 'Solar Input', '10-Year Warranty', 'UPS Function'],
          rating: 4.6,
          reviews: 3456
        },
        {
          id: 99,
          name: 'Teenage Engineering OP-1 Field',
          price: 2299.00,
          image: 'https://picsum.photos/300/300?random=89',
          category: 'Music',
          description: 'Portable Synthesizer, Sampler & Controller',
          features: ['Synthesizer Engine', '8-Track Sequencer', 'Built-in Microphone', 'FM Radio', 'Bluetooth MIDI', 'Creative Workflow'],
          rating: 4.7,
          reviews: 987
        },
        {
          id: 100,
          name: 'DJI Pocket 2 Creator Combo',
          price: 769.00,
          image: 'https://picsum.photos/300/300?random=90',
          category: 'Electronics',
          description: 'Ultra-Compact 4K Camera with Gimbal Stabilization',
          features: ['4K/64MP Camera', '3-Axis Gimbal', 'ActiveTrack 3.0', 'Tiny Size', 'Creator Combo', 'Pro Modes'],
          rating: 4.8,
          reviews: 6543
        }
      ];
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCheckout = () => {
    // Create Amazon search query with all cart items
    const searchQuery = cart.map(item => item.name).join(' ');
    const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}`;
    
    // Show confirmation
    const userConfirm = window.confirm(`Total: $${getTotalPrice()}\n\nClick OK to search these items on Amazon for real purchase.\n\nItems: ${cart.map(item => `\n- ${item.name} (x${item.quantity})`).join('')}`);
    
    if (userConfirm) {
      window.open(amazonUrl, '_blank');
      setCart([]);
      setCartOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="shop-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      {/* Hero Section */}
      <section className="shop-hero animate-fade-in-down">
        <div className="container">
          <div className="hero-content">
            <h1 className="shop-title text-gradient">🛍️ NewsBoard Shop</h1>
            <p className="shop-subtitle">
              Discover amazing products for developers, readers, and tech enthusiasts!
            </p>
            <div className="creator-badge animate-bounce-in">
              <span>🚀 Curated by MD Shakib</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="shop-filters animate-fade-in-up animate-delay-1">
        <div className="container">
          <div className="filters-bar">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>

            <div className="category-filters">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''} animate-slide-in animate-delay-${index + 2}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Cart Button */}
            <button 
              className="cart-button hover-glow"
              onClick={() => setCartOpen(!cartOpen)}
            >
              🛒 Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`product-card card-animated hover-lift animate-zoom-in animate-delay-${index + 1}`}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <button 
                      className="quick-view-btn btn-animated"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  
                  {/* Features List */}
                  {product.features && (
                    <div className="product-features">
                      <h6 className="features-title">Key Features:</h6>
                      <ul className="features-list">
                        {product.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="feature-item">
                            <i className="fas fa-check-circle"></i>
                            {feature}
                          </li>
                        ))}
                        {product.features.length > 3 && (
                          <li className="feature-more">
                            +{product.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="rating-text">({product.reviews} reviews)</span>
                  </div>

                <div className="product-footer">
                    <div className="product-price">${product.price}</div>
                    <div className="product-actions">
                      <button 
                        className="add-to-cart-btn btn-animated hover-glow"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <a 
                        href={`https://www.amazon.com/s?k=${encodeURIComponent(product.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="buy-now-btn btn-animated hover-glow"
                        style={{
                          marginLeft: '10px',
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          display: 'inline-block',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shopping Cart Sidebar */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-sidebar animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3>🛒 Shopping Cart</h3>
              <button className="close-cart" onClick={() => setCartOpen(false)}>✕</button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                  <span>🛒</span>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item animate-fade-in">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>${item.price}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: ${getTotalPrice()}</strong>
                </div>
                <button className="checkout-btn btn-animated hover-glow" onClick={handleCheckout}>
                  Checkout 💳
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
