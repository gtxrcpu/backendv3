require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

// Import Models
const Comment = require("./models/Comment");
const Rating = require("./models/rating");
const ChatHistory = require("./models/ChatHistory");

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

// ===================== ROUTES =====================

// 🔹 Route: Ambil Semua Komentar
app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }); // Urutkan terbaru ke lama
    res.json(comments);
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    res.status(500).json({ error: "Gagal mengambil komentar" });
  }
});

// 🔹 Route: Tambah Komentar Baru
app.post("/comments", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Komentar tidak boleh kosong" });

  try {
    const newComment = new Comment({ text });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error("❌ Error menambahkan komentar:", error);
    res.status(500).json({ error: "Gagal menambahkan komentar" });
  }
});

// 🔹 Route: Ambil Rating
app.get("/rating", async (req, res) => {
  try {
    const ratings = await Rating.find();
    if (ratings.length === 0) return res.json({ rating: 0, voters: 0 });

    const total = ratings.reduce((acc, r) => acc + r.value, 0);
    const average = total / ratings.length;

    res.json({ rating: average.toFixed(1), voters: ratings.length });
  } catch (error) {
    console.error("❌ Error fetching rating:", error);
    res.status(500).json({ error: "Gagal mengambil rating" });
  }
});

// 🔹 Route: Tambah Rating Baru
app.post("/rating", async (req, res) => {
  const { value } = req.body;
  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ error: "Rating harus antara 1-5" });
  }

  try {
    const newRating = new Rating({ value });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    console.error("❌ Error menambahkan rating:", error);
    res.status(500).json({ error: "Gagal menambahkan rating" });
  }
});

// 🔹 Route: Ambil Riwayat Chat
app.get("/chatbot/history", async (req, res) => {
  try {
    const history = await ChatHistory.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    res.status(500).json({ error: "Gagal mengambil riwayat chat" });
  }
});

// 🔹 Route: Simpan Riwayat Chat & Kirim ke OpenRouter
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

    const botReply = response.data.choices[0].message.content;

    // Simpan ke database
    const newChat = new ChatHistory({ message: userMessage, response: botReply });
    await newChat.save();

    res.json({ message: botReply });
  } catch (error) {
    console.error("❌ Error saat request ke OpenRouter:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Terjadi kesalahan dalam mendapatkan respons dari chatbot" });
  }
});

// 🔹 Test API
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// ===================== START SERVER =====================
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
