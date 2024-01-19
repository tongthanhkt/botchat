require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const { Telegraf } = require("telegraf");
const UserService = require("./services/user.service");
const BotSevice = require("./services/bot.service");
const MessageService = require("./services/message.service");
const ConversationService = require("./services/conversation.service");
const OpenAI = require("openai");
const Thread = require("./models/thread.model");
const ThreadService = require("./services/thread.service");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database OPENAI");
  })
  .catch((error) => {
    console.log(error);
  });
const ChatAiFactory = require("./services/ChatAiFactory.service");

// const BotTete = new Telegraf(process.env.BOT_TOKEN);
// BotTete.command("start", (ctx) => {
//   BotTete.telegram.sendMessage(
//     ctx.chat.id,
//     "Hello there! Welcome to the Code Capsules telegram bot.\nI respond to /ethereum. Please try it",
//     {}
//   );
// });

// BotTete.on("message", async (msg) => {
//   const chatInfo = msg.update.message.chat;
//   const messageInfo = msg.update.message;
//   const telegram = msg.telegram;
//   const botInfo = msg.botInfo;
//   const teleUser = msg.from;
//   const user = await UserService.findOne(teleUser.username);
//   const bot = await BotSevice.findOne(botInfo.username);
//   const conversation = await ConversationService.findOne({
//     user_id: user._id,
//     bot_id: bot._id,
//   });
//   const conversationPayload = {};
//   const messagePayload = {};
//   if (!user) {
//     const newUser = await UserService.create(message.from);
//     conversationPayload.user_id = newUser._id;
//   } else {
//     conversationPayload.user_id = user._id;
//   }
//   conversationPayload.bot_id = bot._id;
//   conversationPayload.telegram_chat_id = chatInfo.id;
//   conversationPayload.telegram_message_id = chatInfo.id;
//   if (!conversation) {
//     const newConversation = await ConversationService.create(
//       conversationPayload
//     );
//     messagePayload.conversation_id = newConversation._id;
//     messagePayload.from = bot._id;
//   } else {
//     messagePayload.conversation_id = conversation._id;
//   }
//   messagePayload.content = messageInfo.text;
//   messagePayload.from = bot._id;
//   messagePayload.type = "query";
//   MessageService.create(messagePayload);

//   try {
//     const openai = new OpenAI({
//       apiKey: process.env.OPEN_AI_API_KEY,
//     });
//     // const myAssistant = await openai.beta.assistants.create({
//     //   instructions:
//     //     "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
//     //   name: "Math Tutor",
//     //   tools: [{ type: "code_interpreter" }],
//     //   model: "gpt-3.5-turbo",
//     // });
//     let thread = await ThreadService.findOne({
//       user_id: user._id,
//       bot_id: bot._id,
//     });
//     if (!thread) {
//       const threadOpenAi = await openai.beta.threads.create();
//       thread = await ThreadService.create({
//         user_id: user._id,
//         bot_id: bot._id,
//         thread_id: threadOpenAi.id,
//       });
//     }
//     const message = await openai.beta.threads.messages.create(
//       thread.thread_id,
//       {
//         role: "user",
//         content: messageInfo.text,
//       }
//     );
//     const run = await openai.beta.threads.runs.create(thread.thread_id, {
//       assistant_id: bot.openai_assistant_id,
//     });

//     const isRunStatusOk = await checkRunstatus(
//       openai,
//       thread.thread_id,
//       run.id
//     );
//     if (isRunStatusOk) {
//       const messages = await openai.beta.threads.messages.list(
//         thread.thread_id,
//         {
//           limit: 1,
//         }
//       );

//       for (let i = 0; i < messages.data.length; i++) {
//         console.log(messages.data[i].content[0]);
//       }
//       msg.reply(messages.data[0].content[0].text.value);
//       MessageService.create({
//         conversation_id: conversationPayload.conversation_id,
//         from: user._id,
//         content: messages.data[0].content[0].text.value,
//         type: "response",
//       });
//       return messages.data[0].content[0];
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// BotTete.launch();
