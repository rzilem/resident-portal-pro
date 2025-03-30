
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { speakGreeting } from '@/utils/greetings';
import { toast } from 'sonner';

export const useVoiceGreeting = () => {
  const { user, profile } = useAuth();
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  
  useEffect(() => {
    // Only greet once per session and only if we have a user
    if (user && !hasGreeted && !isGreeting) {
      // Get the name from the profile if available, otherwise use email
      const name = profile?.first_name || user.email?.split('@')[0] || 'there';
      
      // Set greeting status
      setIsGreeting(true);
      
      // Add a small delay to ensure the page has loaded
      setTimeout(async () => {
        try {
          await speakGreeting(name);
          setHasGreeted(true);
        } catch (error) {
          console.error('Error with voice greeting:', error);
          // Show a visual greeting as fallback
          toast(`Welcome back, ${name}!`);
        } finally {
          setIsGreeting(false);
        }
      }, 1000);
    }
  }, [user, profile, hasGreeted, isGreeting]);
  
  return { hasGreeted, isGreeting };
};
