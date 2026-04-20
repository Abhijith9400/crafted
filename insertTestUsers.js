const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

async function insertTestUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  const hashedPassword = await bcrypt.hash("password", 10);

  await User.deleteMany({}); // Clear old users

  await User.create([
    { username: "admin", password: hashedPassword, role: "admin" },
    { studentId: "student123", password: hashedPassword, role: "student" }
  ]);

  console.log("✅ Test users inserted");
  mongoose.connection.close();
}

insertTestUsers();
