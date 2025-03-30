
/**
 * Utility functions for generating time-based greetings
 */
import { speakWithElevenLabs, VOICE_OPTIONS } from './elevenlabs';

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
    console.log('Attempting to speak greeting with ElevenLabs...');
    
    // Use ElevenLabs for high-quality natural voice
    await speakWithElevenLabs(message, {
      voice: VOICE_OPTIONS.SARAH, // Choose the voice that sounds best
      model: 'eleven_turbo_v2',   // Faster model with good quality
    });
    
    console.log('ElevenLabs greeting completed successfully');
  } catch (error) {
    console.error('Failed to use ElevenLabs for greeting, error:', error);
    // Do not automatically fall back to web speech - we'll let the calling code handle fallback
    throw error;
  }
};
