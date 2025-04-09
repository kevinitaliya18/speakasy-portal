
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';

interface AudioResponse {
  success: boolean;
  audioUrl: string;
  gender: string;
  translated: boolean;
  language: string;
  originalText: string;
  translatedText: string;
  error?: string;
}

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [language, setLanguage] = useState<string>('en-US');
  const [speed, setSpeed] = useState<boolean>(false);
  const [gender, setGender] = useState<string>('female');
  const [translate, setTranslate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [audioData, setAudioData] = useState<AudioResponse | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const languageOptions = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'hi-IN', label: 'Hindi' },
    { value: 'gu-IN', label: 'Gujarati' },
    { value: 'fr-FR', label: 'French' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
    { value: 'zh-CN', label: 'Chinese' },
    { value: 'ar-SA', label: 'Arabic' },
    { value: 'ru-RU', label: 'Russian' },
    { value: 'pt-BR', label: 'Portuguese' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error('Please enter some text to convert');
      return;
    }

    setLoading(true);
    setAudioData(null);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language,
          speed,
          gender,
          translate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAudioData(data);
        toast.success('Audio generated successfully!');
        
        // Preload the audio to prevent buffering
        if (audioRef.current) {
          audioRef.current.load();
        }
      } else {
        toast.error(data.error || 'Failed to generate audio');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAudio = async () => {
    if (!audioData?.audioUrl) return;

    try {
      // Create an invisible anchor element to trigger download
      const link = document.createElement('a');
      
      // Get the blob from the audio source
      const response = await fetch(audioData.audioUrl);
      const blob = await response.blob();
      
      // Create a downloadable url from the blob
      const url = window.URL.createObjectURL(blob);
      
      // Set up the download link
      link.href = url;
      link.download = `speech_${Date.now()}.mp3`;
      
      // Append to document, click, and clean up
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download audio');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Text to Speech Converter</h1>
          <p className="text-gray-600">Convert your text into natural-sounding speech in multiple languages</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                Text to convert
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                placeholder="Enter your text here..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Voice Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="speed"
                  checked={speed}
                  onChange={(e) => setSpeed(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="speed" className="ml-2 text-sm text-gray-700">
                  Slow Speed
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="translate"
                  checked={translate}
                  onChange={(e) => setTranslate(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="translate" className="ml-2 text-sm text-gray-700">
                  Translate from English
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              {loading ? 'Generating...' : 'Convert to Speech'}
            </button>
          </form>
        </div>

        {audioData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Audio</h2>
            
            {audioData.translated && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700">Original English Text:</p>
                <p className="text-gray-600">{audioData.originalText}</p>
                <p className="text-sm font-medium text-gray-700 mt-2">Translated Text:</p>
                <p className="text-gray-600">{audioData.translatedText}</p>
              </div>
            )}
            
            <div className="mb-4">
              <audio 
                ref={audioRef}
                controls 
                className="w-full" 
                preload="auto"
                controlsList="nodownload"
              >
                <source src={audioData.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={downloadAudio}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Download MP3
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
