// Define voice options
export const VOICE_OPTIONS = {
  ARIA: "9BWtsMINqrJLrRacOk9x",
  ROGER: "CwhRBWXzGAHq8TQ4Fs17",
  SARAH: "EXAVITQu4vr4xnSDxMaL",
  DANIEL: "onwK4e9ZLuTAKqWW03F9"
};

// Test the ElevenLabs API connection
export const testElevenLabsAPI = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) {
    console.error('No ElevenLabs API key provided for testing');
    return false;
  }

  try {
    console.log('Testing ElevenLabs API connection...');
    
    // Use the voices endpoint to test the API key
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'xi-api-key': apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API test failed:', response.status, errorText);
      return false;
    }

    const data = await response.json();
    console.log('ElevenLabs API test successful, found voices:', data.voices?.length || 0);
    return true;
  } catch (error) {
    console.error('Error testing ElevenLabs API:', error);
    return false;
  }
};

// Speak using ElevenLabs TTS
export const speakWithElevenLabs = async (
  text: string,
  options: {
    voice?: string;
    model?: string;
    stability?: number;
    similarity?: number;
    style?: number;
    speakerBoost?: boolean;
  } = {}
): Promise<void> => {
  try {
    // Get the ElevenLabs API key from local storage or integration service
    const integrationSettings = localStorage.getItem('integrationSettings');
    let apiKey = '';
    
    if (integrationSettings) {
      try {
        const parsedSettings = JSON.parse(integrationSettings);
        apiKey = parsedSettings['current-user']?.['ElevenLabs']?.apiKey || '';
      } catch (e) {
        console.error('Error parsing integration settings:', e);
      }
    }
    
    if (!apiKey) {
      console.error('No ElevenLabs API key found');
      throw new Error('No ElevenLabs API key found');
    }

    const {
      voice = "EXAVITQu4vr4xnSDxMaL", // Default to Sarah
      model = "eleven_turbo_v2", // Default to faster model
      stability = 0.5,
      similarity = 0.8,
      style = 0.0,
      speakerBoost = true,
    } = options;

    console.log('Generating speech with ElevenLabs using settings:', {
      voice,
      model,
      stability,
      similarity,
      style,
      speakerBoost,
      textLength: text.length
    });

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability,
            similarity_boost: similarity,
            style,
            use_speaker_boost: speakerBoost,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }

    // Get the audio blob from the response
    const audioBlob = await response.blob();
    
    // Create an audio element and play the speech
    const audio = new Audio();
    audio.src = URL.createObjectURL(audioBlob);
    
    console.log('Playing ElevenLabs speech...');
    await audio.play();
    
    // Return a promise that resolves when the audio finishes playing
    return new Promise((resolve) => {
      audio.onended = () => {
        console.log('ElevenLabs speech playback complete');
        resolve();
      };
    });
  } catch (error) {
    console.error('Error speaking with ElevenLabs:', error);
    throw error;
  }
};
