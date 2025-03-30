/**
 * ElevenLabs Text-to-Speech API integration
 */
import { integrationService } from '@/services/integrationService';
import { debugLog, errorLog } from '@/utils/debug';
import { fallbackToWebSpeech } from '@/utils/speech';

// Voice IDs for high-quality ElevenLabs voices
export const VOICE_OPTIONS = {
  ARIA: '9BWtsMINqrJLrRacOk9x',   // Female, warm and professional
  ROGER: 'CwhRBWXzGAHq8TQ4Fs17',  // Male, deep and authoritative
  SARAH: 'EXAVITQu4vr4xnSDxMaL',  // Female, friendly and approachable
  DANIEL: 'onwK4e9ZLuTAKqWW03F9', // Male, friendly and conversational
};

interface SpeakOptions {
  voice?: string;
  model?: string;
  fallbackToDefault?: boolean; // Whether to fall back to Web Speech API if ElevenLabs fails
}

/**
 * Speaks text using ElevenLabs high-quality voice API
 */
export const speakWithElevenLabs = async (
  text: string, 
  { voice, model, fallbackToDefault = false }: SpeakOptions = {}
): Promise<void> => {
  try {
    // Get the API key from integration settings
    const elevenLabsIntegration = integrationService.getIntegration('current-user', 'ElevenLabs');
    
    // Log integration info for debugging (without exposing full API key)
    if (elevenLabsIntegration?.apiKey) {
      const keyLength = elevenLabsIntegration.apiKey.length;
      debugLog(`Found ElevenLabs API key (${keyLength} chars)`);
    } else {
      debugLog('No ElevenLabs API key found in integration settings');
    }
    
    // Check for API key in integration settings or env
    const apiKey = elevenLabsIntegration?.apiKey || import.meta.env.VITE_ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      errorLog('ElevenLabs API key not found. Cannot proceed with speech synthesis.');
      
      // If fallback is requested, use the Web Speech API
      if (fallbackToDefault) {
        debugLog('Falling back to Web Speech API...');
        return fallbackToWebSpeech(text);
      }
      
      throw new Error('ElevenLabs API key not found');
    }
    
    // Use settings from integration or defaults
    const selectedVoice = voice || elevenLabsIntegration?.defaultVoiceId || VOICE_OPTIONS.SARAH;
    const selectedModel = model || elevenLabsIntegration?.defaultModel || 'eleven_turbo_v2';
    
    debugLog(`Using ElevenLabs with voice: ${selectedVoice}, model: ${selectedModel}`);
    
    // Create request to ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: selectedModel,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    // Convert the response to audio and play it
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Clean up URL object after playing
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    
    debugLog('Playing ElevenLabs audio...');
    await audio.play();
    
    // Return a promise that resolves when audio finishes playing
    return new Promise((resolve) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        debugLog('ElevenLabs audio playback completed');
        resolve();
      };
    });
  } catch (error) {
    errorLog('Error with ElevenLabs TTS:', error);
    
    // If fallback is requested, use the Web Speech API
    if (fallbackToDefault) {
      debugLog('Falling back to Web Speech API due to error');
      return fallbackToWebSpeech(text);
    }
    
    // Otherwise, throw the error
    throw error;
  }
};
