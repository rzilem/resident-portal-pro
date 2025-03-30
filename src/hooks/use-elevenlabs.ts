
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useIntegrations } from './use-integrations';
import { testElevenLabsAPI as testElevenLabsAPIUtil } from '@/utils/elevenlabs';

interface ElevenLabsSettings {
  apiKey: string;
  defaultVoiceId?: string;
  defaultModel?: string;
}

export function useElevenLabs() {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    updateIntegrationSettings, 
    getIntegration, 
    isConnected,
    connectIntegration 
  } = useIntegrations();

  const elevenLabsIntegration = getIntegration('ElevenLabs');
  
  const isElevenLabsConnected = isConnected('ElevenLabs');

  const saveElevenLabsSettings = useCallback(async (settings: ElevenLabsSettings) => {
    setIsLoading(true);
    try {
      console.log('Saving ElevenLabs settings:', settings);
      
      // First ensure we're connected if not already connected
      if (!isElevenLabsConnected) {
        await connectIntegration('ElevenLabs', {
          ...settings,
          enabled: true
        });
      }
      
      // Then update the settings
      const result = await updateIntegrationSettings('ElevenLabs', {
        ...settings,
        enabled: true
      });
      
      console.log('ElevenLabs settings saved:', result);
      toast.success('ElevenLabs settings saved permanently');
      return true;
    } catch (error) {
      console.error('Error saving ElevenLabs settings:', error);
      toast.error('Failed to save ElevenLabs settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateIntegrationSettings, connectIntegration, isElevenLabsConnected]);

  const testElevenLabsAPI = useCallback(async (apiKey: string = elevenLabsIntegration?.apiKey) => {
    setIsLoading(true);
    try {
      const result = await testElevenLabsAPIUtil(apiKey);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [elevenLabsIntegration?.apiKey]);

  // Get settings or default values
  const getSettings = useCallback(() => {
    return {
      apiKey: elevenLabsIntegration?.apiKey || '',
      defaultVoiceId: elevenLabsIntegration?.defaultVoiceId || 'EXAVITQu4vr4xnSDxMaL', // Sarah by default
      defaultModel: elevenLabsIntegration?.defaultModel || 'eleven_turbo_v2' // Default to faster model
    };
  }, [elevenLabsIntegration]);

  return {
    isElevenLabsConnected,
    settings: getSettings(),
    saveElevenLabsSettings,
    testElevenLabsAPI,
    isLoading
  };
}
