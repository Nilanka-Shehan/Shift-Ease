const mongoose = require("mongoose");
const { Schema } = mongoose;

const history = new Schema({
  empNumber: {
    type: Number,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
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
    enum: ["Accepted", "Rejected"],
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

  createdDate: {
    type: Date,
    default: new Date(),
  },
});

const History = mongoose.model("history", history);
module.exports = History;
