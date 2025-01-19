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
  happy: 'happy',
  sad: 'sad',
  energetic: 'energetic',
  calm: 'calm',
};

// Fetch and store mood-based songs
async function fetchMoodSongs(mood) {
  const term = moods[mood];
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&limit=20`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      tracks = data.results;
      currentTrackIndex = 0;
      playTrack(currentTrackIndex);
    } else {
      alert('No tracks found for this mood.');
    }
  } catch (error) {
    console.error('Error fetching songs:', error);
    alert('An error occurred while fetching songs.');
  }
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

  videoBGContainer.classList.remove('show');
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

// Play default mood on page load
window.addEventListener('DOMContentLoaded', () => {
  fetchMoodSongs('happy');
});