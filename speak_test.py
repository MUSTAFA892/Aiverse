from TTS.api import TTS

# List available models
print("Available models:")
print(TTS.list_models())

# Load a multi-speaker TTS model
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=True, gpu=False)

# Run TTS
tts.tts_to_file(text="Hello! Your TTS system is working perfectly!", file_path="output.wav")
print("✅ Audio generated! Check the output.wav file.")
