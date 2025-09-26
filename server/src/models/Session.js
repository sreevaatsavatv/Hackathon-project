const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  student: { type: String, required: true },
  topic: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Session", sessionSchema);
