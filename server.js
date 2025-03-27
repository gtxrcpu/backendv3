require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Penting untuk membaca JSON dari request body

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Debugging API Key OpenRouter
console.log("🔑 API Key OpenRouter:", process.env.OPENROUTER_API_KEY ? "Ditemukan" : "TIDAK ditemukan");

// Chatbot Route
app.post("/chatbot/ask", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Pesan tidak boleh kosong" });
  }

  console.log("📨 Mengirim pesan ke OpenRouter:", userMessage);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        messages: [{ role: "user", content: userMessage }],
        model: "gpt-3.5-turbo",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Response dari OpenRouter:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "❌ Error saat request ke OpenRouter:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Terjadi kesalahan dalam mendapatkan respons dari chatbot" });
  }
});

// Test API
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
