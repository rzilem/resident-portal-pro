
import { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/hooks/use-elevenlabs';
import { toast } from 'sonner';

export function useElevenLabsDialog(open: boolean, onOpenChange: (open: boolean) => void) {
  const { 
    settings,
    saveElevenLabsSettings,
    testElevenLabsAPI,
    isLoading,
    isAuthenticated
  } = useElevenLabs();
  
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [defaultVoiceId, setDefaultVoiceId] = useState(settings.defaultVoiceId);
  const [defaultModel, setDefaultModel] = useState(settings.defaultModel);
  const [isTesting, setIsTesting] = useState(false);
  const [testLog, setTestLog] = useState<string[]>([]);
  
  // Reset form fields when dialog opens with the current settings
  useEffect(() => {
    if (open) {
      setApiKey(settings.apiKey);
      setDefaultVoiceId(settings.defaultVoiceId);
      setDefaultModel(settings.defaultModel);
      setTestLog([]);
    }
  }, [open, settings]);
  
  const handleSave = useCallback(async () => {
    try {
      setTestLog(prev => [...prev, `Attempting to save ElevenLabs settings...`]);
      
      // Check if no API key is provided
      if (!apiKey.trim()) {
        toast.error("API key is required");
        setTestLog(prev => [...prev, `Error: API key is required`]);
        return;
      }
      
      setTestLog(prev => [...prev, `Saving with key ${apiKey.substring(0, 4)}... and voice ${defaultVoiceId}`]);
      
      const success = await saveElevenLabsSettings({
        apiKey,
        defaultVoiceId,
        defaultModel
      });
      
      if (success) {
        setTestLog(prev => [...prev, `Settings saved successfully`]);
        toast.success("ElevenLabs settings saved successfully");
        onOpenChange(false);
      } else {
        setTestLog(prev => [...prev, `Failed to save settings`]);
        toast.error("Failed to save ElevenLabs settings");
      }
    } catch (error) {
      console.error("Error saving ElevenLabs settings:", error);
      setTestLog(prev => [...prev, `Error: ${error instanceof Error ? error.message : String(error)}`]);
      toast.error("An error occurred while saving settings");
    }
  }, [apiKey, defaultVoiceId, defaultModel, saveElevenLabsSettings, onOpenChange]);
  
  const handleTest = useCallback(async () => {
    setIsTesting(true);
    setTestLog(prev => [...prev, `Testing ElevenLabs API connection...`]);
    
    try {
      // Validate API key first
      if (!apiKey.trim()) {
        setTestLog(prev => [...prev, `Error: API key is required for testing`]);
        toast.error("API key is required for testing");
        setIsTesting(false);
        return;
      }
      
      setTestLog(prev => [...prev, `Making test request with key ${apiKey.substring(0, 4)}...`]);
      
      const success = await testElevenLabsAPI(apiKey);
      
      if (success) {
        setTestLog(prev => [...prev, `Connection test successful`]);
        toast.success("ElevenLabs connection test successful");
      } else {
        setTestLog(prev => [...prev, `Connection test failed`]);
        toast.error("ElevenLabs connection test failed");
      }
    } catch (error) {
      console.error("Error testing ElevenLabs API:", error);
      setTestLog(prev => [...prev, `Error: ${error instanceof Error ? error.message : String(error)}`]);
      toast.error("An error occurred during the connection test");
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
    testLog,
    setApiKey,
    setDefaultVoiceId,
    setDefaultModel,
    handleSave,
    handleTest
  };
}
