require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import Models
const Comment = require("./models/Comment");
const Rating = require("./models/rating");
const ChatHistory = require("./models/ChatHistory");

// ================= ROUTES ================= //

// 📌 Fetch All Comments (Newest First)
app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    res.status(500).json({ error: "Gagal mengambil komentar" });
  }
});

// 📌 Add New Comment
app.post("/comments", async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Nama dan pesan tidak boleh kosong" });
  }

  try {
    const newComment = new Comment({ name, message, createdAt: new Date() });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error("❌ Error menambah komentar:", error);
    res.status(500).json({ error: "Gagal menambah komentar" });
  }
});

// 📌 Fetch All Ratings + Hitung Rata-rata
app.get("/rating", async (req, res) => {
  try {
    const ratings = await Rating.find();

    if (!Array.isArray(ratings)) {
      return res.status(500).json({ error: "Data rating bukan array!" });
    }

    const totalVotes = ratings.length;
    const totalRating = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = totalVotes > 0 ? totalRating / totalVotes : 0;

    res.json({ averageRating, totalVotes, ratings });
  } catch (error) {
    console.error("❌ Error fetching ratings:", error);
    res.status(500).json({ error: "Gagal mengambil rating" });
  }
});

// 📌 Add New Rating
app.post("/rating", async (req, res) => {
  const { rating } = req.body; // GANTI KE 'rating' SESUAI SCHEMA
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating harus antara 1-5" });
  }

  try {
    const newRating = new Rating({ rating }); // PASTIKAN PAKAI 'rating'
    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    console.error("❌ Error menambah rating:", error);
    res.status(500).json({ error: "Gagal menambah rating" });
  }
});

// 📌 Chatbot API
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

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error saat request ke OpenRouter:", error.message);
    res.status(500).json({ error: "Gagal mendapatkan respons dari chatbot" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
