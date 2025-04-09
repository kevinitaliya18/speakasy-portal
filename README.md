
# Python Text-to-Speech Converter

A web application that converts text to speech using Python Flask backend and a simple HTML/JavaScript frontend.

## Features

- Multiple language support (English, Hindi, Gujarati, and more)
- Adjustable speed for speech generation
- Audio preview functionality
- MP3 download capability
- Simple and responsive user interface

## Setup Instructions

1. **Install Python Requirements**
   ```
   pip install -r requirements.txt
   ```

2. **Run the Application**
   ```
   python app.py
   ```

3. **Access the Application**
   Open your browser and navigate to: `http://127.0.0.1:5000`

## Project Structure

- `app.py` - Flask backend application
- `templates/` - HTML templates
- `static/` - Static files (CSS, JavaScript, audio files)
  - `css/style.css` - Application styling
  - `js/app.js` - Frontend JavaScript
  - `audio/` - Generated audio files

## How to Use

1. Enter the text you want to convert to speech
2. Select your preferred language
3. Adjust the speech speed
4. Click "Convert to Speech"
5. Preview the audio
6. Download the MP3 file if desired

## Note

This application uses the gTTS (Google Text-to-Speech) library for converting text to speech. Internet connection is required for the API to work.
