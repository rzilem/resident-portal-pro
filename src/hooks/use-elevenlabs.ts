
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useIntegrations } from './use-integrations';
import { testElevenLabsAPI, generateSpeech } from '@/utils/elevenlabs';
import { supabase } from '@/lib/supabase';

interface ElevenLabsSettings {
  apiKey: string;
  defaultVoiceId?: string;
  defaultModel?: string;
}

export function useElevenLabs() {
  const [isLoading, setIsLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const { 
    updateIntegrationSettings, 
    getIntegration, 
    isConnected,
    connectIntegration,
    isAuthenticated,
    fetchIntegrations
  } = useIntegrations();

  // Force refresh integrations on mount to ensure we have the latest data
  useEffect(() => {
    const loadIntegrations = async () => {
      await fetchIntegrations();
    };
    
    loadIntegrations();
  }, [fetchIntegrations]);

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

  // Add a dedicated method to fetch the latest settings
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching latest ElevenLabs settings...');
      await fetchIntegrations();
      return true;
    } catch (error) {
      console.error('Error fetching ElevenLabs settings:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchIntegrations]);

  // Generate speech with ElevenLabs API
  const generateAudio = useCallback(async (text: string, options?: { voiceId?: string, model?: string }) => {
    setIsLoading(true);
    try {
      if (!isElevenLabsConnected || !elevenlabsIntegration?.apiKey) {
        toast.error('ElevenLabs integration is not properly configured');
        return null;
      }

      console.log('Generating speech with ElevenLabs:', {
        text,
        voiceId: options?.voiceId || elevenlabsIntegration?.defaultVoiceId,
        model: options?.model || elevenlabsIntegration?.defaultModel
      });
      
      const blob = await generateSpeech(
        text, 
        elevenlabsIntegration.apiKey, 
        {
          voiceId: options?.voiceId || elevenlabsIntegration?.defaultVoiceId,
          model: options?.model || elevenlabsIntegration?.defaultModel
        }
      );
      
      setAudioBlob(blob);
      return blob;
    } catch (error) {
      console.error('Error generating speech with ElevenLabs:', error);
      toast.error('Failed to generate speech with ElevenLabs');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isElevenLabsConnected, elevenlabsIntegration]);

  // Improved saveElevenLabsSettings to ensure settings are properly saved
  const saveElevenLabsSettings = useCallback(async (settings: ElevenLabsSettings) => {
    setIsLoading(true);
    try {
      console.log('Saving ElevenLabs settings:', {
        apiKey: settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none',
        defaultVoiceId: settings.defaultVoiceId,
        defaultModel: settings.defaultModel
      });
      
      // Check if the user is authenticated with Supabase
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast.error('You must be logged in to save API settings');
        return false;
      }
      
      // Log connection status before attempting to save
      console.log('Current ElevenLabs Connection Status:', isElevenLabsConnected);
      
      // First connect the integration if not already connected
      if (!isElevenLabsConnected) {
        console.log('Connecting ElevenLabs integration...');
        await connectIntegration('ElevenLabs', {
          ...settings,
          enabled: true
        });
      } else {
        // If already connected, update the settings directly
        console.log('Updating existing ElevenLabs settings...');
      }
      
      // Then update the settings
      console.log('Updating ElevenLabs settings with API key:', settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none');
      const result = await updateIntegrationSettings('ElevenLabs', {
        ...settings,
        enabled: true
      });
      
      // Force refresh integrations to ensure we have the latest data
      await fetchIntegrations();
      
      console.log('ElevenLabs settings saved successfully:', result);
      return true;
    } catch (error) {
      console.error('Error saving ElevenLabs settings:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateIntegrationSettings, connectIntegration, isElevenLabsConnected, fetchIntegrations]);

  // Use the real API test function
  const testElevenLabsAPICall = useCallback(async (apiKey: string = elevenlabsIntegration?.apiKey) => {
    setIsLoading(true);
    try {
      console.log('Testing ElevenLabs API with key:', apiKey ? `${apiKey.substring(0, 5)}...` : 'none');
      
      const result = await testElevenLabsAPI(apiKey);
      
      console.log('ElevenLabs API test result:', result);
      return result;
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
    testElevenLabsAPI: testElevenLabsAPICall,
    generateAudio,
    audioBlob,
    isLoading,
    isAuthenticated,
    fetchSettings
  };
}
