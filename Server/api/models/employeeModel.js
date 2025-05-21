const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const employees = new Schema({
  empNumber: {
    type: Number,
    trim: true,
    unique: true,
    required: function () {
      return this.role !== 'admin' &&!this.googleId;
    },
  },

  username: {
    type: String,
    trim: true,
    required: function () {
      // Require username only after setup (no token and no Google ID)
      return !this.googleId && !this.accountSetupToken && this.role !== 'admin';
    },
    minlength: 3,
  },

  password: {
    type: String,
    required: function () {
      // Required only after setup (no token and no Google ID)
      return !this.googleId && !this.accountSetupToken;
    },
    minlength: 6,
    maxlength: 128,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },

  accountSetupToken: {
    type: String,
    select: false, // Hide from queries by default
  },
  accountSetupExpires: {
    type: Date,
    select: false,
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values for non-Google users
  },

  photoURL: {
    type: String,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

// Add password hashing middleware
employees.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(new Error("Password hashing failed"));
  }
});

const Employees = mongoose.model("Employ", employees);
module.exports = Employees;
