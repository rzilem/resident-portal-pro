
import { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/hooks/use-elevenlabs';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export function useElevenLabsDialog(open: boolean, onOpenChange: (open: boolean) => void) {
  const { 
    settings,
    saveElevenLabsSettings,
    testElevenLabsAPI,
    isLoading,
    isAuthenticated
  } = useElevenLabs();
  
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [defaultVoiceId, setDefaultVoiceId] = useState(settings.defaultVoiceId || '');
  const [defaultModel, setDefaultModel] = useState(settings.defaultModel || '');
  const [isTesting, setIsTesting] = useState(false);
  
  // Reset form fields when dialog opens with the current settings
  useEffect(() => {
    if (open) {
      setApiKey(settings.apiKey || '');
      setDefaultVoiceId(settings.defaultVoiceId || '');
      setDefaultModel(settings.defaultModel || '');
    }
  }, [open, settings]);
  
  const handleSave = useCallback(async () => {
    try {
      // Check authentication status first
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        toast.error("You must be logged in to save API settings");
        return false;
      }
      
      console.log("Saving ElevenLabs settings with apiKey:", apiKey ? `${apiKey.substring(0, 5)}...` : 'none');
      
      const success = await saveElevenLabsSettings({
        apiKey,
        defaultVoiceId,
        defaultModel
      });
      
      if (success) {
        toast.success("ElevenLabs settings saved successfully");
        onOpenChange(false);
      } else {
        toast.error("Failed to save ElevenLabs settings");
      }
      
      return success;
    } catch (error) {
      console.error("Error saving ElevenLabs settings:", error);
      toast.error("An error occurred while saving settings");
      return false;
    }
  }, [apiKey, defaultVoiceId, defaultModel, saveElevenLabsSettings, onOpenChange]);
  
  const handleTest = useCallback(async () => {
    setIsTesting(true);
    try {
      const success = await testElevenLabsAPI(apiKey);
      
      if (success) {
        toast.success("ElevenLabs connection test successful");
      } else {
        toast.error("ElevenLabs connection test failed");
      }
      
      return success;
    } catch (error) {
      console.error("Error testing ElevenLabs API:", error);
      toast.error("An error occurred during the connection test");
      return false;
    } finally {
      setIsTesting(false);
    }
  }, [apiKey, testElevenLabsAPI]);
  
  return {
    apiKey,
    defaultVoiceId,
    defaultModel,
    isTesting,
    isLoading,
    isAuthenticated,
    setApiKey,
    setDefaultVoiceId,
    setDefaultModel,
    handleSave,
    handleTest
  };
}
