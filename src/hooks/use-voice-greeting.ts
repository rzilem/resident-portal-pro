
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
  const { preferences, updatePreference } = useSettings();
  const { isElevenLabsConnected } = useElevenLabs();
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const [greetingLog, setGreetingLog] = useState<string[]>([]);
  
  // Add a log function to track greeting attempts
  const logGreeting = (message: string) => {
    console.log(`[Voice Greeting] ${message}`);
    setGreetingLog(prev => [...prev, message]);
  };
  
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
      
      logGreeting(`Preparing greeting for user: ${name}`);
      logGreeting(`ElevenLabs connected: ${isElevenLabsConnected}`);
      
      // Add a small delay to ensure the page has loaded
      setTimeout(async () => {
        try {
          logGreeting(`Speaking greeting to: ${name}`);
          
          // Get greeting options from preferences
          const greetingOptions = {
            greetingType: preferences.voiceGreetingType || 'default',
            customGreeting: preferences.customGreeting,
            presetGreetingId: preferences.selectedPresetGreeting
          };
          
          logGreeting(`Greeting options: ${JSON.stringify(greetingOptions)}`);
          
          await speakGreeting(name, greetingOptions);
          setHasGreeted(true);
          logGreeting('Greeting completed successfully');
          
          // Save the last greeting time to Supabase
          await updatePreference('lastGreetingTime', new Date().toISOString());
        } catch (error) {
          logGreeting(`Error with voice greeting: ${error instanceof Error ? error.message : String(error)}`);
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
  }, [user, hasGreeted, isGreeting, preferences, isElevenLabsConnected, updatePreference]);
  
  // Add a function to reset greeting (for testing purposes)
  const resetGreeting = async () => {
    logGreeting('Resetting greeting state');
    hasGreetedGlobally = false;
    setHasGreeted(false);
    await updatePreference('lastGreetingTime', null);
  };
  
  // Add a function to update greeting preferences
  const updateGreetingPreferences = async (updates: {
    voiceGreetingEnabled?: boolean;
    voiceGreetingType?: 'default' | 'custom' | 'preset';
    customGreeting?: string;
    selectedPresetGreeting?: string;
  }) => {
    try {
      logGreeting(`Updating greeting preferences: ${JSON.stringify(updates)}`);
      const result = await updatePreference({
        ...updates
      });
      
      logGreeting(`Preferences update result: ${result}`);
      return result;
    } catch (error) {
      logGreeting(`Error updating greeting preferences: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Error updating greeting preferences:', error);
      return false;
    }
  };
  
  // Manual test function for verifying greetings
  const testGreeting = async (name: string = 'Test User') => {
    try {
      logGreeting(`Running test greeting for: ${name}`);
      
      const greetingOptions = {
        greetingType: preferences.voiceGreetingType || 'default',
        customGreeting: preferences.customGreeting,
        presetGreetingId: preferences.selectedPresetGreeting
      };
      
      logGreeting(`Test greeting options: ${JSON.stringify(greetingOptions)}`);
      
      await speakGreeting(name, greetingOptions);
      logGreeting('Test greeting completed successfully');
      return true;
    } catch (error) {
      logGreeting(`Error in test greeting: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Error in test greeting:', error);
      return false;
    }
  };
  
  return { 
    hasGreeted, 
    isGreeting, 
    resetGreeting,
    updateGreetingPreferences,
    testGreeting,
    greetingLog
  };
};
