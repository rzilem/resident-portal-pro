
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { speakGreeting } from '@/utils/greetings';
import { toast } from 'sonner';
import { useSettings } from '@/hooks/use-settings';

export const useVoiceGreeting = () => {
  const { user, profile } = useAuth();
  const { preferences } = useSettings();
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const greetingSessionKey = 'voice-greeting-played';
  
  useEffect(() => {
    // Only greet if voice greeting is enabled in settings (default to true if not set)
    const isVoiceGreetingEnabled = preferences.voiceGreetingEnabled !== false;
    
    // Check if we've already greeted in this session
    const hasGreetedThisSession = sessionStorage.getItem(greetingSessionKey) === 'true';
    
    // Only greet once per session and only if we have a user and greeting is enabled
    if (user && !hasGreeted && !isGreeting && isVoiceGreetingEnabled && !hasGreetedThisSession) {
      // Get the name from the profile if available, otherwise use email
      const name = profile?.first_name || user.email?.split('@')[0] || 'there';
      
      // Set greeting status
      setIsGreeting(true);
      
      // Add a small delay to ensure the page has loaded
      setTimeout(async () => {
        try {
          await speakGreeting(name);
          setHasGreeted(true);
          // Mark that we've greeted this session
          sessionStorage.setItem(greetingSessionKey, 'true');
        } catch (error) {
          console.error('Error with voice greeting:', error);
          // Show a visual greeting as fallback
          toast(`Welcome back, ${name}!`);
        } finally {
          setIsGreeting(false);
        }
      }, 1000);
    }
  }, [user, profile, hasGreeted, isGreeting, preferences.voiceGreetingEnabled]);
  
  return { hasGreeted, isGreeting };
};
