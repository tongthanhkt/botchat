const { Telegraf } = require("telegraf");
const UserService = require("./user.service");
const BotSevice = require("./bot.service");
const MessageService = require("./message.service");
const ConversationService = require("./conversation.service");
const OpenAI = require("openai");
const Thread = require("../models/thread.model");
const ThreadService = require("./thread.service");
const Bot = require("../models/bot.model");
const Conversation = require("../models/conversation.model");
async function checkRunstatus(openai, thread_id, run_id) {
  const maxRetries = process.env.MAX_RETRIES || 10;
  const retryInterval = process.env.RETRY_INTERVAL || 5000; // 60 seconds

  for (let retryCount = 1; retryCount <= maxRetries; retryCount++) {
    try {
      const data = await openai.beta.threads.runs.retrieve(thread_id, run_id);
      if (data.status === "in_progress" || data.status === "queued") {
        console.log(
          `Attempt ${retryCount}: Status is still in progress. Waiting for ${
            retryInterval / 1000
          } seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      } else if (data.status === "completed") {
        console.log("Status is now completed. Data:", data);
        return data; // Return the final data on success
      } else {
        console.log(`Attempt ${retryCount}: Unexpected status: ${data.status}`);
        // Handle other statuses if needed
        return false;
      }
    } catch (error) {
      console.error(`Attempt ${retryCount}: Error fetching data:`, error);
      // Handle errors as needed
      return false;
    }
  }

  console.log(
    `Max retries (${maxRetries}) reached. Data is still in progress. Returning false.`
  );
  return false;
}
function createAssistant(assistantName, botToken) {
  return new ChatAiFactory(assistantName, botToken);
}
class ChatAiFactory {
  constructor(assistantName, botToken) {
    this.assistant = assistantName;
    this.botToken = botToken;
  }

  initChatAi() {
    const BotTete = new Telegraf(this.botToken);
    BotTete.command("start", (ctx) => {
      BotTete.telegram.sendMessage(
        ctx.chat.id,
        `Hello there! Here is Chat bot ${this.assistant}`,
        {}
      );
    });
    BotTete.on("message", async (msg) => {
      const chatInfo = msg.update.message.chat;
      const messageInfo = msg.update.message;
      const telegram = msg.telegram;
      const botInfo = msg.botInfo;
      const teleUser = msg.from;
      const user = await UserService.findOne(teleUser.username);
      const bot = await BotSevice.findOne(botInfo.username);
      const conversation = await ConversationService.findOne({
        user_id: user._id,
        bot_id: bot._id,
      });
      const conversationPayload = {};
      const messagePayload = {};
      if (!user) {
        const newUser = await UserService.create(message.from);
        conversationPayload.user_id = newUser._id;
      } else {
        conversationPayload.user_id = user._id;
      }
      conversationPayload.bot_id = bot._id;
      conversationPayload.telegram_chat_id = chatInfo.id;
      conversationPayload.telegram_message_id = chatInfo.id;
      if (!conversation) {
        const newConversation = await ConversationService.create(
          conversationPayload
        );
        messagePayload.conversation_id = newConversation._id;
        messagePayload.from = bot._id;
      } else {
        messagePayload.conversation_id = conversation._id;
      }
      messagePayload.content = messageInfo.text;
      messagePayload.from = bot._id;
      messagePayload.type = "query";
      MessageService.create(messagePayload);

      try {
        const openai = new OpenAI({
          apiKey: process.env.OPEN_AI_API_KEY,
        });
        // const myAssistant = await openai.beta.assistants.create({
        //   instructions:
        //     "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
        //   name: "Math Tutor",
        //   tools: [{ type: "code_interpreter" }],
        //   model: "gpt-3.5-turbo",
        // });
        let thread = await ThreadService.findOne({
          user_id: user._id,
          bot_id: bot._id,
        });
        if (!thread) {
          const threadOpenAi = await openai.beta.threads.create();
          thread = await ThreadService.create({
            user_id: user._id,
            bot_id: bot._id,
            thread_id: threadOpenAi.id,
          });
          Conversation.findOneAndUpdate(
            { user_id: user._id, bot_id: bot._id },
            { openai_thread_id: threadOpenAi.id }
          );
        }
        const message = await openai.beta.threads.messages.create(
          thread.thread_id,
          {
            role: "user",
            content: messageInfo.text,
          }
        );
        const run = await openai.beta.threads.runs.create(thread.thread_id, {
          assistant_id: bot.openai_assistant_id,
        });

        const isRunStatusOk = await checkRunstatus(
          openai,
          thread.thread_id,
          run.id
        );
        if (isRunStatusOk) {
          const messages = await openai.beta.threads.messages.list(
            thread.thread_id,
            {
              limit: 1,
            }
          );

          for (let i = 0; i < messages.data.length; i++) {}
          msg.reply(messages.data[0].content[0].text.value);
          MessageService.create({
            conversation_id: messagePayload.conversation_id,
            from: user._id,
            content: messages.data[0].content[0].text.value,
            type: "response",
          });
          return messages.data[0].content[0];
        }
      } catch (error) {
        console.log(error);
      }
    });
    BotTete.launch();
  }
}
async function initChatAiFactory() {
  const assistants = await Bot.find();

  console.log(assistants);
  for (let i = 0; i < assistants.length; i++) {
    const assistant = createAssistant(
      assistants[i].telegram_username,
      assistants[i].telegram_token
    );
    assistant.initChatAi();
  }
}

initChatAiFactory();
module.exports = ChatAiFactory;
