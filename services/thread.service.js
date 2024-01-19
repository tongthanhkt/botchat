const Thread = require("../models/thread.model");
class ThreadService {
  static async findOne({ user_id, bot_id }) {
    try {
      const doc = await Thread.findOne({ user_id, bot_id });
      return doc;
    } catch (error) {
      console.log(error);
    }
  }
  static async create({ user_id, bot_id, thread_id }) {
    try {
      const doc = await Thread.create({ user_id, bot_id, thread_id });
      return doc;
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = ThreadService;
