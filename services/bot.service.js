const Bot = require("../models/bot.model.js");
class BotSevice {
  static async findOne(username) {
    try {
      const bot = await Bot.findOne({ telegram_username: username });
      return bot;
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = BotSevice;
