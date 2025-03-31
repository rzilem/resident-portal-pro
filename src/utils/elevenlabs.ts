
// Implementation for ElevenLabs TTS functionality

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

// Implementation of the speak function (client-side only)
export const speakWithElevenLabs = async (
  text: string,
  options: SpeakOptions = {}
): Promise<void> => {
  console.log('Speaking with ElevenLabs:', {
    text,
    voice: options.voice || 'default',
    model: options.model || 'default',
  });

  // Get integration settings from localStorage as a fallback
  let elevenlabsSettings;
  try {
    const integrationSettings = localStorage.getItem('integrationSettings');
    if (integrationSettings) {
      const parsedSettings = JSON.parse(integrationSettings);
      // Find ElevenLabs settings if they exist
      for (const userId in parsedSettings) {
        if (parsedSettings[userId]?.ElevenLabs) {
          elevenlabsSettings = parsedSettings[userId].ElevenLabs;
          break;
        }
      }
    }
  } catch (error) {
    console.error('Error getting ElevenLabs settings:', error);
  }

  // Check if we have valid settings to use
  const apiKey = elevenlabsSettings?.apiKey;
  const hasValidSettings = apiKey && apiKey.length >= 20;
  
  if (!hasValidSettings) {
    console.warn('No valid ElevenLabs API key found, falling back to browser TTS');
    throw new Error('No valid ElevenLabs API key found');
  }

  try {
    // Create audio element for playing the response
    const audioElement = new Audio();
    
    // Use the provided voice or default to SARAH
    const voiceId = options.voice || elevenlabsSettings?.defaultVoiceId || VOICE_OPTIONS.SARAH;
    // Use the provided model or default to eleven_turbo_v2
    const model = options.model || elevenlabsSettings?.defaultModel || 'eleven_turbo_v2';
    
    // Make the API request to ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: model,
        voice_settings: {
          stability: options.stability || 0.5,
          similarity_boost: options.similarityBoost || 0.75
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API returned ${response.status}: ${errorText}`);
    }

    // Get the audio blob and create an object URL
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Set up and play the audio
    audioElement.src = audioUrl;
    audioElement.play();
    
    // Return a promise that resolves when the audio is done playing
    return new Promise((resolve) => {
      audioElement.onended = () => {
        URL.revokeObjectURL(audioUrl); // Clean up
        resolve();
      };
      
      audioElement.onerror = (error) => {
        console.error('Error playing audio:', error);
        URL.revokeObjectURL(audioUrl); // Clean up
        resolve(); // Still resolve to continue the flow
      };
    });
  } catch (error) {
    console.error('Error with ElevenLabs TTS:', error);
    throw error; // Re-throw so we can fall back to browser TTS
  }
};

// Mock implementation of an ElevenLabs API test function
export const testElevenLabsAPI = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) {
    return false;
  }

  // Attempt a real API test instead of simulation
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      console.error('ElevenLabs API test failed:', await response.text());
      return false;
    }
    
    const data = await response.json();
    return Array.isArray(data.voices); // True if we got a valid response
  } catch (error) {
    console.error('Error testing ElevenLabs API:', error);
    return false;
  }
};
