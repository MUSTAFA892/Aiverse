import os
import tempfile
import shutil
import threading
from typing import List

from flask import Flask, jsonify, request, make_response

# --------------------------------------------
# ✅ Fix PyTorch 2.6+ safe deserialization issue BEFORE importing TTS
# --------------------------------------------
import torch
old_load = torch.load
def patched_load(*args, **kwargs):
    kwargs["weights_only"] = False
    return old_load(*args, **kwargs)
torch.load = patched_load

try:
    from torch.serialization import add_safe_globals
    from TTS.tts.configs.xtts_config import XttsConfig
    add_safe_globals([XttsConfig])
except Exception as e:
    print("Warning: Could not add safe globals:", e)

# --------------------------------------------
# Import TTS
# --------------------------------------------
try:
    from TTS.api import TTS  # type: ignore
    TTS_AVAILABLE = True
except Exception:
    TTS_AVAILABLE = False

app = Flask(__name__)

SUPPORTED_LANGUAGES: List[str] = [
    "en", "es", "fr", "de", "it", "pt", "pl", "tr", "ru", "nl", "cs",
    "ar", "zh", "zh-cn", "ja", "ko", "hu", "uk", "hi", "bn", "vi",
    "sv", "fi", "no", "da", "el", "ro", "bg", "hr", "sk", "sl",
    "ms", "id", "th", "he", "ur", "fa", "ta", "te", "gu", "mr", "kn", "ml"
]

_model_lock = threading.Lock()
_tts_model = None

# --------------------------------------------
# Load TTS model (CPU only)
# --------------------------------------------
def _ensure_model_loaded():
    global _tts_model
    if _tts_model is not None:
        return
    with _model_lock:
        if _tts_model is not None:
            return
        if not TTS_AVAILABLE:
            raise RuntimeError("Coqui TTS is not installed. Please install 'TTS' package.")

        print("Loading XTTS v2 model (CPU mode)... This may take a while.")
        _tts_model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
        print("✅ Model loaded successfully!")

@app.get("/healthz")
def healthz():
    return jsonify({"status": "ok"})

@app.get("/api/v1/languages")
def list_languages():
    return jsonify({"languages": SUPPORTED_LANGUAGES})

@app.post("/api/v1/clone-voice")
def clone_voice():
    if "audio" not in request.files:
        return jsonify({"error": "Missing file field 'audio'"}), 400

    speaker_file = request.files.get("audio")
    input_text = request.form.get("text")
    language = request.form.get("language", "en").strip().lower()

    if not input_text or not input_text.strip():
        return jsonify({"error": "Missing 'text'"}), 400

    tmp_dir = tempfile.mkdtemp(prefix="xtts_")
    try:
        # Save uploaded voice sample
        original_filename = getattr(speaker_file, 'filename', '') or 'speaker.wav'
        _, ext = os.path.splitext(original_filename)
        if not ext:
            ext = ".wav"
        speaker_path = os.path.join(tmp_dir, f"speaker{ext}")
        speaker_file.save(speaker_path)

        # Output file path
        output_path = os.path.join(tmp_dir, "output.wav")

        # Load model lazily
        _ensure_model_loaded()

        # Generate speech
        with _model_lock:
            _tts_model.tts_to_file(
                text=input_text,
                file_path=output_path,
                speaker_wav=speaker_path,
                language=language,
            )

        # Send generated file back
        with open(output_path, "rb") as f:
            data = f.read()
        response = make_response(data)
        response.headers["Content-Type"] = "audio/wav"
        response.headers["Content-Disposition"] = "attachment; filename=output.wav"
        return response

    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=False)
