# app.py
from flask import Flask, render_template, request, jsonify
import base64
import json
import time
import os
import requests
from urllib.parse import quote_plus # For URL encoding search queries
from dotenv import load_dotenv # Import load_dotenv

# Load environment variables from .env file
# In a local development environment, make sure you have a .env file
# in the same directory as app.py with your API keys.
load_dotenv()

app = Flask(__name__)

# --- API Keys ---
# Retrieve API keys from environment variables.
# The hardcoded values below are for convenience if .env is not set up,
# but it's strongly recommended to use environment variables in production.
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', "AIzaSyDRV8RMiZ0tp-zVu3QqrIdLCnBoVQXDJZo")
SPOTIFY_CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID', "d293b71c9d4946db84a72801a05018ef")
SPOTIFY_CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET', "9d6631feb30c4d94a5a81bf7e7ef5495")

# Ensure API keys are loaded
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found. Please set it in your environment or .env file.")
if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
    print("Warning: Spotify API credentials not found. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.")


# Global variable to store Spotify access token and its expiry time
# In a larger app, consider a proper caching mechanism (e.g., Redis)
spotify_access_token = None
spotify_token_expires_at = 0

# --- Utility function for Exponential Backoff ---
def make_api_call_with_backoff(url, payload=None, headers=None, method='POST', max_retries=5, initial_delay=1):
    """
    Makes an API call with exponential backoff.
    """
    delay = initial_delay
    for i in range(max_retries):
        try:
            if method == 'POST':
                response = requests.post(url, headers=headers, json=payload)
            elif method == 'GET':
                response = requests.get(url, headers=headers, params=payload) # Use params for GET requests
            else:
                raise ValueError("Unsupported HTTP method")

            response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"API call failed (attempt {i + 1}/{max_retries}): {e}")
            if i < max_retries - 1:
                time.sleep(delay)
                delay *= 2  # Exponentially increase delay
            else:
                raise # Re-raise the last exception if all retries fail
    return None

def get_spotify_access_token():
    """
    Fetches and caches the Spotify API access token.
    Refreshes if the current token is expired or not available.
    """
    global spotify_access_token, spotify_token_expires_at

    # Check if the current token is still valid
    if spotify_access_token and time.time() < spotify_token_expires_at:
        return spotify_access_token

    # Token is expired or not available, request a new one
    token_url = "https://accounts.spotify.com/api/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "client_credentials",
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET
    }

    try:
        response = requests.post(token_url, headers=headers, data=data)
        response.raise_for_status()
        token_info = response.json()
        spotify_access_token = token_info.get("access_token")
        expires_in = token_info.get("expires_in", 3600) # Default to 1 hour
        spotify_token_expires_at = time.time() + expires_in - 60 # Refresh 1 minute before actual expiry

        if not spotify_access_token:
            print("Error: Spotify access token not found in response.")
            return None
        return spotify_access_token
    except requests.exceptions.RequestException as e:
        print(f"Error getting Spotify access token: {e}")
        return None

def search_spotify_track(query):
    """
    Searches Spotify for a track and returns its URL.
    """
    token = get_spotify_access_token()
    if not token:
        return None

    search_url = "https://api.spotify.com/v1/search"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    params = {
        "q": query,
        "type": "track",
        "limit": 1
    }

    try:
        result = make_api_call_with_backoff(search_url, payload=params, headers=headers, method='GET')
        if result and result.get('tracks') and result['tracks'].get('items'):
            track = result['tracks']['items'][0]
            # Return the direct link to the track
            return track['external_urls'].get('spotify')
        return None
    except Exception as e:
        print(f"Error searching Spotify: {e}")
        return None

@app.route('/')
def index():
    """Renders the main HTML page for image upload."""
    return render_template('index.html')

