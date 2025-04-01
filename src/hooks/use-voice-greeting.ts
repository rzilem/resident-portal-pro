
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { speakGreeting } from '@/utils/greetings';
import { toast } from 'sonner';
import { useSettings } from '@/hooks/use-settings';
import { useElevenLabs } from '@/hooks/use-elevenlabs';

// Create a global flag to track if the greeting has played in this session
// This will ensure it only plays once even if the hook mounts multiple times
let hasGreetedGlobally = false;

export const useVoiceGreeting = () => {
  const { user } = useAuth();
  const { preferences } = useSettings();
  const { isElevenLabsConnected } = useElevenLabs();
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  
  useEffect(() => {
    // Exit early if we've already greeted globally in this session
    if (hasGreetedGlobally) {
      setHasGreeted(true);
      return;
    }
    
    // Only greet if voice greeting is enabled in settings (default to true if not set)
    const isVoiceGreetingEnabled = preferences.voiceGreetingEnabled !== false;
    
    // Only greet once per session and only if we have a user and greeting is enabled
    if (user && !hasGreeted && !isGreeting && isVoiceGreetingEnabled) {
      // Get the name from the email if available
      const name = user.email?.split('@')[0] || 'there';
      
      // Set both local and global greeting flags
      setIsGreeting(true);
      hasGreetedGlobally = true;
      
      // Add a small delay to ensure the page has loaded
      setTimeout(async () => {
        try {
          console.log('Speaking greeting to:', name);
          console.log('ElevenLabs connected:', isElevenLabsConnected);
          
          // Get greeting options from preferences
          const greetingOptions = {
            greetingType: preferences.voiceGreetingType || 'default',
            customGreeting: preferences.customGreeting,
            presetGreetingId: preferences.selectedPresetGreeting
          };
          
          // Log the greeting options for debugging
          console.log('Using greeting options:', greetingOptions);
          
          await speakGreeting(name, greetingOptions);
          setHasGreeted(true);
        } catch (error) {
          console.error('Error with voice greeting:', error);
          // Reset global flag if there's an error
          hasGreetedGlobally = false;
          // Show a visual greeting as fallback
          toast(`Welcome back, ${name}!`);
        } finally {
          setIsGreeting(false);
        }
      }, 1000);
    }
  }, [user, hasGreeted, isGreeting, preferences, isElevenLabsConnected]);
  
  // Add a function to reset greeting (for testing purposes)
  const resetGreeting = () => {
    hasGreetedGlobally = false;
    setHasGreeted(false);
  };
  
  return { hasGreeted, isGreeting, resetGreeting };
};
