const video = document.getElementById('video');
const emotionDisplay = document.getElementById('emotion-display');
const emotionButton = document.getElementById('emotion-button');
const songIframe = document.getElementById('song-iframe');
const pauseButton = document.getElementById('pause-button');
const playButton = document.getElementById('play-button');
const songMessage = document.getElementById('song-message'); // Added for clarity

const emotionSongs = {
  happy: 'trending hindi songs 2025',
  sad: 'trending hindi sad songs',
  angry: 'trending hindi angry songs',
  fearful: 'trending hindi fearful songs',
  disgusted: 'trending hindi disgusted songs',
  surprised: 'trending hindi surprised songs',
  neutral: 'trending hindi calm music',
};

const fallbackSongs = [
  'trending hindi songs',
  'chill music to relax',
  'background music for studying',
  'romantic hindi songs',
];

let currentEmotion = '';
let playedSongs = new Set();

// Load face-api.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error('Error accessing webcam:', err)
  );
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
});

emotionButton.addEventListener('click', async () => {
  const detections = await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

  if (detections.length > 0) {
    const expressions = detections[0].expressions;
    const highestEmotion = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );

    const emojiMap = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      fearful: '😱',
      disgusted: '🤢',
      surprised: '😲',
      neutral: '😐',
    };

    const emoji = emojiMap[highestEmotion] || '🤔';
    emotionDisplay.textContent = `Emotion: ${highestEmotion} ${emoji}`;

    // Capture and save the image
    captureAndSaveImage();

    // Play the song based on the detected emotion
    playSong(highestEmotion);
  } else {
    emotionDisplay.textContent = 'No face detected!';
  }
});

const captureAndSaveImage = async () => {
  try {
    const countResponse = await axios.get('/get-image-count');
    let imageCount = countResponse.data.count;
    imageCount += 1;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

    const blob = new Blob([Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))], { type: 'image/png' });
    const formData = new FormData();
    formData.append('image', blob, `face-detection-image-${imageCount}.png`);

    const response = await axios.post('/save-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    if (response.status === 200) {
      console.log('Image saved successfully:', response.data.imageName);
    }
  } catch (error) {
    console.error('Error capturing and saving image:', error);
  }
};
const playSong = async (emotion) => {
  currentEmotion = emotion;

  try {
    const query = emotionSongs[emotion] || 'trending hindi songs';

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        q: query,
        part: 'snippet',
        key: 'AIzaSyAXxhiLDukJ-h5bcuSdxWhw7LEMJbm_BdU', // Replace with your API key
        type: 'video',
        maxResults: 5,
      },
    });

    if (response.data.items.length > 0) {
      // Filter out previously played songs
      const unplayedSongs = response.data.items.filter(item => !playedSongs.has(item.id.videoId));

      if (unplayedSongs.length > 0) {
        // Randomly select an unplayed song
        const randomSong = unplayedSongs[Math.floor(Math.random() * unplayedSongs.length)];
        const videoId = randomSong.id.videoId;
        playedSongs.add(videoId); // Add the song ID to the played set
        const songUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

        // Log song info to the console
        console.log("Song Info:");
        console.log("Title:", randomSong.snippet.title);
        console.log("Description:", randomSong.snippet.description);
        console.log("Video ID:", videoId);
        console.log("Video URL:", songUrl);

        // Play the song
        playSongFromUrl(songUrl, randomSong.snippet.title);
      } else {
        // If all songs have been played, clear the played songs set and try again
        playedSongs.clear();
        playSong(emotion); // Retry the same emotion with cleared history
      }
    } else {
      // If no song is found, play a random fallback song
      playRandomSong();
    }
  } catch (error) {
    console.log('Error searching for the song:', error);
    document.getElementById('song-message').textContent = 'An error occurred while searching for the song.';
  }
};

const playSongFromUrl = (url, songName) => {
  songIframe.src = url;
  document.getElementById('song-message').textContent = `Song Playing: ${songName}`;

  // Update progress bar
  setInterval(() => {
    if (songIframe.contentWindow.document.readyState === 'complete') {
      let currentTime = songIframe.contentWindow.document.querySelector('.ytp-play-progress');
      if (currentTime) {
        progressBar.style.width = currentTime.style.width;
      }
    }
  }, 500);
};

const playRandomSong = () => {
  const randomSong = fallbackSongs[Math.floor(Math.random() * fallbackSongs.length)];
  try {
    axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        q: randomSong,
        part: 'snippet',
        key: 'AIzaSyAXxhiLDukJ-h5bcuSdxWhw7LEMJbm_BdU', // Replace with your API key
        type: 'video',
        maxResults: 1,
      },
    }).then((response) => {
      if (response.data.items.length > 0) {
        const videoId = response.data.items[0].id.videoId;
        const songUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

        // Log song info to the console
        console.log("Fallback Song Info:");
        console.log("Title:", response.data.items[0].snippet.title);
        console.log("Description:", response.data.items[0].snippet.description);
        console.log("Video ID:", videoId);
        console.log("Video URL:", songUrl);

        // Play the song
        playSongFromUrl(songUrl, randomSong);
      }
    }).catch((error) => {
      console.log('Error searching for the fallback song:', error);
      document.getElementById('song-message').textContent = 'An error occurred while playing a random song.';
    });
  } catch (error) {
    console.log('Error:', error);
    document.getElementById('song-message').textContent = 'An error occurred while playing the random song.';
  }
};