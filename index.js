const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: 'public/images/', limits: { fileSize: 10 * 1024 * 1024 } });

app.get('/get-image-count', (req, res) => {
  const filePath = path.join(__dirname, 'imageCount.json');
  if (fs.existsSync(filePath)) {
    const count = JSON.parse(fs.readFileSync(filePath)).count || 0;
    res.json({ count });
  } else {
    res.json({ count: 0 });
  }
});
app.get('/get-images', (req, res) => {
  const imagesDir = path.join(__dirname, 'public/images');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading image directory.');
    }
    const imagePaths = files.filter(file => file.endsWith('.png')).map(file => `/images/${file}`);
    console.log(imagePaths);
    res.json({ images: imagePaths });
  });
});


app.use(express.json({ limit: '10mb' })); // This is important to handle large base64-encoded image data

app.post('/save-image', (req, res) => {
  const { image } = req.body; // Get the base64 image data from the request
  if (!image) {
    return res.status(400).send('No image provided.');
  }

  const imageCountPath = path.join(__dirname, 'imageCount.json');
  let count = 0;
  if (fs.existsSync(imageCountPath)) {
    count = JSON.parse(fs.readFileSync(imageCountPath)).count || 0;
  }
  count++;
  fs.writeFileSync(imageCountPath, JSON.stringify({ count }));

  // Remove the data URL prefix to get the base64 string
  const base64Data = image.replace(/^data:image\/png;base64,/, '');

  // Set the path for saving the image
  const imagePath = path.join(__dirname, 'public', 'images', `image-${count}.png`);

  // Save the image to the file system
  fs.writeFile(imagePath, base64Data, 'base64', (err) => {
    if (err) {
      return res.status(500).send('Error saving the image.');
    }
    res.send('Image saved.');
  });
});


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
