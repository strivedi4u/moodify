const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

// Configure multer for file uploads
const upload = multer({
  dest: 'public/images/', // Upload destination directory
  limits: { fileSize: 10 * 1024 * 1024 } // Limit to 10MB
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the images from the images directory
app.get('/get-images', (req, res) => {
  const imagesDir = path.join(__dirname, 'public', 'images');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to fetch images.' });
    }
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
    res.json({ images: imageFiles });
  });
});

// Serve the image count
app.get('/get-image-count', (req, res) => {
  const imageCountFile = path.join(__dirname, 'imageCount.json');
  let imageCount = 0;
  if (fs.existsSync(imageCountFile)) {
    const data = fs.readFileSync(imageCountFile);
    const count = JSON.parse(data).count || 0;
    imageCount = count;
  }
  res.json({ count: imageCount });
});

// Endpoint to save the captured image
app.post('/save-image', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageCountFile = path.join(__dirname, 'imageCount.json');
  let imageCount = 0;

  if (fs.existsSync(imageCountFile)) {
    const data = fs.readFileSync(imageCountFile);
    imageCount = JSON.parse(data).count || 0;
  }

  // Increment the count and save the updated value
  imageCount += 1;
  fs.writeFileSync(imageCountFile, JSON.stringify({ count: imageCount }));

  const filePath = path.join(__dirname, 'public', 'images', `face-detection-image-${imageCount}.png`);
  fs.rename(file.path, filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error saving image.' });
    }
    res.status(200).json({ message: 'Image saved successfully.', imageName: `face-detection-image-${imageCount}.png` });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
