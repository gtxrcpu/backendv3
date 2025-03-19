const express = require('express');
const router = express.Router();
const Rating = require('../models/rating');

// Route GET: Mengambil semua rating
router.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find();
    // Jika ingin mengembalikan semua data rating (untuk hitung rata-rata di frontend)
    res.json(ratings);
  } catch (err) {
    console.error('❌ Error fetching ratings:', err);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Route POST: Menyimpan rating baru
router.post('/', async (req, res) => {
  try {
    const { rating } = req.body; // ✅ Pastikan frontend kirim { rating: angka }
    if (!rating) {
      return res.status(400).json({ error: 'Rating is required' });
    }
    const newRating = new Rating({ rating });
    await newRating.save();
    res.status(201).json({ message: 'Rating saved successfully' });
  } catch (err) {
    console.error('❌ Error saving rating:', err);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

module.exports = router;
