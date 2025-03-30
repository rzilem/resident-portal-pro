
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { speakGreeting } from '@/utils/greetings';

export const useVoiceGreeting = () => {
  const { user, profile } = useAuth();
  const [hasGreeted, setHasGreeted] = useState(false);
  
  useEffect(() => {
    // Only greet once per session and only if we have a user
    if (user && !hasGreeted) {
      // Get the name from the profile if available, otherwise use email
      const name = profile?.first_name || user.email?.split('@')[0] || 'there';
      
      // Add a small delay to ensure the page has loaded
      setTimeout(() => {
        speakGreeting(name);
        setHasGreeted(true);
      }, 1000);
    }
  }, [user, profile, hasGreeted]);
  
  return { hasGreeted };
};
