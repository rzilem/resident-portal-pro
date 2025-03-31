
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
    connectIntegration,
    isAuthenticated,
    fetchIntegrations
  } = useIntegrations();

  // Get the current ElevenLabs integration configuration
  const elevenLabsIntegration = getIntegration('ElevenLabs');
  
  // Check if ElevenLabs is connected
  const isElevenLabsConnected = isConnected('ElevenLabs');

  // Improved saveElevenLabsSettings to ensure settings are properly saved
  const saveElevenLabsSettings = useCallback(async (settings: ElevenLabsSettings) => {
    setIsLoading(true);
    try {
      console.log('Saving ElevenLabs settings:', {
        apiKey: settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none',
        defaultVoiceId: settings.defaultVoiceId,
        defaultModel: settings.defaultModel
      });
      
      // First ensure we're connected if not already connected
      if (!isElevenLabsConnected) {
        console.log('Connecting ElevenLabs integration...');
        await connectIntegration('ElevenLabs', {
          ...settings,
          enabled: true
        });
      } else {
        console.log('ElevenLabs already connected, updating settings...');
      }
      
      // Then update the settings
      console.log('Updating ElevenLabs settings...');
      const result = await updateIntegrationSettings('ElevenLabs', {
        ...settings,
        enabled: true
      });
      
      // Refresh integrations to ensure we have the latest data
      await fetchIntegrations();
      
      console.log('ElevenLabs settings saved successfully:', result);
      return true;
    } catch (error) {
      console.error('Error saving ElevenLabs settings:', error);
      toast.error('Failed to save ElevenLabs settings: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateIntegrationSettings, connectIntegration, isElevenLabsConnected, fetchIntegrations]);

  const testElevenLabsAPI = useCallback(async (apiKey: string = elevenLabsIntegration?.apiKey) => {
    setIsLoading(true);
    try {
      console.log('Testing ElevenLabs API with key:', apiKey ? `${apiKey.substring(0, 5)}...` : 'none');
      const result = await testElevenLabsAPIUtil(apiKey);
      console.log('ElevenLabs API test result:', result);
      return result;
    } catch (error) {
      console.error('Error testing ElevenLabs API:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [elevenLabsIntegration?.apiKey]);

  // Get settings or default values
  const getSettings = useCallback(() => {
    if (elevenLabsIntegration) {
      console.log('Retrieved ElevenLabs settings:', {
        apiKey: elevenLabsIntegration.apiKey ? `${elevenLabsIntegration.apiKey.substring(0, 5)}...` : 'none',
        defaultVoiceId: elevenLabsIntegration.defaultVoiceId,
        defaultModel: elevenLabsIntegration.defaultModel
      });
    } else {
      console.log('No ElevenLabs integration found, using defaults');
    }
    
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
    isLoading,
    isAuthenticated
  };
}
