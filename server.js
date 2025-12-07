// backend/server.js
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

// AUTH
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashed });

    await user.save();
    res.json({ user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({ user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// ALL PRODUCTS
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET PRODUCT BY ID
app.get("/api/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product || {});
});

// CATEGORY API — FLEXIBLE MATCH (RECOMMENDED)
app.get("/api/products/category/:cat", async (req, res) => {
  try {
    const cat = decodeURIComponent(req.params.cat)
      .replace(/-/g, " ")
      .trim();

    // FIX:Case-insensitive partial match, category filtering works 100%
    const products = await Product.find({
      category: { $regex: cat, $options: "i" },
    });

    res.json(products);
  } catch {
    res.json([]);
  }
});

// GET CART
app.get("/api/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate({
      path: "items.productId",
      select: "title price images",
    });

    if (!cart) return res.json({ items: [] });

    const items = cart.items.map((item) => ({
      _id: item.productId._id,
      title: item.productId.title,
      price: item.productId.price,
      images: item.productId.images,
      qty: item.qty,
    }));

    res.json({ items });
  } catch (err) {
    res.json({ items: [] });
  }
});

// ADD TO CART — SUPPORTS BULK QTY
app.post("/api/cart", async (req, res) => {
  try {
    const { userId, product, qty } = req.body;
    const addQty = Number(qty) || 1;

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existing = cart.items.find(
      (i) => String(i.productId) === String(product._id)
    );

    if (existing) {
      existing.qty += addQty;
    } else {
      cart.items.push({ productId: product._id, qty: addQty });
    }

    await cart.save();

    const populated = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title price images",
    });

    const items = populated.items.map((item) => ({
      _id: item.productId._id,
      title: item.productId.title,
      price: item.productId.price,
      images: item.productId.images,
      qty: item.qty,
    }));

    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// UPDATE QTY
app.put("/api/cart", async (req, res) => {
  try {
    const { userId, productId, qty } = req.body;

    await Cart.updateOne(
      { userId, "items.productId": productId },
      { $set: { "items.$.qty": qty } }
    );

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// REMOVE ITEM FROM CART
app.delete("/api/cart", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    await Cart.updateOne(
      { userId },
      { $pull: { items: { productId } } }
    );

    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// CLEAR CART
app.delete("/api/cart/:userId", async (req, res) => {
  await Cart.deleteOne({ userId: req.params.userId });
  res.json({ message: "Cleared" });
});

// PLACE ORDER
app.post("/api/order/place", async (req, res) => {
  try {
    const { userId, items, total, address } = req.body;

    const order = new Order({
      userId,
      items: items.map((i) => ({
        productId: i._id,
        title: i.title,
        price: i.price,
        image: i.images?.[0],
        qty: i.qty,
      })),
      total: Math.round(total * 0.9),
      address,
      status: "Confirmed",
    });

    await order.save();
    await Cart.deleteOne({ userId });

    res.json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// ORDER HISTORY
app.get("/api/orders/history/:userId", async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({
    createdAt: -1,
  });
  res.json(orders || []);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
