
import {
  VOICE_OPTIONS,
  testElevenLabsAPI,
  generateSpeech,
  speakWithElevenLabs,
  playAudioBlob
} from './elevenlabs';

// This file is purely for TypeScript to validate that all exports exist
// It will never be executed, but ensures that all imports are valid during build

export function validateElevenLabsExports(): void {
  // Validate that all exports exist
  console.log(
    VOICE_OPTIONS,
    typeof testElevenLabsAPI, 
    typeof generateSpeech,
    typeof speakWithElevenLabs,
    typeof playAudioBlob
  );
  
  // Log validation success
  console.log('ElevenLabs exports validated successfully');
}
