const User = require("../models/user.model.js");
class UserSerivce {
  static async findOne(username) {
    try {
      const doc = await User.findOne({ telegram_username: username });
      return doc;
    } catch (error) {
      console.log(error);
    }
  }
  static async create(payload) {
    try {
      const doc = await User.create(payload);
      return doc;
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = UserSerivce;
