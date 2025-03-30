import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { speakGreeting } from '@/utils/greetings';
import { toast } from 'sonner';
import { useSettings } from '@/hooks/use-settings';

export const useVoiceGreeting = () => {
  const { user, profile } = useAuth();
  const { preferences } = useSettings();
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);

  useEffect(() => {
    // Only greet if voice greeting is enabled in settings (default to true if not set)
    const isVoiceGreetingEnabled = preferences.voiceGreetingEnabled !== false;

    // Only proceed if we haven’t greeted yet, aren’t currently greeting, and have a user
    if (!hasGreeted && !isGreeting && user && isVoiceGreetingEnabled) {
      // Get the name from the profile if available, otherwise use email
      const name = profile?.first_name || user.email?.split('@')[0] || 'there';

      // Set greeting status
      setIsGreeting(true);

      // Add a small delay to ensure the page has loaded
      const timeoutId = setTimeout(async () => {
        try {
          console.log('Playing voice greeting for:', name); // Debugging log
          await speakGreeting(name);
          setHasGreeted(true);
        } catch (error) {
          console.error('Error with voice greeting:', error);
          toast(`Welcome back, ${name}!`);
        } finally {
          setIsGreeting(false);
        }
      }, 1000);

      // Cleanup function to prevent race conditions or double execution
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [user, profile, preferences.voiceGreetingEnabled]); // Simplified dependency array

  return { hasGreeted, isGreeting };
};
