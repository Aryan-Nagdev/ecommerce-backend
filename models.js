const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  brand: String,
  stock: { type: Number, default: 0 },
  sku: String,
  category: { type: String, default: 'Uncategorized' },
  images: { type: [String], default: [] },
  description: { type: String, default: '' },
}, { timestamps: true });

// CART (already fixed)
const CartSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    qty: { type: Number, default: 1 }
  }]
}, { timestamps: true });

// ✅ FIXED ORDER SCHEMA
const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    title: String,
    price: Number,
    image: String,   // <-- IMPORTANT
    qty: Number
  }],
  total: Number,
  status: { type: String, default: 'pending' },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Cart = mongoose.model('Cart', CartSchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = { User, Product, Cart, Order };
