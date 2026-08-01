require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

async function seedData() {
  const adminUser = await User.findOne({ email: 'admin@store.com' });
  if (!adminUser) {
    await User.create({
      email: 'admin@store.com',
      password: await bcrypt.hash('admin123', 10),
      fullName: 'Demo Admin',
      role: 'admin',
    });
    console.log('Created admin user: admin@store.com / admin123');
  } else {
    console.log('Admin user already exists');
  }

  const categories = [
    { name: 'Audio', slug: 'audio', description: 'Headphones, speakers and immersive sound', image_url: 'https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Wearables', slug: 'wearables', description: 'Smart watches and everyday tech', image_url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Footwear', slug: 'footwear', description: 'Sneakers built for comfort and style', image_url: 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Accessories', slug: 'accessories', description: 'Bags, wallets and everyday carry', image_url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ];

  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.insertMany(categories);
    console.log('Inserted categories');
  } else {
    console.log('Categories already exist');
  }

  const categoriesMap = Object.fromEntries((await Category.find()).map((cat) => [cat.slug, cat._id.toString()]));

  const products = [
    {
      name: 'Studio Over-Ear Headphones',
      slug: 'studio-over-ear-headphones',
      description: 'Reference-grade drivers with active noise cancellation and 40 hours of battery life.',
      price: 279,
      stock: 24,
      image_url: 'https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: ['https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=800'],
      category_id: categoriesMap.audio,
      rating: 4.8,
      featured: true,
    },
    {
      name: 'Compact Bluetooth Speaker',
      slug: 'compact-bluetooth-speaker',
      description: 'Room-filling sound in a pocketable, water-resistant body.',
      price: 119,
      stock: 42,
      image_url: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: ['https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=800'],
      category_id: categoriesMap.audio,
      rating: 4.5,
      featured: true,
    },
    {
      name: 'Everyday Smart Watch',
      slug: 'everyday-smart-watch',
      description: 'Health tracking, notifications and a seven-day battery.',
      price: 249,
      stock: 18,
      image_url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800'],
      category_id: categoriesMap.wearables,
      rating: 4.6,
      featured: true,
    },
    {
      name: 'Classic Court Sneakers',
      slug: 'classic-court-sneakers',
      description: 'Full-grain leather uppers on a cushioned cupsole.',
      price: 149,
      stock: 32,
      image_url: 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: ['https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=800'],
      category_id: categoriesMap.footwear,
      rating: 4.4,
      featured: true,
    },
    {
      name: 'Leather Weekender Bag',
      slug: 'leather-weekender-bag',
      description: 'Vegetable-tanned leather that ages beautifully.',
      price: 320,
      stock: 12,
      image_url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800'],
      category_id: categoriesMap.accessories,
      rating: 4.9,
      featured: true,
    },
  ];

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(products);
    console.log('Inserted products');
  } else {
    console.log('Products already exist');
  }
}

connectDB()
  .then(seedData)
  .catch((err) => {
    console.error('Seed failed:', err);
  })
  .finally(() => {
    process.exit(0);
  });
