
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { speakGreeting } from '@/utils/greetings';
import { toast } from 'sonner';
import { useSettings } from '@/hooks/use-settings';
import { debugLog } from '@/utils/debug';

// Unique storage key to prevent duplicated greetings
const GREETING_SESSION_KEY = 'voice-greeting-session-played';

export const useVoiceGreeting = () => {
  const { user, profile } = useAuth();
  const { preferences } = useSettings();
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  
  useEffect(() => {
    const greetUser = async () => {
      // Only greet if voice greeting is enabled in settings (default to true if not set)
      const isVoiceGreetingEnabled = preferences.voiceGreetingEnabled !== false;
      
      // Check if we've already greeted in this session
      const hasGreetedThisSession = sessionStorage.getItem(GREETING_SESSION_KEY) === 'true';
      
      // Debug information to track greeting state
      debugLog('Greeting state:', {
        hasUser: !!user,
        hasGreeted,
        isGreeting,
        isEnabled: isVoiceGreetingEnabled,
        hasGreetedThisSession
      });
      
      // Only greet once per session and only if we have a user and greeting is enabled
      if (user && !hasGreeted && !isGreeting && isVoiceGreetingEnabled && !hasGreetedThisSession) {
        try {
          // Get the name from the profile if available, otherwise use email
          const name = profile?.first_name || user.email?.split('@')[0] || 'there';
          
          // Set greeting status first to prevent multiple attempts
          setIsGreeting(true);
          
          // Mark that we've greeted this session BEFORE we attempt to speak
          // This ensures we don't try again if speech fails
          sessionStorage.setItem(GREETING_SESSION_KEY, 'true');
          debugLog('Starting voice greeting for:', name);
          
          // Add a small delay to ensure the page has loaded
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Attempt to speak greeting
          await speakGreeting(name);
          setHasGreeted(true);
        } catch (error) {
          debugLog('Error with voice greeting:', error);
          // Show a visual greeting as fallback
          const name = profile?.first_name || user.email?.split('@')[0] || 'there';
          toast(`Welcome back, ${name}!`);
        } finally {
          setIsGreeting(false);
        }
      }
    };
    
    // Call the greeting function
    greetUser();
    
  }, [user, profile, hasGreeted, isGreeting, preferences.voiceGreetingEnabled]);
  
  return { hasGreeted, isGreeting };
};
