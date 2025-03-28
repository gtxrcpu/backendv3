const express = require('express');
const router = express.Router();
const Rating = require('../app/models/rating'); // Sesuaikan pathnya

// GET: Ambil semua rating dan hitung rata-rata
router.get('/', async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

// POST: Tambah rating baru
router.post('/', async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating harus antara 1-5" });
    }

    const newRating = new Rating({ rating });
    await newRating.save();
    res.status(201).json({ message: "Rating ditambahkan", rating: newRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
