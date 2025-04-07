
/**
 * Utility functions for generating time-based greetings
 */
import { speakWithElevenLabs, VOICE_OPTIONS } from './elevenlabs';
import { getPresetGreetingById } from './presetGreetings';

/**
 * Returns the appropriate greeting based on the current time of day
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};

/**
 * Uses ElevenLabs API to speak a greeting to the user
 * Falls back to Web Speech API if ElevenLabs is unavailable
 */
export const speakGreeting = async (
  name: string | undefined, 
  options?: { 
    greetingType?: 'default' | 'custom' | 'preset',
    customGreeting?: string,
    presetGreetingId?: string,
    apiKey?: string,
    voiceId?: string,
    model?: string
  }
): Promise<void> => {
  if (!name) return;
  
  let message = '';
  
  console.log('Speaking greeting with options:', options);
  
  // Determine which type of greeting to use
  if (options?.greetingType === 'custom' && options.customGreeting) {
    // Use custom greeting with name substitution
    message = options.customGreeting.replace(/{name}/g, name);
    console.log('Using custom greeting:', message);
  } else if (options?.greetingType === 'preset' && options.presetGreetingId) {
    // Use preset greeting
    const presetText = getPresetGreetingById(options.presetGreetingId);
    if (presetText) {
      message = presetText.replace(/{name}/g, name);
      console.log('Using preset greeting:', message);
    } else {
      // Fallback to default if preset not found
      console.log('Preset not found, falling back to default');
      const greeting = getTimeBasedGreeting();
      message = `${greeting}, ${name}. Welcome to your dashboard.`;
    }
  } else {
    // Use default time-based greeting
    console.log('Using default time-based greeting');
    const greeting = getTimeBasedGreeting();
    message = `${greeting}, ${name}. Welcome to your dashboard.`;
  }
  
  // Log the final message for debugging
  console.log('Final greeting message:', message);
  
  try {
    // Try to use ElevenLabs first (with explicit error handling)
    await speakWithElevenLabs(message, {
      voice: options?.voiceId || VOICE_OPTIONS.SARAH, 
      model: options?.model || 'eleven_turbo_v2',
      apiKey: options?.apiKey
    });
    console.log('Successfully used ElevenLabs for greeting');
  } catch (error) {
    console.error('ElevenLabs TTS failed, falling back to Web Speech API:', error);
    
    // Only fall back to Web Speech API if ElevenLabs fails
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
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
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }
};
