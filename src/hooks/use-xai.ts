
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
    isAuthenticated,
    fetchIntegrations
  } = useIntegrations();

  // Log additional details when integration changes
  useEffect(() => {
    const xaiIntegration = getIntegration('XAI');
    console.log('X.AI Integration Details:', {
      integration: xaiIntegration,
      isConnected: isConnected('XAI')
    });
  }, [getIntegration, isConnected]);

  // Get the current XAI integration configuration
  const xaiIntegration = getIntegration('XAI');
  
  // Check if XAI is connected
  const isXAIConnected = isConnected('XAI');

  // Improved saveXAISettings to ensure settings are properly saved
  const saveXAISettings = useCallback(async (settings: XAISettings) => {
    setIsLoading(true);
    try {
      console.log('Saving X.AI settings:', {
        apiKey: settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none',
        defaultModel: settings.defaultModel,
        organization: settings.organization
      });
      
      // Log connection status before attempting to save
      console.log('Current X.AI Connection Status:', isXAIConnected);
      
      // First connect the integration if not already connected
      if (!isXAIConnected) {
        console.log('Connecting X.AI integration...');
        await connectIntegration('XAI', {
          ...settings,
          enabled: true
        });
      }
      
      // Then update the settings
      console.log('Updating X.AI settings...');
      const result = await updateIntegrationSettings('XAI', {
        ...settings,
        enabled: true
      });
      
      // Force refresh integrations to ensure we have the latest data
      await fetchIntegrations();
      
      console.log('X.AI settings saved successfully:', result);
      toast.success('X.AI settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving X.AI settings:', error);
      toast.error('Failed to save X.AI settings: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateIntegrationSettings, connectIntegration, isXAIConnected, fetchIntegrations]);

  const testXAIConnection = useCallback(async (apiKey: string = xaiIntegration?.apiKey) => {
    setIsLoading(true);
    try {
      console.log('Testing X.AI API with key:', apiKey ? `${apiKey.substring(0, 5)}...` : 'none');
      const result = await testXAIAPI(apiKey);
      console.log('X.AI API test result:', result);
      return result;
    } catch (error) {
      console.error('Error testing X.AI API:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [xaiIntegration?.apiKey]);

  return {
    isXAIConnected,
    settings: {
      apiKey: xaiIntegration?.apiKey || '',
      defaultModel: xaiIntegration?.defaultModel || 'grok-1',
      organization: xaiIntegration?.organization || ''
    },
    saveXAISettings,
    testXAIConnection,
    isLoading,
    isAuthenticated
  };
}
