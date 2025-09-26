const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String }, // For demo only, use bcrypt in production
  role: { type: String, enum: ["student", "mentor"], required: true },
});

module.exports = mongoose.model("User", userSchema);
