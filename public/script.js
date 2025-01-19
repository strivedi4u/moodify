// Reload button click event
document.getElementById('reloadButton').addEventListener('click', () => {
  const reloadIcon = document.getElementById('reloadIcon');
  
  // Add the rotating class to start the animation
  reloadIcon.classList.add('rotate');
  
  // Reload the page after 1 second (to let the animation play for a bit)
  setTimeout(() => {
    location.reload();
  }, 1000); // Delay page reload to allow rotation animation to complete
});



function requestCameraAccess() {
  // Check if the camera is available by enumerating devices
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      if (videoDevices.length === 0) {
        alert('No camera found.');
      } else {
        // Request camera access
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            // If access is granted, display the video stream
            video.srcObject = stream;
            startVideo();  // Start video processing
          })
          .catch((err) => {
            // Handle errors (e.g., permission denied, no camera)
            console.error('Error accessing webcam:', err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
              alert('Camera permission is required. Please enable it in the browser settings.');
            } else {
              alert('Unable to access camera. Please ensure the camera is connected.');
            }
          });
      }
    })
    .catch((err) => {
      console.alert('Error enumerating devices:', err);
    });
}

// Call the function to request camera access
requestCameraAccess();




const video = document.getElementById('video');
const emotionDisplay = document.getElementById('emotion-display');
const emotionButton = document.getElementById('emotion-button');

// Define emotion-based moods
const emotionSongs = {
  happy: 'Happy mood detected!',
  sad: 'Sad mood detected!',
  angry: 'Angry mood detected!',
  fearful: 'Fearful mood detected!',
  disgusted: 'Disgusted mood detected!',
  surprised: 'Surprised mood detected!',
  neutral: 'Neutral mood detected!',
};

let playedSongs = new Set();

// Load faceapi models
// Load the models for faceapi
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo);

// Start the video stream from the user's webcam
function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => console.error('Error accessing webcam:', err));
}
const emotionEmojis = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  surprised: "😲",
  neutral: "😐",
  disgusted: "🤢",
  fearful: "😨",
};
// Event listener to handle video play
// Event listener to handle video play
video.addEventListener('play', () => {
  // Check if a canvas already exists, and remove it if necessary
  let existingCanvas = document.getElementById('face-detection-canvas');
  if (existingCanvas) {
    existingCanvas.remove();
  }

  // Create a new canvas for face detection
  const canvas = faceapi.createCanvasFromMedia(video);
  canvas.id = 'face-detection-canvas'; // Assign a unique ID to the canvas
  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  // Set interval to detect faces every 100ms
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

    // Handle emotion detection and button visibility
    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      const highestEmotion = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      // Map emotions to emojis
      const emotionEmoji = emotionEmojis[highestEmotion] || '🙂'; // Default emoji if not found
      const emotionText = `${highestEmotion.charAt(0).toUpperCase() + highestEmotion.slice(1)}`;

      // Update the emotion display with emoji and emotion text
      document.getElementById('emotion-text').innerText = `${emotionEmoji} ${emotionText}`;

      // Show play button if emotion is detected
      document.getElementById('emotion-button').style.display = 'inline-block';
    } else {
      // No face detected
      document.getElementById('emotion-display').innerHTML = `<i class="fas fa-smile"></i> Emotion: None`;
      document.getElementById('emotion-text').innerText = 'None';
      
      // Hide play button if no emotion detected
      document.getElementById('emotion-button').style.display = 'none';
    }
  }, 100);
});


// Handle emotion detection on button click
emotionButton.addEventListener('click', async () => {
  const faceContainer = document.getElementById('face-container');
  const musicContainer = document.getElementById('music-container');
  const emotionDisplay = document.getElementById('emotion-display');
  let canvasElement = null;

  try {
    // Detect faces and emotions
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      const highestEmotion = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      // Show the appropriate container and play the mood song
      if (highestEmotion) {
        console.log('Detected emotion:', highestEmotion);
        fetchMoodSongs(highestEmotion);

        if (faceContainer.style.display === 'none') {
          faceContainer.style.display = 'block';  // Show face container
          musicContainer.style.display = 'none';  // Hide music container
        } else {
          if (canvasElement) {
            canvasElement.style.display = 'none'; // Hide previous canvas if any
          }
          faceContainer.style.display = 'none';  // Hide face container
          musicContainer.style.display = 'block'; // Show music container
        }

        // Set the emotion text dynamically
        const emotionEmoji = emotionEmojis[highestEmotion] || "🙂";  // Default emoji
        const emotionText = `${highestEmotion.charAt(0).toUpperCase() + highestEmotion.slice(1)}`;
        emotionDisplay.textContent = `${emotionEmoji} ${emotionText}`;

        // Capture the current frame of the video as an image
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas image to base64 format
        const imageData = canvas.toDataURL('image/png');

        // Send the base64 image to the server to be saved
        const response = await fetch('/save-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageData }),
        });

        const result = await response.text();
        console.log('Image saved:', result);
     // Stop the video stream
     const stream = video.srcObject;
     if (stream) {
       const tracks = stream.getTracks();
       tracks.forEach((track) => track.stop()); // Stops the camera
       video.srcObject = null;
     }
      }
    } else {
      emotionDisplay.textContent = 'No face detected!';
    }
  } catch (error) {
    console.error('Error processing face detection or image capture:', error);
    emotionDisplay.textContent = 'Error processing the image!';
  }
});

