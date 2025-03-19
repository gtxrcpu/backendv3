require('dotenv').config(); // Load variabel dari .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Koneksi ke MongoDB pakai variabel di .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Import routes
const chatRoutes = require('./routes/chatbot');
const commentRoutes = require('./routes/comments');
const ratingRoutes = require('./routes/rating');

// ✅ Gunakan routes
app.use('/chatbot', chatRoutes);
app.use('/comments', commentRoutes);
app.use('/rating', ratingRoutes);

// ✅ Endpoint root opsional
app.get('/', (req, res) => {
  res.send('🚀 Backend Server is running and connected to MongoDB!');
});

// ✅ Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
