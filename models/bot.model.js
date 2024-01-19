const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const botSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  telegram_username: {
    type: String,
    required: true,
  },
  telegram_token: {
    type: String,
    default: Date.now,
  },
  openai_assistant_id: {
    type: String,
    required: true,
  },
});

const Bot = mongoose.model("Bot", botSchema);

module.exports = Bot;
