
import { useState, useEffect } from 'react';
import { useElevenLabs } from '@/hooks/use-elevenlabs';
import { toast } from 'sonner';

export function useElevenLabsDialog(open: boolean, onOpenChange: (open: boolean) => void) {
  const { settings, saveElevenLabsSettings, testElevenLabsAPI, isLoading, isAuthenticated } = useElevenLabs();
  
  // Form state
  const [apiKey, setApiKey] = useState('');
  const [defaultVoiceId, setDefaultVoiceId] = useState('');
  const [defaultModel, setDefaultModel] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // Update local state when dialog opens or settings change
  useEffect(() => {
    if (open) {
      console.log('Dialog opened, initializing with settings:', {
        apiKey: settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none',
        defaultVoiceId: settings.defaultVoiceId,
        defaultModel: settings.defaultModel
      });
      setApiKey(settings.apiKey);
      setDefaultVoiceId(settings.defaultVoiceId);
      setDefaultModel(settings.defaultModel);
    }
  }, [open, settings]);

  // Debug state changes
  useEffect(() => {
    console.log('ElevenLabs Dialog State:', {
      openStatus: open,
      currentSettings: settings,
      localApiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'none',
      localDefaultVoiceId: defaultVoiceId,
      localDefaultModel: defaultModel
    });
  }, [open, settings, apiKey, defaultVoiceId, defaultModel]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('API key is required');
      return;
    }
    
    console.log('Attempting to save ElevenLabs settings:', {
      apiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'empty',
      defaultVoiceId,
      defaultModel
    });
    
    const success = await saveElevenLabsSettings({
      apiKey,
      defaultVoiceId,
      defaultModel
    });
    
    if (success) {
      toast.success('ElevenLabs settings saved successfully');
      onOpenChange(false);
    } else {
      toast.error('Failed to save ElevenLabs settings');
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast.error('API key is required');
      return;
    }
    
    setIsTesting(true);
    try {
      console.log('Testing ElevenLabs API...');
      const success = await testElevenLabsAPI(apiKey);
      
      if (success) {
        toast.success('ElevenLabs API connection test successful');
      } else {
        toast.error('ElevenLabs API connection test failed');
      }
    } catch (error) {
      console.error('Error during ElevenLabs API test:', error);
      toast.error('ElevenLabs API test encountered an error');
    } finally {
      setIsTesting(false);
    }
  };

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
