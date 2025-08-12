from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import google.generativeai as genai
from dotenv import load_dotenv
import json
from PIL import Image
import io
import re

app = Flask(__name__)
CORS(app)

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-1.5-flash')

def parse_gemini_response(text, is_music=False):
    text = text.strip()
    # Remove JSON code fences
    if text.startswith('```json'):
        text = text[7:].strip()
    if text.endswith('```'):
        text = text[:-3].strip()
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        app.logger.warning(f"JSON parsing failed for {'music' if is_music else 'captions'}: {text}")
        if is_music:
            # Fallback: Parse music suggestions manually
            suggestions = []
            # Split by lines or numbered items (e.g., "1. Title - Artist (Genre)")
            lines = [line.strip() for line in text.split('\n') if line.strip() and not line.startswith('#')]
            for line in lines:
                # Match patterns like "Title - Artist (Genre)" or "Title, Artist, Genre"
                match = re.match(r'^(?:[\d\.\s]*)(.*?)\s*[-,]\s*(.*?)\s*\((.*?)\)$', line)
                if not match:
                    match = re.match(r'^(?:[\d\.\s]*)(.*?),\s*(.*?),\s*(.*?)$', line)
                if match:
                    title, artist, genre = match.groups()
                    suggestions.append({
                        "title": title.strip(),
                        "artist": artist.strip(),
                        "genre": genre.strip()
                    })
            return suggestions if suggestions else []
        else:
            # Fallback for captions: Split into lines
            return [line.strip() for line in text.split('\n') if line.strip() and not line.startswith('#')]

@app.route('/api/generate-captions', methods=['POST'])
def generate_captions():
    try:
        data = request.get_json()
        vibe = data.get('vibe')
        custom_prompt = data.get('customPrompt', '')
        image_data = data.get('imageData')
        language = data.get('language', 'English')

        if not vibe or not image_data:
            return jsonify({'error': 'Missing vibe or image data'}), 400

        # Validate vibe
        valid_vibes = ["Motivational", "Funny", "Romantic", "Professional", "Casual", "Inspirational"]
        if vibe not in valid_vibes:
            return jsonify({'error': 'Invalid vibe selected'}), 400

        # Validate language
        valid_languages = ["English", "Tamil", "Hindi"]
        if language not in valid_languages:
            return jsonify({'error': f'Invalid language selected. Choose from: {", ".join(valid_languages)}'}), 400

        # Decode base64 image
        try:
            _, encoded = image_data.split(",", 1)
            image_bytes = base64.b64decode(encoded)
            Image.open(io.BytesIO(image_bytes))  # Validate image
        except Exception as e:
            return jsonify({'error': f'Failed to process image: {str(e)}'}), 400

        # Prepare prompt
        caption_prompt = f"""
        Generate 3 Instagram captions in {language} for an image with a {vibe.lower()} vibe.
        The captions should be engaging, concise, include 2-3 relevant hashtags, and be suitable for Instagram.
        {f'Incorporate this context: {custom_prompt}' if custom_prompt else ''}
        Return only a JSON array of strings, nothing else.
        Example: ["Caption 1 #hashtag1 #hashtag2", "Caption 2 #hashtag3 #hashtag4", "Caption 3 #hashtag5 #hashtag6"]
        """

        # Create image part
        image_part = {
            "inline_data": {
                "mime_type": "image/jpeg",
                "data": base64.b64encode(image_bytes).decode('utf-8')
            }
        }

        # Generate content
        response = model.generate_content([caption_prompt, image_part])
        captions = parse_gemini_response(response.text)
        app.logger.debug(f"Generated captions: {captions}")
        if not captions:
            return jsonify({'error': 'No captions generated'}), 500

        return jsonify({'captions': captions})
    except Exception as e:
        app.logger.error(f"Error in generate_captions: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/music-suggestions', methods=['POST'])
def music_suggestions():
    try:
        data = request.get_json()
        vibe = data.get('vibe')
        language = data.get('language', 'English')

        if not vibe:
            return jsonify({'error': 'Missing vibe'}), 400

        # Validate vibe
        valid_vibes = ["Motivational", "Funny", "Romantic", "Professional", "Casual", "Inspirational"]
        if vibe not in valid_vibes:
            return jsonify({'error': 'Invalid vibe selected'}), 400

        # Validate language
        valid_languages = ["English", "Tamil", "Hindi"]
        if language not in valid_languages:
            return jsonify({'error': f'Invalid language selected. Choose from: {", ".join(valid_languages)}'}), 400

        # Prepare prompt
        music_prompt = f"""
        Suggest 4 music tracks in {language} that complement a {vibe.lower()} Instagram post vibe.
        Each suggestion must include the song title, artist, and genre.
        Return only a JSON array of objects with keys: title, artist, genre, nothing else.
        Example: [
            {{"title": "Song 1", "artist": "Artist 1", "genre": "Pop"}},
            {{"title": "Song 2", "artist": "Artist 2", "genre": "Rock"}},
            {{"title": "Song 3", "artist": "Artist 3", "genre": "Jazz"}},
            {{"title": "Song 4", "artist": "Artist 4", "genre": "Classical"}}
        ]
        """

        # Generate content
        response = model.generate_content(music_prompt)
        music = parse_gemini_response(response.text, is_music=True)
        app.logger.debug(f"Generated music suggestions: {music}")
        if not music:
            return jsonify({'error': 'No music suggestions generated'}), 500

        return jsonify({'musicSuggestions': music})
    except Exception as e:
        app.logger.error(f"Error in music_suggestions: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    PORT = os.getenv('PORT')
    app.run(debug=True, port=PORT, host='0.0.0.0')