const { Schema } = require("mongoose");
const Conversation = require("../models/conversation.model.js");
class ConversationService {
  static async create(payload) {
    try {
      const doc = await Conversation.create(payload);
      return doc;
    } catch (error) {
      console.log(error);
    }
  }
  static async findOne(filter) {
    try {
      const doc = await Conversation.findOne(filter);
      return doc;
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = ConversationService;
