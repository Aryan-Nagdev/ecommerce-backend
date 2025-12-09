// server.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");
const { User, Product, Cart, Order } = require("./models");
const bcrypt = require("bcryptjs");

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

// ---------------- AUTH ----------------

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashed });
    await user.save();

    res.json({ user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ message: "Register failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

// ---------------- PRODUCTS ----------------

app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const p = await Product.findById(req.params.id);
  res.json(p || {});
});

app.get("/api/products/category/:cat", async (req, res) => {
  const cat = decodeURIComponent(req.params.cat).replace(/-/g, " ").trim();
  const products = await Product.find({
    category: { $regex: cat, $options: "i" },
  });
  res.json(products);
});

// ---------------- CART ----------------

// GET CART
app.get("/api/cart/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate(
    "items.productId"
  );
  res.json(cart || { items: [] });
});

// ADD TO CART (merge qty)
app.post("/api/cart", async (req, res) => {
  try {
    const { userId, product, qty } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existing = cart.items.find(
      (i) => i.productId.toString() === product._id
    );

    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ productId: product._id, qty });
    }

    await cart.save();

    const updated = await Cart.findOne({ userId }).populate("items.productId");
    res.json(updated || { items: [] });
  } catch {
    res.status(500).json({ message: "Add to cart failed" });
  }
});

// UPDATE QTY
app.put("/api/cart", async (req, res) => {
  const { userId, productId, qty } = req.body;

  await Cart.updateOne(
    { userId, "items.productId": productId },
    { $set: { "items.$.qty": qty } }
  );

  res.json({ message: "Updated" });
});

// REMOVE ITEM
app.delete("/api/cart", async (req, res) => {
  const { userId, productId } = req.body;

  await Cart.updateOne(
    { userId },
    { $pull: { items: { productId } } }
  );

  res.json({ message: "Removed" });
});

// CLEAR CART
app.delete("/api/cart/:userId", async (req, res) => {
  await Cart.deleteOne({ userId: req.params.userId });
  res.json({ message: "Cleared" });
});

// ---------------- ORDERS (FULLY FIXED) ----------------

app.post("/api/order/place", async (req, res) => {
  try {
    const { userId, items, total, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // ⭐ FIX: Save COMPLETE item details so order history works
    const formattedItems = items.map((i) => ({
      productId: i.productId,        // ID
      title: i.title,                // Name
      price: i.price,                // Price
      image: i.image,                // Image (FIXED)
      qty: i.qty                     // Quantity
    }));

    const order = new Order({
      userId,
      items: formattedItems,
      total,
      address,
      createdAt: new Date(),
    });

    await order.save();
    await Cart.deleteOne({ userId });

    res.json({ message: "Order placed", orderId: order._id });
  } catch (err) {
    console.log("Order Error:", err);
    res.status(500).json({ message: "Order failed" });
  }
});

// ORDER HISTORY
app.get("/api/orders/history/:userId", async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({
    createdAt: -1,
  });
  res.json(orders);
});


// ---------------- START SERVER ----------------
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));

