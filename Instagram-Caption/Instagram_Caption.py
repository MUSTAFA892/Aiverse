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
from functools import wraps
import logging

# Explicitly import PyJWT
try:
    import jwt
    logging.basicConfig(level=logging.DEBUG)
    logging.debug(f"JWT module: {jwt.__file__}")
    logging.debug(f"JWT version: {jwt.__version__}")
except ImportError:
    logging.error("PyJWT is not installed. Please install it with: pip install pyjwt")
    raise

app = Flask(__name__)

# Configure CORS to allow requests from frontend
CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000","https://aiverse-icip.onrender.com"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")  # Must match Next.js JWT_SECRET

model = genai.GenerativeModel('gemini-1.5-flash')

# Middleware to validate JWT for non-OPTIONS requests
def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Skip auth for OPTIONS requests
        if request.method == "OPTIONS":
            return f(*args, **kwargs)

        auth_header = request.headers.get("Authorization")
        app.logger.debug(f"Authorization header: {auth_header}")

        if not auth_header or not auth_header.startswith("Bearer "):
            app.logger.error("Missing or invalid Authorization header")
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(" ")[1]
        app.logger.debug(f"Token received: {token}")
        try:
            decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            app.logger.debug(f"Decoded token: {decoded}")
            request.user = decoded
        except jwt.ExpiredSignatureError:
            app.logger.error("Token expired")
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            app.logger.error(f"Invalid token: {str(e)}")
            return jsonify({"error": f"Invalid token: {str(e)}"}), 401
        except Exception as e:
            app.logger.error(f"Unexpected token error: {str(e)}")
            return jsonify({"error": f"Token validation failed: {str(e)}"}), 401

        return f(*args, **kwargs)
    return decorated

def parse_gemini_response(text, is_music=False):
    text = text.strip()
    if text.startswith('```json'):
        text = text[7:].strip()
    if text.endswith('```'):
        text = text[:-3].strip()
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        app.logger.warning(f"JSON parsing failed for {'music' if is_music else 'captions'}: {text}")
        if is_music:
            suggestions = []
            lines = [line.strip() for line in text.split('\n') if line.strip() and not line.startswith('#')]
            for line in lines:
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
            return [line.strip() for line in text.split('\n') if line.strip() and not line.startswith('#')]

@app.route('/api/generate-captions', methods=['POST', 'OPTIONS'])
@require_auth
def generate_captions():
    if request.method == "OPTIONS":
        app.logger.debug("Handling OPTIONS request for /api/generate-captions")
        return jsonify({}), 200

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        vibe = data.get('vibe')
        custom_prompt = data.get('customPrompt', '')
        image_data = data.get('imageData')
        language = data.get('language', 'English')

        app.logger.debug(f"Received data: vibe={vibe}, language={language}, customPrompt={custom_prompt}")

        if not vibe or not image_data:
            return jsonify({'error': 'Missing vibe or image data'}), 400

        valid_vibes = ["Motivational", "Funny", "Romantic", "Professional", "Casual", "Inspirational"]
        if vibe not in valid_vibes:
            return jsonify({'error': 'Invalid vibe selected'}), 400

        valid_languages = ["English", "Tamil", "Hindi"]
        if language not in valid_languages:
            return jsonify({'error': f'Invalid language selected. Choose from: {", ".join(valid_languages)}'}), 400

        try:
            _, encoded = image_data.split(",", 1)
            image_bytes = base64.b64decode(encoded)
            Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            app.logger.error(f"Image processing error: {str(e)}")
            return jsonify({'error': f'Failed to process image: {str(e)}'}), 400

        caption_prompt = f"""
        Generate 3 Instagram captions in {language} for an image with a {vibe.lower()} vibe.
        The captions should be engaging, concise, include 2-3 relevant hashtags, and be suitable for Instagram.
        {f'Incorporate this context: {custom_prompt}' if custom_prompt else ''}
        Return only a JSON array of strings, nothing else.
        Example: ["Caption 1 #hashtag1 #hashtag2", "Caption 2 #hashtag3 #hashtag4", "Caption 3 #hashtag5 #hashtag6"]
        """

        image_part = {
            "inline_data": {
                "mime_type": "image/jpeg",
                "data": base64.b64encode(image_bytes).decode('utf-8')
            }
        }

        response = model.generate_content([caption_prompt, image_part])
        captions = parse_gemini_response(response.text)
        app.logger.debug(f"Generated captions: {captions}")
        if not captions:
            return jsonify({'error': 'No captions generated'}), 500

        return jsonify({'captions': captions})
    except Exception as e:
        app.logger.error(f"Error in generate_captions: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/music-suggestions', methods=['POST', 'OPTIONS'])
@require_auth
def music_suggestions():
    if request.method == "OPTIONS":
        app.logger.debug("Handling OPTIONS request for /api/music-suggestions")
        return jsonify({}), 200

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        vibe = data.get('vibe')
        language = data.get('language', 'English')

        app.logger.debug(f"Received data: vibe={vibe}, language={language}")

        if not vibe:
            return jsonify({'error': 'Missing vibe'}), 400

        valid_vibes = ["Motivational", "Funny", "Romantic", "Professional", "Casual", "Inspirational"]
        if vibe not in valid_vibes:
            return jsonify({'error': 'Invalid vibe selected'}), 400

        valid_languages = ["English", "Tamil", "Hindi"]
        if language not in valid_languages:
            return jsonify({'error': f'Invalid language selected. Choose from: {", ".join(valid_languages)}'}), 400

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

        response = model.generate_content(music_prompt)
        music = parse_gemini_response(response.text, is_music=True)
        app.logger.debug(f"Generated music suggestions: {music}")
        if not music:
            return jsonify({'error': 'No music suggestions generated'}), 500

        return jsonify({'musicSuggestions': music})
    except Exception as e:
        app.logger.error(f"Error in music_suggestions: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

if __name__ == '__main__':
    PORT = os.getenv('PORT', '4500')
    app.run(debug=True, port=int(PORT), host='0.0.0.0')