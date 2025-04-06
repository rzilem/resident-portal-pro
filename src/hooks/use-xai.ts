
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useIntegrations } from './use-integrations';
import { testXAIAPI, generateWithXAI } from '@/utils/xai';
import { supabase } from '@/integrations/supabase/client';

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

  // Force refresh integrations on mount to ensure we have the latest data
  useEffect(() => {
    const loadIntegrations = async () => {
      await fetchIntegrations();
    };
    
    loadIntegrations();
  }, [fetchIntegrations]);

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

  // Add a dedicated method to fetch the latest settings
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching latest X.AI settings...');
      await fetchIntegrations();
      return true;
    } catch (error) {
      console.error('Error fetching X.AI settings:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchIntegrations]);

  // Improved saveXAISettings to ensure settings are properly saved
  const saveXAISettings = useCallback(async (settings: XAISettings) => {
    setIsLoading(true);
    try {
      console.log('Saving X.AI settings:', {
        apiKey: settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none',
        defaultModel: settings.defaultModel,
        organization: settings.organization
      });
      
      // Check if the user is authenticated with Supabase
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast.error('You must be logged in to save API settings');
        return false;
      }
      
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
      if (!apiKey) {
        console.error('No API key provided for X.AI test');
        toast.error('API key is required to test connection');
        return false;
      }
      
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

  const generateContent = useCallback(async (
    prompt: string,
    options = {}
  ) => {
    if (!isXAIConnected || !xaiIntegration?.apiKey) {
      toast.error('X.AI integration is not properly configured');
      return null;
    }

    setIsLoading(true);
    try {
      const result = await generateWithXAI(prompt, xaiIntegration.apiKey, {
        model: xaiIntegration.defaultModel || 'grok-2',
        ...options
      });
      return result;
    } catch (error) {
      console.error('Error generating with X.AI:', error);
      toast.error('Failed to generate content with X.AI');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isXAIConnected, xaiIntegration]);

  return {
    isXAIConnected,
    settings: {
      apiKey: xaiIntegration?.apiKey || '',
      defaultModel: xaiIntegration?.defaultModel || 'grok-2',
      organization: xaiIntegration?.organization || ''
    },
    saveXAISettings,
    testXAIConnection,
    generateContent,
    isLoading,
    isAuthenticated,
    fetchSettings
  };
}
