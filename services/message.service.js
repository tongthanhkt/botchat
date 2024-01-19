const { model } = require("mongoose");
const Message = require("../models/message.model.js");
class MessageService {
  static async create(payload) {
    try {
      const doc = await Message.create(payload);
      return doc;
    } catch (error) {
      console.log(error);
    }
  }
  // static async findOne({from, }){
  //   try {
  //     const doc = await Message.findOne({
  //       from:
  //     });
  //     console.log("New Message", doc);
  //     return doc;
  //   } catch (error) {
  //     console.log(error);
  //   }
}
module.exports = MessageService;
