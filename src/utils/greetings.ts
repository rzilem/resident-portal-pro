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
    presetGreetingId?: string
  }
): Promise<void> => {
  if (!name) return;
  
  let message = '';
  
  // Determine which type of greeting to use
  if (options?.greetingType === 'custom' && options.customGreeting) {
    // Use custom greeting with name substitution
    message = options.customGreeting.replace('{name}', name);
    console.log('Using custom greeting:', message); // Add logging for debugging
  } else if (options?.greetingType === 'preset' && options.presetGreetingId) {
    // Use preset greeting
    const presetText = getPresetGreetingById(options.presetGreetingId);
    if (presetText) {
      message = presetText.replace('{name}', name);
    } else {
      // Fallback to default if preset not found
      const greeting = getTimeBasedGreeting();
      message = `${greeting}, ${name}. Welcome to your dashboard.`;
    }
  } else {
    // Use default time-based greeting
    const greeting = getTimeBasedGreeting();
    message = `${greeting}, ${name}. Welcome to your dashboard.`;
  }
  
  // Log the final message for debugging
  console.log('Final greeting message:', message);
  
  // Use ElevenLabs for high-quality natural voice
  await speakWithElevenLabs(message, {
    voice: VOICE_OPTIONS.SARAH, // Choose the voice that sounds best
    model: 'eleven_turbo_v2',   // Faster model with good quality
  });
};
