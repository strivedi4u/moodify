
# Moodify 🎵😊


![Moodify Logo](./public/assets/images/logo.png)

---


## 🚀 Live Demo
- 🌐 [Moodify Live Website](https://moodify4u.azurewebsites.net)
- 🔗 [https://moodify4u.azurewebsites.net](https://moodify4u.azurewebsites.net)

---

## 📸 Screenshots
### 1. Music Recommendation UI
![Music Player Screenshot](https://github.com/strivedi4u/moodify/blob/master/public/assets/images/image.png)

### 2. Emotion Detection & Song Suggestion
![Emotion Detection Screenshot](https://github.com/strivedi4u/moodify/blob/master/public/assets/images/image1.png)

---

## 📊 Project Presentation

Get a quick, visual overview of the project’s goals, features, and design.

<a href="https://www.canva.com/design/DAGd1orZkkI/9nVjlgngl-JPhCE4gcl5XA/view?utm_content=DAGd1orZkkI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h21fe6bde19" target="_blank">
  <img src="https://cdn.icon-icons.com/icons2/2699/PNG/512/canva_logo_icon_168460.png" alt="Canva Logo" width="16" style="vertical-align:middle; margin-right:6px;"/>
  <b>View the Presentation on Canva</b>
</a>

---

### 📖 Presentation Contents

- **Project Overview & Vision**
- **Key Features & Benefits**
- **Tech Stack**
- **Architecture & Diagrams**
- **Screenshots**
- **Contact & Author Info**

---

> [Click here to open the Canva presentation directly.](https://www.canva.com/design/DAGd1orZkkI/9nVjlgngl-JPhCE4gcl5XA/view?utm_content=DAGd1orZkkI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h21fe6bde19)

---

**Feedback and collaboration are always welcome!**

---

### 📖 What’s Inside?

- **Overview:** Introduction to the project and its vision  
- **Key Features:** Highlighted functionalities and user benefits  
- **Tech Stack:** Technologies and frameworks powering the solution  
- **Architecture:** Diagrams and explanations of the system workflow  
- **Screenshots:** Visual walkthrough of the UI/UX  
- **Contact:** Author information and ways to connect

---

> 👀 **Tip:** Want a quick summary?  
> [Click here to open the presentation.](https://www.canva.com/design/DAGcqU7R59g/ZqOJM7ATCWQsPMgJj4q8QQ/view?utm_content=DAGcqU7R59g&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h259d11325f)

---

**Enjoy exploring!** 🎉  
If you have feedback or suggestions, feel free to [open an issue](../../issues) or [connect with the author](https://www.linkedin.com/in/shashanktrivedi).

## 📝 Overview
Moodify is an advanced web application that leverages AI-powered facial emotion recognition to recommend and play music that matches your current mood. Built with TensorFlow.js, face-api.js, and Express.js, Moodify provides a seamless, interactive experience for users to detect their emotions in real-time and enjoy mood-based music recommendations.


## 📚 Table of Contents
- ✨ [Features](#features)
- 🗂️ [Project Structure](#project-structure)
- 🔄 [Data Flow & Architecture](#data-flow--architecture)
- 🖼️ [Diagrams](#diagrams)
- 🛠️ [Installation](#installation)
- 🎮 [Usage](#usage)
- 🔌 [API Endpoints](#api-endpoints)
- 📄 [License](#license)



## ✨ Features
- 😀 Real-time facial emotion detection using webcam
- 🎶 AI-powered music recommendations based on detected mood
- ⏯️ Interactive music player with play, next, previous, and progress controls
- 📱 Responsive UI with modern design
- 🖼️ Image capture and storage for detected emotions
- 🌐 RESTful API for image management



## 🗂️ Project Structure
```
├── Dockerfile
├── imageCount.json
├── index.js                # Express.js backend server
├── package.json
├── LICENSE
├── README.md
├── public/
│   ├── face-api.min.js     # Face API library
│   ├── index.html          # Main web UI
│   ├── music.css           # Music player styles
│   ├── music.js            # Music player logic
│   ├── script.js           # Main app logic (emotion detection, UI)
│   ├── user.html           # User profile (optional)
│   ├── assets/
│   │   └── images/
│   │       ├── bg.avif     # Background image
│   │       └── logo.png    # App logo
│   ├── images/             # Saved user images
│   └── models/             # Face detection & emotion models
│       ├── face_expression_model-shard1
│       ├── face_expression_model-weights_manifest.json
│       ├── ...
```



## 🔄 Data Flow & Architecture


<!-- Mermaid diagram removed due to GitHub rendering limitations. See documentation for supported syntax. -->


### Data Flow Steps
1. 📷 **User Webcam**: User grants access to webcam.
2. 🧠 **Face Detection**: face-api.js detects faces and landmarks.
3. 😊 **Emotion Recognition**: AI model predicts user's emotion.
4. 🖥️ **UI Update**: Detected emotion is displayed with emoji and text.
5. 🎵 **Music Recommendation**: App fetches mood-based songs from iTunes API.
6. ⏯️ **Music Player**: User can play, skip, or pause recommended tracks.
7. 🖼️ **Image Capture**: Captures webcam image when emotion is detected.
8. 🌐 **Express.js Backend**: Handles image saving and retrieval via REST API.
9. 💾 **Image Storage**: Images are stored in `public/images/` and tracked in `imageCount.json`.



## 🖼️ Diagrams

### 1. Component Diagram
```mermaid
flowchart LR
    subgraph Frontend
        UI[💻 HTML/CSS/JS]
        FaceAPI[🧠 face-api.js]
        MusicPlayer[🎶 music.js]
    end
    subgraph Backend
        Express[🌐 Express.js]
        Storage[💾 File System]
    end
    UI --> FaceAPI
    UI --> MusicPlayer
    UI -->|REST API| Express
    Express --> Storage
```

### 2. Sequence Diagram
```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant FaceAPI
    participant Backend
    participant iTunesAPI
    User->>Browser: Open Moodify
    Browser->>FaceAPI: Start webcam & detect emotion
    FaceAPI->>Browser: Return detected emotion
    Browser->>iTunesAPI: Fetch songs for emotion
    iTunesAPI->>Browser: Return song list
    Browser->>Backend: Save captured image
    Backend->>Browser: Confirm image saved
    Browser->>User: Display emotion & play music
```

### 3. Data Storage Diagram
```mermaid
flowchart TD
    A[imageCount.json] --> B[Tracks image count]
    C[public/images/] --> D[Stores captured images]
```

---

## Installation


1. **Clone the repository**
![Moodify Logo](./public/assets/images/logo.png)



### 2. Emotion Detection & Song Suggestion

---
    npm install
    ```
3. **Run the server**
    ```sh
    npm start
    ```
4. **Open in browser**
    Visit [http://localhost:8000](http://localhost:8000)

---

## 🎮 Usage
- 📷 Grant webcam access when prompted.
- 😊 View detected emotion and emoji in the UI.
- ▶️ Click the play button to get mood-based music recommendations.
- ⏯️ Use music player controls to play, pause, skip tracks.
- 🖼️ Images are captured and stored for each detected emotion.

---

## 🔌 API Endpoints
- `GET /get-image-count` — Returns the number of saved images.
- `GET /get-images` — Returns list of saved images.
- `POST /save-image` — Saves a base64-encoded image.

---

## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 👤 Author
Developed by [Shashank Trivedi](https://github.com/strivedi4u)

---

## 🌐 Follow & Connect
- [![Follow on GitHub](https://img.shields.io/github/followers/strivedi4u?label=Follow&style=social)](https://github.com/strivedi4u)
- 💼 [LinkedIn](https://www.linkedin.com/in/shashanktrivedi)
- 🐦 [Twitter](https://twitter.com/strivedi4u)

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 🙏 Acknowledgements
- [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Bootstrap](https://getbootstrap.com/)
- [iTunes Search API](https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/)
