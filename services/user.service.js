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
      const doc = await User.create({
        telegram_id: payload.id,
        telegram_username: payload.username,
        first_name: payload.first_name,
      });
      return doc;
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = UserSerivce;
