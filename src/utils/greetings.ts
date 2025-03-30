
/**
 * Utility functions for generating time-based greetings
 */

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
 * Uses the Web Speech API to speak a greeting to the user
 */
export const speakGreeting = (name: string | undefined): void => {
  if (!name) return;
  
  // Only proceed if speech synthesis is available
  if ('speechSynthesis' in window) {
    const greeting = getTimeBasedGreeting();
    const message = `${greeting}, ${name}. Welcome to your dashboard.`;
    
    // Create a new utterance with the greeting message
    const utterance = new SpeechSynthesisUtterance(message);
    
    // Use a slightly slower rate for better clarity
    utterance.rate = 0.9;
    
    // Use a more natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || voice.name.includes('Natural') || 
      voice.name.includes('Male') || voice.name.includes('Female'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Speak the greeting
    window.speechSynthesis.speak(utterance);
  }
};
