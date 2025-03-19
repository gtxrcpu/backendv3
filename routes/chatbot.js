const express = require('express');
const router = express.Router();
const axios = require('axios');
const ChatHistory = require('../models/ChatHistory');

router.post('/ask', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Request ke OpenRouter
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = response.data.choices[0]?.message?.content || 'No reply';

    // Simpan ke MongoDB
    const newChat = new ChatHistory({
      userMessage: message,
      botReply: botReply,
    });
    await newChat.save();

    res.json({ userMessage: message, botReply });
  } catch (error) {
    console.error('❌ Error sending message:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await ChatHistory.find().sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

module.exports = router;
