require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`+' '+`http://localhost:${PORT}`));
})
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// Example route
app.get('/', (req, res) => res.send("API running"));



