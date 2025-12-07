const mongoose = require("mongoose");
require("dotenv").config();
const { Product } = require("./models");

const products = [

  // ======================
  // ELECTRONICS (7)
  // ======================
  { title: "boAt Airdopes 141 ANC", price: 1499, mrp: 7990, discountPercent: 81, brand: "boAt", stock: 250, sku: "EL001", category: "Electronics", images: ["https://www.boat-lifestyle.com/cdn/shop/files/Artboard2_6e01a0c6-18c1-48c0-9ad1-3ca99461c116_800x.jpg?v=1745907531"] },
  { title: "Sony WH-CH720N Headphones", price: 8990, mrp: 14990, discountPercent: 40, brand: "Sony", stock: 80, sku: "EL002", category: "Electronics", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSZUEDmLdvgvGoMD5V0tmBwbXP5pWUe3KSqw&s"] },
  { title: "Logitech MX Master 3S Mouse", price: 9499, mrp: 12499, discountPercent: 24, brand: "Logitech", stock: 120, sku: "EL003", category: "Electronics", images: ["https://m.media-amazon.com/images/I/61jFSvCTfpL.jpg"] },
  { title: "Samsung 32-inch Smart TV", price: 24999, mrp: 39999, discountPercent: 37, brand: "Samsung", stock: 50, sku: "EL004", category: "Electronics", images: ["https://rukminim2.flixcart.com/image/480/640/xif0q/television/k/h/w/-original-imah3868qdatnqg8.jpeg?q=90"] },
  { title: "JBL Flip 6 Speaker", price: 8999, mrp: 12999, discountPercent: 31, brand: "JBL", stock: 30, sku: "EL005", category: "Electronics", images: ["https://m.media-amazon.com/images/I/81nT721hWGL.jpg"] },
  { title: "Sandisk 1TB Portable SSD", price: 8999, mrp: 15999, discountPercent: 44, brand: "Sandisk", stock: 60, sku: "EL006", category: "Electronics", images: ["https://img.tatacliq.com/images/i7/437Wx649H/MP000000010634708_437Wx649H_202109172206084.jpeg"] },
  { title: "HP Wireless Keyboard & Mouse Combo", price: 1299, mrp: 2499, discountPercent: 48, brand: "HP", stock: 150, sku: "EL007", category: "Electronics", images: ["https://5.imimg.com/data5/SELLER/Default/2020/12/JO/AQ/XL/2929960/hpcs10.jpeg"] },

  // ======================
  // FASHION (7)
  // ======================
  { title: "Allen Solly Formal Shirt", price: 999, mrp: 2499, discountPercent: 60, brand: "Allen Solly", stock: 300, sku: "FA001", category: "Fashion", images: ["https://tiimg.tistatic.com/fp/1/007/993/full-sleeves-casual-wear-multicolor-cotton-allensolly-shirts-613.jpg"] },
  { title: "Nike Air Max 270 Shoes", price: 7999, mrp: 14995, discountPercent: 47, brand: "Nike", stock: 150, sku: "FA002", category: "Fashion", images: ["https://cdn-images.farfetch-contents.com/22/82/29/34/22822934_52827180_600.jpg"] },
  { title: "Levi’s 511 Slim Fit Jeans", price: 1799, mrp: 3999, discountPercent: 55, brand: "Levi's", stock: 280, sku: "FA003", category: "Fashion", images: ["https://levi.in/cdn/shop/files/182981482_01_Front_4b14f5bd-3c6a-4603-acda-096c5675d825.jpg?v=1740488440"] },
  { title: "Ray-Ban Aviator Sunglasses", price: 4899, mrp: 8999, discountPercent: 46, brand: "Ray-Ban", stock: 90, sku: "FA004", category: "Fashion", images: ["https://finebuy.co.in/wp-content/uploads/2025/08/rayban.webp"] },
  { title: "Puma Black Hoodie", price: 2499, mrp: 3999, discountPercent: 38, brand: "Puma", stock: 200, sku: "FA005", category: "Fashion", images: ["https://img.tatacliq.com/images/i8/1348Wx2000H/MP000000012901898_1348Wx2000H_202204222111061.jpeg"] },
  { title: "HRX Running Trackpants", price: 1199, mrp: 1999, discountPercent: 40, brand: "HRX", stock: 220, sku: "FA006", category: "Fashion", images: ["https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/32032710/2025/3/17/2c947a44-3c4d-4546-bc4f-b4b78a3a26921742190387387-HRX-by-Hrithik-Roshan-Men-Track-Pants-1441742190386551-1.jpg"] },
  { title: "H&M Cotton T-Shirt", price: 699, mrp: 1299, discountPercent: 46, brand: "H&M", stock: 350, sku: "FA007", category: "Fashion", images: ["https://image.hm.com/assets/hm/61/0e/610e43c0b1179ce60775b9f77a4d4eddc32b7c02.jpg?imwidth=2160"] },

  // ======================
  // HOME & LIVING (7)
  // ======================
  { title: "Bombay Dyeing Bedsheet Set", price: 799, mrp: 1999, discountPercent: 60, brand: "Bombay Dyeing", stock: 567, sku: "HL001", category: "Home & Living", images: ["https://m.media-amazon.com/images/I/7101yZJcdML.jpg"] },
  { title: "Prestige Induction Cooktop", price: 2199, mrp: 3695, discountPercent: 40, brand: "Prestige", stock: 312, sku: "HL002", category: "Home & Living", images: ["https://assets.nikshanonline.com/wp-content/uploads/2023/09/Prestige-Rio-Induction-Cooktop-Black-Push-Button-4.png"] },
  { title: "Milton Copper Water Bottle", price: 799, mrp: 1499, discountPercent: 47, brand: "Milton", stock: 800, sku: "HL003", category: "Home & Living", images: ["https://kitchenmart.co.in/cdn/shop/products/milton-copper-water-bottle-920-ml-sf-milton-copper-bottle-1000-1100-3602155896922_600x.jpg?v=1607743527"] },
  { title: "Philips LED Bulb Pack of 4", price: 499, mrp: 999, discountPercent: 50, brand: "Philips", stock: 1200, sku: "HL004", category: "Home & Living", images: ["https://m.media-amazon.com/images/I/61qD5wC1TuL._AC_UF1000,1000_QL80_.jpg"] },
  { title: "Borosil Lunch Box", price: 999, mrp: 1599, discountPercent: 37, brand: "Borosil", stock: 260, sku: "HL005", category: "Home & Living", images: ["https://m.media-amazon.com/images/I/61bwleYoRJL._AC_UF894,1000_QL80_.jpg"] },
  { title: "Cello 3-Piece Container Set", price: 599, mrp: 999, discountPercent: 40, brand: "Cello", stock: 200, sku: "HL007", category: "Home & Living", images: ["https://m.media-amazon.com/images/I/61aMHcfY7iL._SX679_.jpg"] },

  // ======================
  // SPORTS (5)
  // ======================
  { title: "Yonex Astrox 99 Pro Racket", price: 12490, mrp: 18990, discountPercent: 34, brand: "Yonex", stock: 67, sku: "SP001", category: "Sports", images: ["https://i.ytimg.com/vi/D1TCB6BfLCU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDtLSYJIHZd-E9TTJbgSnbGVoZHNQ"] },
  { title: "Nivia Storm Football", price: 549, mrp: 1099, discountPercent: 50, brand: "Nivia", stock: 789, sku: "SP002", category: "Sports", images: ["https://m.media-amazon.com/images/I/81g75eWa9nL._SX679_.jpg"] },
  { title: "Adidas Running Shoes", price: 3999, mrp: 7999, discountPercent: 50, brand: "Adidas", stock: 200, sku: "SP003", category: "Sports", images: ["https://img.tatacliq.com/images/i18//437Wx649H/MP000000022902708_437Wx649H_202407131602401.jpeg"] },
  { title: "Cosco Cricket Bat", price: 2499, mrp: 3999, discountPercent: 37, brand: "Cosco", stock: 150, sku: "SP004", category: "Sports", images: ["https://www.sportsuncle.com/image/cache/catalog/images/mrf/mrf_virat_kohli_genius_grand_edition_english_willow_bat3_-1200x1200.webp"] },
  { title: "Puma Training Gloves", price: 799, mrp: 1499, discountPercent: 47, brand: "Puma", stock: 300, sku: "SP005", category: "Sports", images: ["https://img.tatacliq.com/images/i7/1348Wx2000H/MP000000009854212_1348Wx2000H_202106251715072.jpeg"] },

  // ======================
  // BEAUTY (4)
  // ======================
  { title: "Mamaearth Onion Hair Oil", price: 349, mrp: 599, discountPercent: 42, brand: "Mamaearth", stock: 800, sku: "BE001", category: "Beauty", images: ["https://m.media-amazon.com/images/I/41O3ZL9Np0L._SY300_SX300_QL70_FMwebp_.jpg"] },
  { title: "Lakmé Sun Expert SPF 50", price: 499, mrp: 750, discountPercent: 33, brand: "Lakmé", stock: 500, sku: "BE002", category: "Beauty", images: ["https://images-static.nykaa.com/media/catalog/product/f/3/f3158848901030732386_3.jpg?tr=w-500"] },
  { title: "Maybelline Fit Me Foundation", price: 499, mrp: 799, discountPercent: 38, brand: "Maybelline", stock: 600, sku: "BE004", category: "Beauty", images: ["https://m.media-amazon.com/images/I/418-0bNNQgL.jpg"] },

  // ======================
  // MOBILES (5)
  // ======================
  { title: "iPhone 15 Pro Max", price: 134900, mrp: 159900, discountPercent: 16, brand: "Apple", stock: 30, sku: "MB001", category: "Mobiles", images: ["https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSOzYaUpgO2Gz4nySLiaWDJaPOFDYBrwAJOFHgDkL6z3r3LQCz8OVfxgiQXs7yAdNR4JSjy-d4iVjgoGKUaIuCUO1aiMn-fDXPzxQzWvaGUrWF-AcduSkDwbdfFyw&usqp=CAc"] },
  { title: "Samsung Galaxy S24 Ultra", price: 129999, mrp: 144999, discountPercent: 10, brand: "Samsung", stock: 25, sku: "MB002", category: "Mobiles", images: ["https://in.static.webuy.com/product_images/Phones/Phones%20Android/SSAMS928B256GTGUNLC_l.jpg"] },
  { title: "OnePlus 12 (16 GB)", price: 59999, mrp: 69999, discountPercent: 14, brand: "OnePlus", stock: 85, sku: "MB003", category: "Mobiles", images: ["https://kirtisales.in/wp-content/uploads/2024/04/OnePlus-12-R-16GB-256GB.jpg"] },
  { title: "Google Pixel 8 Pro", price: 99999, mrp: 116999, discountPercent: 15, brand: "Google", stock: 40, sku: "MB004", category: "Mobiles", images: ["https://in.static.webuy.com/product_images/Phones/Phones%20Android/SGOOPIX8P256GBUNLB_l.jpg"] },
  { title: "Realme 12 Pro", price: 24999, mrp: 29999, discountPercent: 17, brand: "Realme", stock: 120, sku: "MB005", category: "Mobiles", images: ["https://rukminim2.flixcart.com/image/480/640/xif0q/mobile/l/x/c/-original-imagx6rdpmhuq5ba.jpeg?q=90"] },

  // ======================
  // APPLIANCES (4)
  // ======================
  { title: "Philips Air Fryer 7L", price: 7495, mrp: 11995, discountPercent: 37, brand: "Philips", stock: 145, sku: "AP001", category: "Appliances", images: ["https://m.media-amazon.com/images/I/31ZYEKZpSrL._SY300_SX300_QL70_FMwebp_.jpg"] },
  { title: "Bajaj Mixer Grinder 750W", price: 2899, mrp: 4999, discountPercent: 42, brand: "Bajaj", stock: 234, sku: "AP002", category: "Appliances", images: ["https://m.media-amazon.com/images/I/51BNv1auG3L._SL1500_.jpg"] },
  { title: "Kent Grand RO Purifier", price: 14999, mrp: 21999, discountPercent: 32, brand: "Kent", stock: 80, sku: "AP003", category: "Appliances", images: ["https://m.media-amazon.com/images/I/51QKssxgAyL._SX522_.jpg"] },
  { title: "Havells Ceiling Fan", price: 2899, mrp: 4999, discountPercent: 42, brand: "Havells", stock: 300, sku: "AP004", category: "Appliances", images: ["https://jamesandco.in/wp-content/uploads/2024/09/71W-NXTIBKL._SL1500.jpg"] },

  // ======================
  // BOOKS (7)
  // ======================
  { title: "Atomic Habits", price: 419, mrp: 799, discountPercent: 48, brand: "Penguin", stock: 1200, sku: "BK001", category: "Books", images: ["https://m.media-amazon.com/images/I/817HaeblezL._AC_UF1000,1000_QL80_.jpg"] },
  { title: "Rich Dad Poor Dad", price: 399, mrp: 799, discountPercent: 50, brand: "Manjul", stock: 890, sku: "BK002", category: "Books", images: ["https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR3dNDjL2RQIkPqUoHbOhJz2xg40HdryZISclh1AVo_oUXhvGvS"] },
  { title: "Ikigai (Hindi)", price: 299, mrp: 599, discountPercent: 50, brand: "Manjul", stock: 1100, sku: "BK003", category: "Books", images: ["https://cdn.penguin.co.in/wp-content/uploads/2023/11/9780143463825.jpg"] },
  { title: "Psychology of Money", price: 399, mrp: 699, discountPercent: 43, brand: "Jaico", stock: 950, sku: "BK004", category: "Books", images: ["https://www.ooijianhui.com/content/images/size/w2000/2024/02/the-psy-of-money.png"] },
  { title: "Do Epic Shit", price: 299, mrp: 499, discountPercent: 40, brand: "Ankur Warikoo", stock: 650, sku: "BK005", category: "Books", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjRwNNd8uZ2PreBRZrgiB_AaBlQwHc_jvd_pRQ82NYZXA94ADFW-7ViLaMAwEemOwSHwc&usqp=CAU"] },
  { title: "Think and Grow Rich", price: 349, mrp: 799, discountPercent: 56, brand: "Napoleon Hill", stock: 700, sku: "BK006", category: "Books", images: ["https://m.media-amazon.com/images/I/61IxJuRI39L.jpg"] },
  { title: "Deep Work", price: 449, mrp: 899, discountPercent: 50, brand: "Cal Newport", stock: 500, sku: "BK007", category: "Books", images: ["https://5.imimg.com/data5/SELLER/Default/2022/2/JN/OT/TH/147304712/whatsapp-image-2022-02-11-at-3-26-48-pm.jpeg"] },

];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Seeded ALL products successfully!");
    process.exit();
  } catch (err) {
    console.error("Seed Error:", err);
    process.exit(1);
  }
};

seed();
