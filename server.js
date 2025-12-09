<<<<<<< HEAD
// server.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const express = require("express");
const cors = require("cors");
require("dotenv").config();
=======
// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

>>>>>>> fa61d550ed3de2912deb62516fcd8c4e4b882f00
const connectDB = require("./db");
const { User, Product, Cart, Order } = require("./models");
const bcrypt = require("bcryptjs");

const app = express();
connectDB();
<<<<<<< HEAD
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
=======

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
>>>>>>> fa61d550ed3de2912deb62516fcd8c4e4b882f00
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
<<<<<<< HEAD
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

// ---------------- PRODUCTS ----------------

=======
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({ user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

// ALL PRODUCTS
>>>>>>> fa61d550ed3de2912deb62516fcd8c4e4b882f00
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

<<<<<<< HEAD
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
=======
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
>>>>>>> fa61d550ed3de2912deb62516fcd8c4e4b882f00

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existing = cart.items.find(
<<<<<<< HEAD
      (i) => i.productId.toString() === product._id
    );

    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ productId: product._id, qty });
=======
      (i) => String(i.productId) === String(product._id)
    );

    if (existing) {
      existing.qty += addQty;
    } else {
      cart.items.push({ productId: product._id, qty: addQty });
>>>>>>> fa61d550ed3de2912deb62516fcd8c4e4b882f00
    }

    await cart.save();

<<<<<<< HEAD
    const updated = await Cart.findOne({ userId }).populate("items.productId");
    res.json(updated || { items: [] });
  } catch {
    res.status(500).json({ message: "Add to cart failed" });
=======
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
>>>>>>> fa61d550ed3de2912deb62516fcd8c4e4b882f00
  }
});

// UPDATE QTY
app.put("/api/cart", async (req, res) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> fa61d550ed3de2912deb62516fcd8c4e4b882f00
});

// CLEAR CART
app.delete("/api/cart/:userId", async (req, res) => {
  await Cart.deleteOne({ userId: req.params.userId });
  res.json({ message: "Cleared" });
});

<<<<<<< HEAD
// ---------------- ORDERS (FULLY FIXED) ----------------

=======
// PLACE ORDER
>>>>>>> fa61d550ed3de2912deb62516fcd8c4e4b882f00
app.post("/api/order/place", async (req, res) => {
  try {
    const { userId, items, total, address } = req.body;

<<<<<<< HEAD
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
=======
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
>>>>>>> fa61d550ed3de2912deb62516fcd8c4e4b882f00
    });

    await order.save();
    await Cart.deleteOne({ userId });

<<<<<<< HEAD
    res.json({ message: "Order placed", orderId: order._id });
  } catch (err) {
    console.log("Order Error:", err);
    res.status(500).json({ message: "Order failed" });
=======
    res.json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
>>>>>>> fa61d550ed3de2912deb62516fcd8c4e4b882f00
  }
});

// ORDER HISTORY
app.get("/api/orders/history/:userId", async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({
    createdAt: -1,
  });
<<<<<<< HEAD
  res.json(orders);
});


// ---------------- START SERVER ----------------
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));

=======
  res.json(orders || []);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
>>>>>>> fa61d550ed3de2912deb62516fcd8c4e4b882f00
