const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

// Connection string từ MongoDB Atlas
const mongoUri = 'mongodb+srv://technew280602:loforShyNPAZ0Elr@drive.7i6fhpz.mongodb.net/';

// Kết nối đến MongoDB Atlas
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Tạo schema và model
const linkSchema = new mongoose.Schema({
  name: String,
  url: String,
  createdAt: { type: Date, default: Date.now }
});

const Link = mongoose.model('Link', linkSchema);

app.use(cors()); 
// Middleware để phân tích body của request
app.use(express.json());

// API để lưu link và thời gian
app.post('/api/links', async (req, res) => {
    const { name, url } = req.body; // Lấy cả name và url từ body của request
    const newLink = new Link({ name, url });
    await newLink.save();
    res.status(201).json(newLink);
  });

// API để lấy link bằng ID
app.get('/api/links/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const link = await Link.findById(id);
    if (link) {
      res.json(link);
    } else {
      res.status(404).json({ message: 'Link not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid ID' });
  }
});

// API để lấy tất cả các link
app.get('/api/links', async (req, res) => {
    try {
      const links = await Link.find(); // Lấy tất cả các link từ cơ sở dữ liệu
      res.json(links);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/links/:id', async (req, res) => {
    const { id } = req.params;
  try {
    const link = await Link.findByIdAndDelete(id);
    if (link) {
      res.json({resulst: true, message:"success"});
    } else {
      res.status(404).json({ message: 'Link not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid ID' });
  }
  });
  
// Bắt đầu server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
