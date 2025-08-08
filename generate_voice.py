import warnings
warnings.filterwarnings("ignore", category=UserWarning)

import os
os.environ["COQUI_TOS_AGREED"] = "1"

from TTS.api import TTS

# Load the TTS model
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

# Speaker reference WAV path
speaker_wav_path = r"C:\Users\nhowmitha suresh\tts project\voice.wav"

# Generate speech
tts.tts_to_file(
    text="It took me quite a long time to develop a voice, and now that I have it I'm not going to be silent.",
    speaker_wav=speaker_wav_path,
    language="en",
    file_path="output.wav"
)
