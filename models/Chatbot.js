const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // 'user' atau 'bot'
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Chatbot = mongoose.model("Chatbot", chatbotSchema);

module.exports = Chatbot;
