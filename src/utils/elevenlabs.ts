
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
  } = {}
): Promise<void> {
  try {
    console.log('Speaking with ElevenLabs:', { text, options });
    
    // Get API key from localStorage or another source
    // In a real implementation, you would get this from a secure source
    const apiKey = localStorage.getItem('elevenLabsApiKey') || '';
    
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
    // In a real implementation, we would make an actual API call
    // This is a simplified version that just checks if the API key is provided
    // and simulates the API response
    
    // Example of a real API call to ElevenLabs (commented out)
    // const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    //   method: 'GET',
    //   headers: {
    //     'xi-api-key': apiKey,
    //     'Content-Type': 'application/json'
    //   }
    // });
    
    // if (!response.ok) {
    //   throw new Error(`API request failed with status ${response.status}`);
    // }
    
    // const data = await response.json();
    // return data && Array.isArray(data.voices);
    
    // For now, we'll simulate a successful API call after a short delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate 80% success rate for demonstration
    const isSuccessful = Math.random() < 0.8;
    console.log(`ElevenLabs API test ${isSuccessful ? 'successful' : 'failed'}`);
    
    return isSuccessful;
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
  
  try {
    // In a real implementation, we would make an actual API call to the ElevenLabs API
    // This is a simplified version that just simulates the API response
    
    // Example of a real API call (commented out)
    // const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    //   method: 'POST',
    //   headers: {
    //     'xi-api-key': apiKey,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     text,
    //     model_id: model,
    //     voice_settings: {
    //       stability: 0.5,
    //       similarity_boost: 0.5
    //     }
    //   })
    // });
    
    // if (!response.ok) {
    //   throw new Error(`API request failed with status ${response.status}`);
    // }
    
    // return await response.blob();
    
    // For demonstration, we'll simulate a response after a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock audio blob
    const mockAudio = new Blob([new Uint8Array([1, 2, 3, 4])], { type: 'audio/mpeg' });
    return mockAudio;
  } catch (error) {
    console.error('Error generating speech:', error);
    return null;
  }
}
