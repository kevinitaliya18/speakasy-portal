
from flask import Flask, request, jsonify, render_template, send_file
import os
import uuid
from gtts import gTTS
from flask_cors import CORS
from googletrans import Translator
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = 'static/audio'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize translator
translator = Translator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/convert', methods=['POST'])
def convert_text():
    data = request.json
    text = data.get('text', '')
    language = data.get('language', 'en-US')
    speed = data.get('speed', False)  # Default normal speed
    gender = data.get('gender', 'female')  # Default female voice
    translate_text = data.get('translate', False)  # Whether to translate the text
    
    logger.info(f"Received request: lang={language}, gender={gender}, translate={translate_text}")
    logger.info(f"Original text: {text}")
    
    # Language code mapping (simplified for gTTS compatibility)
    lang_map = {
        'en-US': 'en', 
        'en-GB': 'en',
        'hi-IN': 'hi',
        'gu-IN': 'gu',
        'fr-FR': 'fr',
        'es-ES': 'es', 
        'de-DE': 'de', 
        'it-IT': 'it',
        'ja-JP': 'ja',
        'ko-KR': 'ko',
        'zh-CN': 'zh-CN', 
        'ar-SA': 'ar',
        'ru-RU': 'ru',
        'pt-BR': 'pt'
    }
    
    # Convert to gTTS compatible language code
    tts_lang = lang_map.get(language, 'en')
    
    logger.info(f"Converting to TTS language: {tts_lang}")
    
    # Translate text if requested
    original_text = text
    if translate_text:
        try:
            logger.info(f"Translating from English to {tts_lang}")
            translated = translator.translate(text, dest=tts_lang, src='en')
            text = translated.text
            logger.info(f"Translated text: {text}")
        except Exception as e:
            logger.error(f"Translation error: {e}")
            # Continue with original text if translation fails
    
    # Create a unique filename
    # Include gender and language in the filename
    filename = f"{gender}_{tts_lang}_{uuid.uuid4()}.mp3"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    try:
        # Create gTTS object and save to file
        logger.info(f"Generating speech with gTTS: lang={tts_lang}, slow={speed}")
        tts = gTTS(text=text, lang=tts_lang, slow=speed)
        tts.save(filepath)
        
        # Return the URL to the audio file along with metadata
        audio_url = f"/static/audio/{filename}"
        return jsonify({
            "success": True, 
            "audioUrl": audio_url,
            "gender": gender,
            "translated": translate_text,
            "language": tts_lang,
            "originalText": original_text,
            "translatedText": text if translate_text else original_text
        })
    except Exception as e:
        logger.error(f"Error generating speech: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
