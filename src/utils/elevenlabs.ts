
// ElevenLabs API utility functions

export const VOICE_OPTIONS = {
  ARIA: '9BWtsMINqrJLrRacOk9x',   // Aria - Female, Professional
  ROGER: 'CwhRBWXzGAHq8TQ4Fs17',  // Roger - Male, Authoritative
  SARAH: 'EXAVITQu4vr4xnSDxMaL',  // Sarah - Female, Friendly
  DANIEL: 'onwK4e9ZLuTAKqWW03F9'  // Daniel - Male, Conversational
};

/**
 * Speaks text using ElevenLabs API
 * @param text Text to convert to speech and play
 * @param options Options for speech generation
 * @returns Promise that resolves when speech playback starts
 */
export async function speakWithElevenLabs(
  text: string, 
  options: {
    voice?: string;
    model?: string;
    apiKey?: string;
  } = {}
): Promise<void> {
  try {
    console.log('Speaking with ElevenLabs:', { 
      text, 
      voice: options.voice || VOICE_OPTIONS.SARAH,
      model: options.model || 'eleven_multilingual_v2' 
    });
    
    // Get API key from options or localStorage as fallback
    const apiKey = options.apiKey || localStorage.getItem('elevenLabsApiKey') || '';
    
    if (!apiKey) {
      console.error('ElevenLabs API key not found');
      throw new Error('ElevenLabs API key is required');
    }
    
    // Get speech blob using the generateSpeech function
    const audioBlob = await generateSpeech(text, apiKey, {
      voiceId: options.voice || VOICE_OPTIONS.SARAH,
      model: options.model || 'eleven_multilingual_v2'
    });
    
    if (!audioBlob) {
      throw new Error('Failed to generate speech');
    }
    
    // Create an audio URL and play it
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Clean up when audio finishes playing
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    
    // Start playing
    await audio.play();
    
    return;
  } catch (error) {
    console.error('Error with ElevenLabs speech:', error);
    throw error; // Rethrow to allow caller to catch and handle
  }
}

/**
 * Tests an ElevenLabs API connection
 * @param apiKey ElevenLabs API key
 * @returns Promise<boolean> indicating if test was successful
 */
export async function testElevenLabsAPI(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;
  
  console.log('Testing ElevenLabs API connection...');
  
  try {
    // Make an actual API call to ElevenLabs to test the connection
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    return data && Array.isArray(data.voices);
  } catch (error) {
    console.error('Error testing ElevenLabs API:', error);
    return false;
  }
}

/**
 * Generates speech from text using ElevenLabs API
 * @param text Text to convert to speech
 * @param apiKey ElevenLabs API key
 * @param options Options for speech generation
 * @returns Promise<Blob> Audio blob or null if failed
 */
export async function generateSpeech(
  text: string, 
  apiKey: string, 
  options: {
    voiceId?: string;
    model?: string;
  } = {}
): Promise<Blob | null> {
  if (!apiKey || !text) return null;
  
  const voiceId = options.voiceId || VOICE_OPTIONS.SARAH;
  const model = options.model || 'eleven_multilingual_v2';
  
  console.log(`Generating speech with ElevenLabs API using voice: ${voiceId}, model: ${model}`);
  
  try {
    // Make the actual API call to ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API request failed with status ${response.status}:`, errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error generating speech:', error);
    return null;
  }
}
