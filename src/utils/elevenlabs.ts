
/**
 * ElevenLabs Text-to-Speech API integration
 */
import { integrationService } from '@/services/integrationService';

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
}

/**
 * Speaks text using ElevenLabs high-quality voice API
 */
export const speakWithElevenLabs = async (
  text: string, 
  { voice, model }: SpeakOptions = {}
): Promise<void> => {
  try {
    // Get the API key from integration settings
    const elevenLabsIntegration = integrationService.getIntegration('current-user', 'ElevenLabs');
    const apiKey = elevenLabsIntegration?.apiKey || import.meta.env.VITE_ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      console.warn('ElevenLabs API key not found. Falling back to Web Speech API.');
      fallbackToWebSpeech(text);
      return;
    }
    
    // Use settings from integration or defaults
    const selectedVoice = voice || elevenLabsIntegration?.defaultVoiceId || VOICE_OPTIONS.SARAH;
    const selectedModel = model || elevenLabsIntegration?.defaultModel || 'eleven_turbo_v2';
    
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
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // Convert the response to audio and play it
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Clean up URL object after playing
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    
    await audio.play();
  } catch (error) {
    console.error('Error with ElevenLabs TTS:', error);
    // Fall back to Web Speech API if ElevenLabs fails
    fallbackToWebSpeech(text);
  }
};

/**
 * Fallback to Web Speech API if ElevenLabs is unavailable
 */
const fallbackToWebSpeech = (text: string): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower for better clarity
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || voice.name.includes('Natural'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
};
