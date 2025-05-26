const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Employees = require("./api/models/employeeModel")
require('dotenv').config();


const createFirstAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

    const adminCount = await Employees.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      await Employees.create({
        email: process.env.INITIAL_ADMIN_EMAIL,
        // password: await bcrypt.hash(process.env.INITIAL_ADMIN_PASSWORD, 10),
        password:process.env.INITIAL_ADMIN_PASSWORD,
        username:process.env.INITIAL_ADMIN_USERNAME,
        role: "admin",
      });
      console.log("Initial admin created");
    } else {
      console.log("Admin already exists");
    }
  } catch (err) {
    console.error("Error during admin creation:", err);
  } finally {
    await mongoose.disconnect();
  }
};

createFirstAdmin();
