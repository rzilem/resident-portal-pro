
/**
 * Utility functions for generating time-based greetings
 */
import { speakWithElevenLabs, VOICE_OPTIONS } from './elevenlabs';
import { debugLog, errorLog } from '@/utils/debug';

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
export const speakGreeting = async (name: string | undefined): Promise<void> => {
  if (!name) return;
  
  const greeting = getTimeBasedGreeting();
  const message = `${greeting}, ${name}. Welcome to your dashboard.`;
  
  try {
    debugLog('Attempting to speak greeting with ElevenLabs...');
    
    // Use ElevenLabs for high-quality natural voice, with fallback to Web Speech API
    await speakWithElevenLabs(message, {
      voice: VOICE_OPTIONS.SARAH, // Choose the voice that sounds best
      model: 'eleven_turbo_v2',   // Faster model with good quality
      fallbackToDefault: true     // Fall back to Web Speech API if ElevenLabs fails
    });
    
    debugLog('Greeting completed successfully');
  } catch (error) {
    errorLog('Failed to speak greeting:', error);
    throw error;
  }
};
