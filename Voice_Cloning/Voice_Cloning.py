from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import torch
from torch.serialization import add_safe_globals
import os
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import XttsAudioConfig
from TTS.api import TTS
from werkzeug.utils import secure_filename
from pydub import AudioSegment
import wave

# Patch torch.load to avoid 'weights_only' errors
_orig_torch_load = torch.load
def torch_load_weights_only_false(*args, **kwargs):
    kwargs["weights_only"] = False
    return _orig_torch_load(*args, **kwargs)
torch.load = torch_load_weights_only_false

# Add safe globals for unpickling
add_safe_globals([XttsConfig, XttsAudioConfig])

# Initialize Flask
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:5173"]}})
UPLOAD_FOLDER = "Uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Verify folder permissions
try:
    test_file = os.path.join(UPLOAD_FOLDER, "test.txt")
    with open(test_file, "w") as f:
        f.write("test")
    os.remove(test_file)
    print(f"Upload folder {UPLOAD_FOLDER} is writable")
except Exception as e:
    print(f"Error: Upload folder {UPLOAD_FOLDER} is not writable: {str(e)}")
    raise

# Load XTTS v2 model
print("Loading XTTS v2 model...")
try:
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
    print("Model loaded successfully!")
except Exception as e:
    print(f"Failed to load TTS model: {str(e)}")
    raise

def validate_and_convert_wav(file_path):
    """Validate and convert audio file to TTS-compatible WAV format (PCM, 16-bit, 22050 Hz)."""
    try:
        # Load audio file
        audio = AudioSegment.from_file(file_path)
        print(f"Original audio format: {audio.frame_rate} Hz, {audio.sample_width * 8}-bit, {audio.channels} channel(s)")

        # Convert to WAV (PCM, 16-bit, 22050 Hz)
        converted_path = file_path.replace(".wav", "_converted.wav")
        audio = audio.set_frame_rate(22050).set_sample_width(2).set_channels(1)
        audio.export(converted_path, format="wav")
        print(f"Converted audio to: {converted_path}")

        # Verify converted file
        with wave.open(converted_path, "rb") as wf:
            print(f"Converted WAV details: {wf.getframerate()} Hz, {wf.getsampwidth() * 8}-bit, {wf.getnchannels()} channel(s)")
        return converted_path
    except Exception as e:
        print(f"Error validating/converting audio file {file_path}: {str(e)}")
        return None

@app.route("/upload", methods=["POST"])
def upload_voice():
    try:
        print("Received request to /upload")
        if "voice" not in request.files:
            print("Error: Missing voice file in request")
            return jsonify({"error": "Missing voice file"}), 400

        voice_file = request.files["voice"]
        if voice_file.filename == "":
            print("Error: No file selected")
            return jsonify({"error": "No file selected"}), 400

        voice_filename = secure_filename(voice_file.filename)
        voice_path = os.path.join(UPLOAD_FOLDER, voice_filename)
        print(f"Saving voice file to: {voice_path}")
        voice_file.save(voice_path)

        if not os.path.exists(voice_path) or os.path.getsize(voice_path) < 1000:
            print("Error: Voice file not saved correctly or too small")
            return jsonify({"error": "Voice file not saved correctly or too small"}), 500

        # Validate and convert to TTS-compatible format
        converted_path = validate_and_convert_wav(voice_path)
        if not converted_path:
            print("Error: Invalid or incompatible audio format")
            return jsonify({"error": "Invalid or incompatible audio format"}), 400

        print(f"Voice file processed: {converted_path}")
        return jsonify({"file_path": converted_path})
    except Exception as e:
        print(f"Error in upload_voice: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/generate", methods=["POST"])
def generate_speech():
    try:
        print("Received request to /generate")
        data = request.get_json()
        text = data.get("text")
        language = data.get("language", "en")
        voice_path = data.get("voice_path")
        print(f"Text: {text}, Language: {language}, Voice Path: {voice_path}")

        if not text:
            print("Error: Missing text parameter")
            return jsonify({"error": "Missing text parameter"}), 400

        if not voice_path or not os.path.exists(voice_path):
            print("Error: Invalid or missing voice file path")
            return jsonify({"error": "Invalid or missing voice file path"}), 400

        # Verify voice file format
        try:
            with wave.open(voice_path, "rb") as wf:
                print(f"Voice file details: {wf.getframerate()} Hz, {wf.getsampwidth() * 8}-bit, {wf.getnchannels()} channel(s)")
        except Exception as e:
            print(f"Error validating voice file {voice_path}: {str(e)}")
            return jsonify({"error": f"Invalid voice file format: {str(e)}"}), 400

        # Generate speech
        output_path = os.path.join(UPLOAD_FOLDER, "output.wav")
        print(f"Generating speech to: {output_path}")
        tts.tts_to_file(
            text=text,
            file_path=output_path,
            speaker_wav=voice_path,
            language=language
        )

        if not os.path.exists(output_path):
            print("Error: Output file not generated")
            return jsonify({"error": "Output file not generated"}), 500

        print("Sending generated audio file")
        return send_file(output_path, mimetype="audio/wav", as_attachment=True, download_name="output.wav")

    except Exception as e:
        print(f"Error in generate_speech: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
