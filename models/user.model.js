const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    created_at: {
      type: Date,
      default: Date.now,
    },
    telegram_id: {
      type: String,
      required: true,
    },
    telegram_username: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
