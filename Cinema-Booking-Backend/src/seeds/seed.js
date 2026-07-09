require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const seed = async () => {
  // 1. konek ke DB (pakai MONGO_URI dari .env)
  await mongoose.connect(process.env.MONGO_URI);

  // 2. bersihkan user lama supaya seed bisa diulang tanpa error "email duplikat"
  await User.deleteMany({});   // hati-hati: ini menghapus SEMUA user. Aman untuk DB challenge.

  // 3. hash password (cara yang SAMA seperti register, supaya login jalan)
  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass  = await bcrypt.hash("user123", 10);

  // 4. buat 1 admin + 2 user normal (PDF §11.7 minta minimal segini)
  await User.create([
    { name: "Admin",   email: "admin@kada.com", password: adminPass, role: "admin" }, // ← role admin di-set DI SINI
    { name: "User One", email: "user1@kada.com", password: userPass,  role: "user" },
    { name: "User Two", email: "user2@kada.com", password: userPass,  role: "user" },
  ]);

  console.log("Seed selesai: 1 admin + 2 user dibuat");
  await mongoose.disconnect();
};

seed().catch((err) => { console.error(err); process.exit(1); });