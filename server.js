require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB pakai env variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, // Boleh dihapus kalau muncul warning, tapi tidak error
  useUnifiedTopology: true // Boleh dihapus juga kalau warning
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test endpoint untuk cek apakah backend running
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Test endpoint untuk cek koneksi MongoDB
app.get('/test-db', async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();
    res.json({ success: true, message: 'MongoDB connection successful!', result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'MongoDB connection failed', error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
