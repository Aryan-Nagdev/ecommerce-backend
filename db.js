// db.js — FIXED FOR MONGODB ATLAS TLS ON WINDOWS
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    await mongoose.connect(uri, {
      tls: true,
      tlsAllowInvalidCertificates: true,  // ← IMPORTANT FIX
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

module.exports = connectDB;
