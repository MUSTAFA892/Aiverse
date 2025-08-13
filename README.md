# 🌌 AIverse – Backend Microservices

AIverse is a collection of **AI-powered microservices** built with **Flask**.  
This repository contains two main services:

1. **📸 Instagram Caption & Music Suggestion Service**  
2. **🎙 Voice Cloning & Text-to-Speech Service**

These services can be run independently or together, making AIverse flexible for integration into larger applications.

---

## 🚀 Microservices Overview

### **1. Instagram Caption & Music Suggestions**
- Generates **3 creative Instagram captions** based on:
  - Uploaded image
  - Selected vibe (Motivational, Funny, Romantic, Professional, Casual, Inspirational)
  - Optional custom context
  - Language (English, Tamil, Hindi)
- Suggests **4 music tracks** matching the chosen vibe & language using **Google Gemini API**.

**Endpoints**
- `POST /api/generate-captions` – Generate captions from an image + vibe.
- `POST /api/music-suggestions` – Suggest music tracks for a given vibe.

---

### **2. Voice Cloning & Text-to-Speech (TTS)**
- Upload a voice sample (WAV, MP3, etc.).
- Converts it into a TTS-compatible format (PCM, 16-bit, 22050 Hz).
- Generates speech in multiple languages using **Coqui TTS XTTS v2**.

**Endpoints**
- `POST /upload` – Upload & validate voice sample.
- `POST /generate` – Generate speech from cloned voice.

---

## 📂 Project Structure

```

AIverse/
├── Instagram-Caption/
│   ├── Instagram\_Caption.py              # Instagram caption microservice
│   ├── instagram\_caption\_requirements.txt
├── Voice\_Cloning/
│   ├── Voice\_Cloning.py                   # Voice cloning microservice
│   ├── voice\_cloning\_requirements.txt
├── Uploads/                               # Uploaded voice files
├── .env.example                           # Environment variable template
├── .gitignore
├── README.md
├── main.py                                # Entry point for running services

````

---

## ⚙️ Installation & Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/AIverse.git
cd AIverse
````

### **2. Create a Virtual Environment**

```bash
python -m venv venv
source venv/bin/activate   # On Mac/Linux
venv\Scripts\activate      # On Windows
```

### **3. Install Dependencies**

Each microservice has its own requirements:

```bash
pip install -r Instagram-Caption/instagram_caption_requirements.txt
pip install -r Voice_Cloning/voice_cloning_requirements.txt
```

### **4. Configure Environment Variables**

Copy `.env.example` to `.env` and update:

```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### **5. Run the Services**

* **Instagram Caption Service**:

```bash
python Instagram-Caption/Instagram_Caption.py
```

* **Voice Cloning Service**:

```bash
python Voice_Cloning/Voice_Cloning.py
```

---

## 📡 API Usage

### **Instagram Caption – Example Request**

```bash
POST /api/generate-captions
Content-Type: application/json

{
  "vibe": "Motivational",
  "customPrompt": "Focus on sunrise and new beginnings",
  "imageData": "data:image/jpeg;base64,...",
  "language": "English"
}
```

### **Voice Cloning – Example Request**

```bash
POST /upload
Form-Data:
  voice: [voice_sample.wav]
```

```bash
POST /generate
Content-Type: application/json

{
  "text": "Hello, welcome to AIverse!",
  "language": "en",
  "voice_path": "Uploads/sample_converted.wav"
}
```

---


## 📡 API Usage

---

### **Instagram Caption Service**

#### Generate Captions
**Request**
```bash
curl -X POST http://localhost:5000/api/generate-captions \
-H "Content-Type: application/json" \
-d '{
  "vibe": "Motivational",
  "customPrompt": "Focus on sunrise and new beginnings",
  "imageData": "data:image/jpeg;base64,PUT-YOUR-BASE64-IMAGE-HERE",
  "language": "English"
}'
````

#### Music Suggestions

**Request**

```bash
curl -X POST http://localhost:5000/api/music-suggestions \
-H "Content-Type: application/json" \
-d '{
  "vibe": "Romantic",
  "language": "English"
}'
```

---

### **Voice Cloning Service**

#### Upload Voice Sample

**Request**

```bash
curl -X POST http://localhost:5000/upload \
-F "voice=@/path/to/voice_sample.wav"
```

#### Generate Speech

**Request**

```bash
curl -X POST http://localhost:5000/generate \
-H "Content-Type: application/json" \
-d '{
  "text": "Hello, welcome to AIverse!",
  "language": "en",
  "voice_path": "Uploads/sample_converted.wav"
}'
```

---

📌 **Note:**

* Replace `localhost:5000` with your server's IP/port if running remotely.
* For `/generate-captions`, you must provide **base64-encoded image data**.
* Ensure you run the microservice responsible for the endpoint before testing.


---


## 🛠 Technologies Used

* **Flask** – Web framework
* **Flask-CORS** – Cross-origin support
* **Coqui TTS** – Voice cloning (XTTS v2)
* **Google Gemini API** – AI captions & music suggestions
* **Pydub** – Audio processing
* **Pillow** – Image validation
* **dotenv** – Environment configuration

---

## 📜 License

MIT License – Free to use, modify, and distribute.