// --------------------------------------


// Updated script for the music player
const playButton = document.getElementById('play');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const progressBar = document.querySelector('.progress');
const progressBarContainer = document.querySelector('.progress-bar');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');
const visualizerBars = document.querySelectorAll('.visualizer-bar');
const videoBGContainer = document.getElementById('videoBGContainer');
const spaceVideo = document.getElementById('spaceVideo');
const cornerTag = document.getElementById('cornerTag');

// Audio initialization
const audio = new Audio();
let isPlaying = false;
let currentTrackIndex = 0;
let tracks = [];

// Mood options
const moods = {
  happy: 'upbeat songs',
  sad: 'sad songs',
  angry: 'angry mood songs',
  fearful: 'fearful background music',
  disgusted: 'songs about frustration',
  surprised: 'surprise songs',
  neutral: 'neutral songs'
};
// Fetch and store mood-based songs
async function fetchMoodSongs(mood) {
  const term = moods[mood];
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&limit=20`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    if (data.results && data.results.length > 0) {
      tracks = data.results;
      currentTrackIndex = getRandomTrackIndex(tracks.length); // Get random index
      playTrack(currentTrackIndex);
    } else {
      alert('No tracks found for this mood.');
    }
  } catch (error) {
    console.error('Error fetching songs:', error);
    alert('An error occurred while fetching songs.');
  }
}

// Get a random track index
function getRandomTrackIndex(trackCount) {
  return Math.floor(Math.random() * trackCount); // Random index between 0 and trackCount - 1
}

// Play a specific track by index
function playTrack(index) {
  const track = tracks[index];
  if (!track) return;

  audio.src = track.previewUrl;
  document.querySelector('.song-title').textContent = track.trackName;
  document.querySelector('.artist').textContent = track.artistName;

  audio.play();
  videoBGContainer.classList.add('show');
  spaceVideo.play().catch((err) => console.warn('Video blocked:', err));
}


// Toggle play/pause
function togglePlay() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
}

// Update the play button icon
function updatePlayButton() {
  if (isPlaying) {
    playButton.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    playButton.innerHTML = '<i class="fas fa-play"></i>';
  }
}

// Visualizer animation
function toggleVisualizer(playing) {
  visualizerBars.forEach((bar) => {
    bar.style.animationPlayState = playing ? 'running' : 'paused';
  });
}

// Event listeners for play button
playButton.addEventListener('click', () => {
  togglePlay();
});

// Audio starts
audio.addEventListener('play', () => {
  isPlaying = true;
  updatePlayButton();
  toggleVisualizer(true);

  videoBGContainer.classList.add('show');
  spaceVideo.playbackRate = 0.8;
  spaceVideo.currentTime = 0;
  spaceVideo.play().catch((err) => console.warn('Video blocked:', err));

  if (cornerTag) {
    cornerTag.classList.add('hide');
  }
});

// Audio pauses
audio.addEventListener('pause', () => {
  isPlaying = false;
  updatePlayButton();
  toggleVisualizer(false);

  // videoBGContainer.classList.remove('show');
  spaceVideo.pause();
});

// Play next track
function playNextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  playTrack(currentTrackIndex);
}

// Play previous track
function playPrevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  playTrack(currentTrackIndex);
}

// Event listeners for next and previous buttons
nextButton.addEventListener('click', playNextTrack);
prevButton.addEventListener('click', playPrevTrack);

// Play next track automatically when current track ends
audio.addEventListener('ended', playNextTrack);

// Progress bar & times
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }
  updateCurrentTime();
  updateDuration();
});

// Seek on progress bar click
progressBarContainer.addEventListener('click', (e) => {
  const width = progressBarContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

// Update current time
function updateCurrentTime() {
  const minutes = Math.floor(audio.currentTime / 60);
  const seconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
  currentTimeEl.textContent = `${minutes}:${seconds}`;
}

// Update total duration
function updateDuration() {
  if (audio.duration) {
    const minutes = Math.floor(audio.duration / 60);
    const seconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
    durationEl.textContent = `${minutes}:${seconds}`;
  }
}

// // Play default mood on page load
// window.addEventListener('DOMContentLoaded', () => {
//   fetchMoodSongs('happy');
// });