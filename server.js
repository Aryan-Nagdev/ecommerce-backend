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

// ----------------------  AUTH -------------------------

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashed });
    await user.save();

    res.json({ user: { id: user._id, name, email } });
  } catch {
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    res.json({ user: { id: user._id, name: user.name, email } });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

// ----------------------  PRODUCTS ---------------------

app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ---------------------- CART + ORDERS -----------------

// your remaining code stays EXACTLY THE SAME ↓↓↓ below
// (cart, order, etc… keep as your original)


// -----------------------------------------------------
// START SERVER
// -----------------------------------------------------
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));
