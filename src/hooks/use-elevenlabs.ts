import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useIntegrations } from './use-integrations';
import { testElevenLabsAPI, generateSpeech } from '@/utils/elevenlabs';
import { supabase } from '@/lib/supabase';
import { API_KEYS } from '@/config/api-keys';

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
    fetchIntegrations,
    checkAuthentication
  } = useIntegrations();

  useEffect(() => {
    const loadIntegrations = async () => {
      await checkAuthentication();
      await fetchIntegrations();
    };
    
    loadIntegrations();
  }, [fetchIntegrations, checkAuthentication]);

  useEffect(() => {
    const elevenlabsIntegration = getIntegration('ElevenLabs');
    console.log('ElevenLabs Integration Details:', {
      integration: elevenlabsIntegration,
      isConnected: isConnected('ElevenLabs'),
      apiKey: elevenlabsIntegration?.apiKey ? `${elevenlabsIntegration.apiKey.substring(0, 5)}...` : 'none',
      isAuthenticated
    });
  }, [getIntegration, isConnected, isAuthenticated]);

  const elevenlabsIntegration = getIntegration('ElevenLabs');
  
  const isElevenLabsConnected = isConnected('ElevenLabs') || !!API_KEYS.ELEVEN_LABS;

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching latest ElevenLabs settings...');
      await checkAuthentication();
      await fetchIntegrations();
      return true;
    } catch (error) {
      console.error('Error fetching ElevenLabs settings:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchIntegrations, checkAuthentication]);

  const generateAudio = useCallback(async (text: string, options?: { voiceId?: string, model?: string }) => {
    setIsLoading(true);
    try {
      const apiKey = elevenlabsIntegration?.apiKey || API_KEYS.ELEVEN_LABS;
      
      if (!apiKey) {
        toast.error('ElevenLabs integration is not properly configured');
        return null;
      }

      console.log('Generating speech with ElevenLabs:', {
        text,
        voiceId: options?.voiceId || elevenlabsIntegration?.defaultVoiceId,
        model: options?.model || elevenlabsIntegration?.defaultModel,
        usingHardcodedKey: !elevenlabsIntegration?.apiKey
      });
      
      const blob = await generateSpeech(
        text, 
        apiKey, 
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
  }, [elevenlabsIntegration]);

  const saveElevenLabsSettings = useCallback(async (settings: ElevenLabsSettings) => {
    setIsLoading(true);
    try {
      console.log('Saving ElevenLabs settings:', {
        apiKey: settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none',
        defaultVoiceId: settings.defaultVoiceId,
        defaultModel: settings.defaultModel
      });
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast.error('You must be logged in to save API settings');
        return false;
      }
      
      console.log('Current ElevenLabs Connection Status:', isElevenLabsConnected);
      
      let result;
      
      if (!isElevenLabsConnected) {
        console.log('Connecting ElevenLabs integration...');
        result = await connectIntegration('ElevenLabs', {
          ...settings,
          enabled: true
        });
        
        if (!result) {
          console.error('Failed to connect ElevenLabs integration');
          return false;
        }
      } else {
        console.log('Updating existing ElevenLabs settings...');
        result = await updateIntegrationSettings('ElevenLabs', {
          ...settings,
          enabled: true
        });
        
        if (!result) {
          console.error('Failed to update ElevenLabs settings');
          return false;
        }
      }
      
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
    isElevenLabsConnected: isElevenLabsConnected || !!API_KEYS.ELEVEN_LABS,
    settings: {
      apiKey: elevenlabsIntegration?.apiKey || API_KEYS.ELEVEN_LABS || '',
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
