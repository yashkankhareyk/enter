const express = require('express');
const router = express.Router();
const upload = require('../uploads/multer-config');
const path = require('path');
const auth = require('../middleware/auth');

// POST route to handle image uploads
router.post('/upload', auth, upload.single('profilePicture'), (req, res) => { 
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = req.file.path; 
  console.log("Image uploaded to:", imageUrl);
  res.json({ message: 'Image uploaded successfully', imageUrl: imageUrl });
});

// GET route to serve images from the 'uploads' directory 
router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, '../uploads', imageName);
  res.sendFile(imagePath);
});

module.exports = router;
