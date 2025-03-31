
import { useState, useCallback, useEffect } from 'react';
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
    isConnected,
    connectIntegration,
    isAuthenticated,
    fetchIntegrations
  } = useIntegrations();

  // Log additional details when integration changes
  useEffect(() => {
    const elevenlabsIntegration = getIntegration('ElevenLabs');
    console.log('ElevenLabs Integration Details:', {
      integration: elevenlabsIntegration,
      isConnected: isConnected('ElevenLabs')
    });
  }, [getIntegration, isConnected]);

  // Get the current ElevenLabs integration configuration
  const elevenlabsIntegration = getIntegration('ElevenLabs');
  
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
      
      // Log connection status before attempting to save
      console.log('Current ElevenLabs Connection Status:', isElevenLabsConnected);
      
      // First connect the integration if not already connected
      if (!isElevenLabsConnected) {
        console.log('Connecting ElevenLabs integration...');
        await connectIntegration('ElevenLabs', {
          ...settings,
          enabled: true
        });
      }
      
      // Then update the settings
      console.log('Updating ElevenLabs settings...');
      const result = await updateIntegrationSettings('ElevenLabs', {
        ...settings,
        enabled: true
      });
      
      // Force refresh integrations to ensure we have the latest data
      await fetchIntegrations();
      
      console.log('ElevenLabs settings saved successfully:', result);
      toast.success('ElevenLabs settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving ElevenLabs settings:', error);
      toast.error('Failed to save ElevenLabs settings: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateIntegrationSettings, connectIntegration, isElevenLabsConnected, fetchIntegrations]);

  const testElevenLabsAPI = useCallback(async (apiKey: string = elevenlabsIntegration?.apiKey) => {
    setIsLoading(true);
    try {
      console.log('Testing ElevenLabs API with key:', apiKey ? `${apiKey.substring(0, 5)}...` : 'none');
      
      // Mock API test for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple validation that the key is present and looks like an API key
      if (!apiKey || apiKey.length < 20) {
        console.log('Invalid ElevenLabs API key');
        return false;
      }
      
      console.log('ElevenLabs API test successful');
      return true;
    } catch (error) {
      console.error('Error testing ElevenLabs API:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [elevenlabsIntegration?.apiKey]);

  return {
    isElevenLabsConnected,
    settings: {
      apiKey: elevenlabsIntegration?.apiKey || '',
      defaultVoiceId: elevenlabsIntegration?.defaultVoiceId || 'EXAVITQu4vr4xnSDxMaL', // Default Sarah voice
      defaultModel: elevenlabsIntegration?.defaultModel || 'eleven_multilingual_v2'
    },
    saveElevenLabsSettings,
    testElevenLabsAPI,
    isLoading,
    isAuthenticated
  };
}
