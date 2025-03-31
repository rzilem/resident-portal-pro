
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useIntegrations } from './use-integrations';
import { testXAIAPI } from '@/utils/xai';

interface XAISettings {
  apiKey: string;
  defaultModel?: string;
  organization?: string;
}

export function useXAI() {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    updateIntegrationSettings, 
    getIntegration, 
    isConnected,
    connectIntegration,
    isAuthenticated
  } = useIntegrations();

  const xaiIntegration = getIntegration('XAI');
  
  const isXAIConnected = isConnected('XAI');

  const saveXAISettings = useCallback(async (settings: XAISettings) => {
    setIsLoading(true);
    try {
      console.log('Saving X.AI settings:', settings);
      
      // First ensure we're connected if not already connected
      if (!isXAIConnected) {
        await connectIntegration('XAI', {
          ...settings,
          enabled: true
        });
      }
      
      // Then update the settings
      const result = await updateIntegrationSettings('XAI', {
        ...settings,
        enabled: true
      });
      
      console.log('X.AI settings saved:', result);
      toast.success('X.AI settings saved permanently');
      return true;
    } catch (error) {
      console.error('Error saving X.AI settings:', error);
      toast.error('Failed to save X.AI settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateIntegrationSettings, connectIntegration, isXAIConnected]);

  const testXAIConnection = useCallback(async (apiKey: string = xaiIntegration?.apiKey) => {
    setIsLoading(true);
    try {
      const result = await testXAIAPI(apiKey);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [xaiIntegration?.apiKey]);

  // Get settings or default values
  const getSettings = useCallback(() => {
    return {
      apiKey: xaiIntegration?.apiKey || '',
      defaultModel: xaiIntegration?.defaultModel || 'grok-1',
      organization: xaiIntegration?.organization || ''
    };
  }, [xaiIntegration]);

  return {
    isXAIConnected,
    settings: getSettings(),
    saveXAISettings,
    testXAIConnection,
    isLoading,
    isAuthenticated
  };
}
