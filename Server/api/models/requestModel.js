const mongoose = require("mongoose");
const { Schema } = mongoose;

const requests = new Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    unique: true,
    required: true,
  },
  
  date: {
    type: Date,
    required: true,
  },

  leaveType: {
    type: String,
    enum: ["Annual", "Casual"],
    required: true,
  },

  noOfDays: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },

  annual: {
    type: Number,
    required: true,
    min: 0,
    max: 7,
  },
  casual: {
    type: Number,
    required: true,
    min: 0,
    max: 14,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
  lastReset: {
    type: Date,
    default: new Date("2025-01-01"),
  },
});

const Requests = mongoose.model("request", requests);
module.exports = Requests;
