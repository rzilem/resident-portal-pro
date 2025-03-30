
/**
 * Speech utilities including Web Speech API implementation
 */
import { debugLog, errorLog } from '@/utils/debug';

/**
 * Uses the Web Speech API to speak text
 */
export const fallbackToWebSpeech = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    debugLog('Using Web Speech API fallback');
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for better clarity
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      debugLog(`Available voices: ${voices.length}`);
      
      // Try to find a natural sounding voice
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || voice.name.includes('Natural'));
      
      if (preferredVoice) {
        debugLog(`Using preferred voice: ${preferredVoice.name}`);
        utterance.voice = preferredVoice;
      } else if (voices.length > 0) {
        // Use the first available voice if no preferred voice is found
        debugLog(`Using default voice: ${voices[0].name}`);
        utterance.voice = voices[0];
      }
      
      utterance.onend = () => {
        debugLog('Web Speech API playback completed');
        resolve();
      };
      
      utterance.onerror = (event) => {
        errorLog(`Speech synthesis error: ${event.error}`);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };
      
      // Load voices if they're not loaded yet
      if (voices.length === 0) {
        debugLog('No voices available, waiting for voices to load');
        window.speechSynthesis.onvoiceschanged = () => {
          const updatedVoices = window.speechSynthesis.getVoices();
          const naturalVoice = updatedVoices.find(voice => 
            voice.name.includes('Google') || voice.name.includes('Natural'));
            
          if (naturalVoice) {
            utterance.voice = naturalVoice;
            debugLog(`Loaded voice: ${naturalVoice.name}`);
          } else if (updatedVoices.length > 0) {
            utterance.voice = updatedVoices[0];
            debugLog(`Loaded default voice: ${updatedVoices[0].name}`);
          }
          
          window.speechSynthesis.speak(utterance);
        };
      } else {
        // Speak with available voices
        window.speechSynthesis.speak(utterance);
      }
    } else {
      errorLog('Speech synthesis not supported in this browser');
      reject(new Error('Speech synthesis not supported in this browser'));
    }
  });
};
