
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useIntegrations } from './use-integrations';
import { VOICE_OPTIONS } from '@/utils/elevenlabs';

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
      await updateIntegrationSettings('ElevenLabs', {
        ...settings,
        enabled: true
      });
      toast.success('ElevenLabs settings saved successfully');
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
      defaultVoiceId: elevenLabsIntegration?.defaultVoiceId || VOICE_OPTIONS.ARIA, // Changed to Aria
      defaultModel: elevenLabsIntegration?.defaultModel || 'eleven_turbo_v2' 
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
