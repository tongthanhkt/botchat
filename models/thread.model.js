const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const threadSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  bot_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  thread_id: {
    type: String,
    required: true,
  },
});
const Thread = mongoose.model("Thread", threadSchema);
module.exports = Thread;
