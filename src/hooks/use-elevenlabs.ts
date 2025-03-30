
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useIntegrations } from './use-integrations';

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
    isConnected 
  } = useIntegrations();

  const elevenLabsIntegration = getIntegration('ElevenLabs');
  
  const isElevenLabsConnected = isConnected('ElevenLabs');

  const saveElevenLabsSettings = useCallback(async (settings: ElevenLabsSettings) => {
    setIsLoading(true);
    try {
      console.log('Saving ElevenLabs settings:', settings);
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
  }, [updateIntegrationSettings]);

  const testElevenLabsAPI = useCallback(async (apiKey: string = elevenLabsIntegration?.apiKey) => {
    if (!apiKey) {
      toast.error('No API key provided');
      return false;
    }

    setIsLoading(true);
    try {
      // Test the ElevenLabs API by fetching voices
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json();
      if (data?.voices?.length > 0) {
        toast.success('ElevenLabs API connection successful');
        return true;
      } else {
        toast.error('Unexpected response from ElevenLabs API');
        return false;
      }
    } catch (error) {
      console.error('Error testing ElevenLabs API:', error);
      toast.error('Failed to connect to ElevenLabs API');
      return false;
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
