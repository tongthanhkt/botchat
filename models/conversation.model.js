const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conversationSchema = new mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    bot_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    telegram_chat_id: {
      type: String,
      required: true,
    },
    oepenai_thread_id: {
      type: String,
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