@app.route('/generate_caption', methods=['POST'])
def generate_caption():
    """
    Handles image upload and generates caption, song, and hashtags using an LLM.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    user_input_text = request.form.get('input_text', '')

    if image_file.filename == '':
        return jsonify({'error': 'No selected image'}), 400

    try:
        # Read image data and encode it to base64
        image_data = image_file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        mime_type = image_file.mimetype

        # Construct the prompt for the LLM
        # Ask for song title and artist separately
        prompt_text = (
            f"Analyze the uploaded image. The user has provided the following context/request: '{user_input_text}'. "
            "Based on the image content and the provided context, generate:\n"
            "1. A concise and engaging Instagram **caption**.\n"
            "2. A relevant **song title** (just the song title, no artist yet).\n"
            "3. The **artist** for that song.\n"
            "4. A list of 5-10 popular and relevant **hashtags**.\n\n"
            "Provide the output in JSON format with keys 'caption', 'song_title', 'song_artist', and 'hashtags' (which should be an array of strings)."
        )

        # Prepare the payload for the Gemini API
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": prompt_text},
                        {
                            "inlineData": {
                                "mimeType": mime_type,
                                "data": base64_image
                            }
                        }
                    ]
                }
            ],
            "generationConfig": {
                "responseMimeType": "application/json",
                "responseSchema": {
                    "type": "OBJECT",
                    "properties": {
                        "caption": {"type": "STRING"},
                        "song_title": {"type": "STRING"},
                        "song_artist": {"type": "STRING"},
                        "hashtags": {
                            "type": "ARRAY",
                            "items": {"type": "STRING"}
                        }
                    },
                    "required": ["caption", "song_title", "song_artist", "hashtags"]
                }
            }
        }

        # Gemini API URL
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={GEMINI_API_KEY}"
        headers = {'Content-Type': 'application/json'}

        # Make the LLM API call with exponential backoff
        llm_result = make_api_call_with_backoff(api_url, payload, headers)

        if llm_result and llm_result.get('candidates') and llm_result['candidates'][0].get('content') and llm_result['candidates'][0]['content'].get('parts'):
            json_string = llm_result['candidates'][0]['content']['parts'][0]['text']
            try:
                parsed_llm_json = json.loads(json_string)

                caption = parsed_llm_json.get('caption', '')
                song_title = parsed_llm_json.get('song_title', '')
                song_artist = parsed_llm_json.get('song_artist', '')
                hashtags = parsed_llm_json.get('hashtags', [])

                full_song_query = f"{song_title} {song_artist}" if song_artist else song_title
                spotify_url = search_spotify_track(full_song_query)

                # Prepare the final response
                response_data = {
                    'caption': caption,
                    'song': f"{song_title} - {song_artist}" if song_title else "No song recommendation.",
                    'song_url': spotify_url, # Add the Spotify URL here
                    'hashtags': hashtags
                }
                return jsonify(response_data), 200

            except json.JSONDecodeError:
                return jsonify({'error': 'Failed to parse LLM response as JSON', 'raw_response': json_string}), 500
        else:
            return jsonify({'error': 'LLM did not return valid content', 'raw_result': llm_result}), 500

    except Exception as e:
        print(f"Error during caption generation: {e}")
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    # --- IMPORTANT FIX: Create templates/index.html BEFORE running the app ---
    # Ensure a 'templates' directory exists for render_template
    if not os.path.exists('templates'):
        os.makedirs('templates')

    # Create the index.html file if it doesn't exist or update it
    # Note: In a real project, index.html would be a static file,
    # and this part would typically not be in app.py.
    # It's included here for single-file demonstrative convenience.
    with open('templates/index.html', 'w') as f:
        f.write("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instagram Caption Generator</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
        }
        .loading-spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #3b82f6;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
            display: none; /* Hidden by default */
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="container bg-white p-8 rounded-xl shadow-lg">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Instagram Caption AI</h1>
        <p class="text-center text-gray-600 mb-8">Upload an image and tell me what you want, and I'll generate a caption, song, and hashtags!</p>

        <form id="captionForm" class="space-y-6">
            <div>
                <label for="imageUpload" class="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                <input type="file" id="imageUpload" accept="image/*" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
            </div>

            <div>
                <label for="inputText" class="block text-sm font-medium text-gray-700 mb-2">What's in the image or what do you want? (Optional)</label>
                <textarea id="inputText" rows="3" placeholder="e.g., 'My dog playing in the park', 'A vibrant sunset over the ocean', 'Something inspiring'" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>

            <button type="submit" class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                Generate Suggestions
                <div id="loadingSpinner" class="loading-spinner ml-3"></div>
            </button>
        </form>

        <div id="results" class="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200 hidden">
            <h2 class="text-xl font-semibold text-blue-800 mb-4">Your Suggestions:</h2>
            <div class="mb-4">
                <h3 class="font-medium text-gray-700 mb-1">Caption:</h3>
                <p id="outputCaption" class="text-gray-900 bg-white p-3 rounded-md border border-gray-200 break-words"></p>
                <button onclick="copyToClipboard('outputCaption')" class="mt-2 text-blue-600 hover:text-blue-800 text-sm focus:outline-none">Copy Caption</button>
            </div>
            <div class="mb-4">
                <h3 class="font-medium text-gray-700 mb-1">Song Recommendation:</h3>
                <p id="outputSong" class="text-gray-900 bg-white p-3 rounded-md border border-gray-200 break-words"></p>
                <a id="outputSongLink" href="#" target="_blank" class="hidden mt-2 text-blue-600 hover:text-blue-800 text-sm focus:outline-none">Listen on Spotify</a>
                <button onclick="copyToClipboard('outputSong')" class="mt-2 text-blue-600 hover:text-blue-800 text-sm focus:outline-none">Copy Song Info</button>
            </div>
            <div>
                <h3 class="font-medium text-gray-700 mb-1">Hashtags:</h3>
                <p id="outputHashtags" class="text-gray-900 bg-white p-3 rounded-md border border-gray-200 break-words"></p>
                <button onclick="copyToClipboard('outputHashtags')" class="mt-2 text-blue-600 hover:text-blue-800 text-sm focus:outline-none">Copy Hashtags</button>
            </div>
        </div>

        <div id="errorMessage" class="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg hidden" role="alert">
            <p class="font-bold">Error:</p>
            <p id="errorText"></p>
        </div>
    </div>

    <script>
        document.getElementById('captionForm').addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            const imageInput = document.getElementById('imageUpload');
            const inputText = document.getElementById('inputText').value;
            const resultsDiv = document.getElementById('results');
            const errorMessageDiv = document.getElementById('errorMessage');
            const errorText = document.getElementById('errorText');
            const loadingSpinner = document.getElementById('loadingSpinner');
            const submitButton = this.querySelector('button[type="submit"]');
            const outputSongLink = document.getElementById('outputSongLink');


            // Hide previous results and errors
            resultsDiv.classList.add('hidden');
            errorMessageDiv.classList.add('hidden');
            errorText.textContent = '';
            outputSongLink.classList.add('hidden'); // Hide Spotify link initially
            outputSongLink.href = '#';

            // Show loading spinner and disable button
            loadingSpinner.style.display = 'inline-block';
            submitButton.disabled = true;
            submitButton.classList.add('opacity-50', 'cursor-not-allowed');

            const formData = new FormData();
            formData.append('image', imageInput.files[0]);
            formData.append('input_text', inputText);

            try {
                const response = await fetch('/generate_caption', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Something went wrong on the server.');
                }

                const data = await response.json();
                document.getElementById('outputCaption').textContent = data.caption;
                document.getElementById('outputSong').textContent = data.song;
                document.getElementById('outputHashtags').textContent = data.hashtags.join(' ');

                // Handle Spotify link
                if (data.song_url) {
                    outputSongLink.href = data.song_url;
                    outputSongLink.classList.remove('hidden');
                } else {
                    outputSongLink.classList.add('hidden');
                }

                resultsDiv.classList.remove('hidden');

            } catch (error) {
                console.error('Fetch error:', error);
                errorText.textContent = error.message;
                errorMessageDiv.classList.remove('hidden');
            } finally {
                // Hide loading spinner and re-enable button
                loadingSpinner.style.display = 'none';
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });

        function copyToClipboard(elementId) {
            const element = document.getElementById(elementId);
            const textToCopy = element.textContent || element.innerText;

            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed'; // Prevents scrolling to bottom of page in some browsers
            textarea.style.left = '-9999px'; // Move off-screen
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'Copied!' : 'Failed to copy.';
                // You could add a temporary visual feedback here, e.g., a small pop-up message
                console.log(msg);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            } finally {
                document.body.removeChild(textarea);
            }
        }
    </script>
</body>
</html>
""")
    app.run(debug=True, port=5001) # Set debug=False in production
