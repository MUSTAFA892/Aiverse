from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import torch
from torch.serialization import add_safe_globals
import os
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import XttsAudioConfig
from TTS.api import TTS
from werkzeug.utils import secure_filename

# === Patch torch.load to avoid 'weights_only' errors ===
_orig_torch_load = torch.load
def torch_load_weights_only_false(*args, **kwargs):
    kwargs["weights_only"] = False
    return _orig_torch_load(*args, **kwargs)
torch.load = torch_load_weights_only_false

# Add safe globals for unpickling
add_safe_globals([XttsConfig, XttsAudioConfig])

# Initialize Flask
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load XTTS v2 model once (on server start)
print("Loading XTTS v2 model...")
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
print("Model loaded!")

@app.route("/generate", methods=["POST"])
def generate_speech():
    try:
        # Get text from request
        text = request.form.get("text")
        language = request.form.get("language", "en")

        if not text:
            return jsonify({"error": "Missing text parameter"}), 400

        # Get voice file
        if "voice" not in request.files:
            return jsonify({"error": "Missing voice file"}), 400

        voice_file = request.files["voice"]
        voice_path = os.path.join(UPLOAD_FOLDER, secure_filename(voice_file.filename))
        voice_file.save(voice_path)

        # Generate speech
        output_path = os.path.join(UPLOAD_FOLDER, "output.wav")
        tts.tts_to_file(
            text=text,
            file_path=output_path,
            speaker_wav=voice_path,
            language=language
        )

        # Send back generated file
        return send_file(output_path, mimetype="audio/wav", as_attachment=True, download_name="output.wav")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = os.getenv('PORT')
    app.run(host="0.0.0.0", port=port, debug=True)