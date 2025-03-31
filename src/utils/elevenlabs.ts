// Mock implementation for ElevenLabs TTS functionality

export interface SpeakOptions {
  voice?: string;
  model?: string;
  stability?: number;
  similarityBoost?: number;
}

// Voice IDs for the most popular voices in the ElevenLabs platform
export const VOICE_OPTIONS = {
  ARIA: '9BWtsMINqrJLrRacOk9x',
  ROGER: 'CwhRBWXzGAHq8TQ4Fs17',
  SARAH: 'EXAVITQu4vr4xnSDxMaL',
  DANIEL: 'onwK4e9ZLuTAKqWW03F9'
};

// Mock implementation of the speak function (client-side only)
export const speakWithElevenLabs = async (
  text: string,
  options: SpeakOptions = {}
): Promise<void> => {
  console.log('Speaking with ElevenLabs:', {
    text,
    voice: options.voice || 'default',
    model: options.model || 'default',
  });

  // In a real implementation, this would make an API call to ElevenLabs,
  // get the audio data, and play it

  // For now, we'll use the browser's built-in speech synthesis as a fallback
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Use a female voice if available
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('female') || 
        voice.name.includes('woman') || 
        voice.name.includes('girl')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      window.speechSynthesis.speak(utterance);
      
      // Return a promise that resolves when the speech is done
      return new Promise((resolve, reject) => {
        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
      });
    } else {
      console.warn('Speech synthesis not supported in this browser');
      return Promise.resolve();
    }
  } catch (error) {
    console.error('Error with speech synthesis:', error);
    return Promise.resolve();
  }
};

// Mock implementation of an ElevenLabs API test function
export const testElevenLabsAPI = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) {
    return false;
  }

  // Simulate API request
  console.log('Testing ElevenLabs API connection...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation to simulate a real API check
  // In reality, this would make a request to ElevenLabs' API
  return apiKey.length >= 20;
};
