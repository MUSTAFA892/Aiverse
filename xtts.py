import torch
from torch.serialization import add_safe_globals

# === Patch torch.load to avoid 'weights_only' errors ===
_orig_torch_load = torch.load
def torch_load_weights_only_false(*args, **kwargs):
    kwargs["weights_only"] = False
    return _orig_torch_load(*args, **kwargs)
torch.load = torch_load_weights_only_false

# Import required configs for safe unpickling
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import XttsAudioConfig
add_safe_globals([XttsConfig, XttsAudioConfig])

from TTS.api import TTS

# Load XTTS v2 model
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")

# Generate speech with single reference voice
tts.tts_to_file(
    text="Hello i am fine what about you yusuf are you fine?",
    file_path="output.wav",
    speaker_wav="voice.wav",  # your reference voice sample
    language="en"
)
