require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database OPENAI");
  })
  .catch((error) => {
    console.log(error);
  });
const ChatAiFactory = require("./services/ChatAiFactory.service");
