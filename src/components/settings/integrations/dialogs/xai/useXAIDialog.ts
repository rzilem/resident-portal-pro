
import { useState, useEffect, useCallback } from 'react';
import { useXAI } from '@/hooks/use-xai';
import { toast } from 'sonner';

export function useXAIDialog(open: boolean, onOpenChange: (open: boolean) => void) {
  const { settings, saveXAISettings, testXAIConnection, isLoading, isAuthenticated } = useXAI();
  
  // Form state with debug logging
  const [apiKey, setApiKey] = useState('');
  const [defaultModel, setDefaultModel] = useState('grok-2');
  const [organization, setOrganization] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // Safe setter functions that include logging
  const handleSetApiKey = useCallback((value: string) => {
    console.log('Setting API key to:', value ? `${value.substring(0, 3)}...` : 'empty');
    setApiKey(value);
  }, []);

  const handleSetDefaultModel = useCallback((value: string) => {
    console.log('Setting default model to:', value);
    setDefaultModel(value);
  }, []);

  const handleSetOrganization = useCallback((value: string) => {
    console.log('Setting organization to:', value);
    setOrganization(value);
  }, []);

  // Update local state when dialog opens or settings change
  useEffect(() => {
    if (open) {
      console.log('XAI Dialog opened, initializing with settings:', {
        apiKey: settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none',
        defaultModel: settings.defaultModel || 'grok-2',
        organization: settings.organization
      });
      
      handleSetApiKey(settings.apiKey || '');
      handleSetDefaultModel(settings.defaultModel || 'grok-2');
      handleSetOrganization(settings.organization || '');
    }
  }, [open, settings, handleSetApiKey, handleSetDefaultModel, handleSetOrganization]);

  // Debug state changes
  useEffect(() => {
    console.log('X.AI Dialog State:', {
      openStatus: open,
      localApiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'none',
      localDefaultModel: defaultModel,
      localOrganization: organization
    });
  }, [open, apiKey, defaultModel, organization]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('API key is required');
      return;
    }
    
    console.log('Attempting to save X.AI settings:', {
      apiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'empty',
      defaultModel,
      organization
    });
    
    try {
      const success = await saveXAISettings({
        apiKey: apiKey.trim(),
        defaultModel,
        organization: organization.trim()
      });
      
      if (success) {
        toast.success('X.AI settings saved successfully');
        onOpenChange(false);
      } else {
        toast.error('Failed to save X.AI settings');
      }
    } catch (error) {
      console.error('Error saving X.AI settings:', error);
      toast.error('An error occurred while saving settings');
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast.error('API key is required');
      return;
    }
    
    setIsTesting(true);
    try {
      console.log('Testing X.AI API with key:', apiKey ? `${apiKey.substring(0, 5)}...` : 'none');
      const success = await testXAIConnection(apiKey.trim());
      
      if (success) {
        toast.success('X.AI API connection test successful');
      } else {
        toast.error('X.AI API connection test failed. Check your API key.');
      }
    } catch (error) {
      console.error('Error during X.AI API test:', error);
      toast.error('X.AI API test encountered an error');
    } finally {
      setIsTesting(false);
    }
  };

  return {
    apiKey,
    defaultModel,
    organization,
    isTesting,
    isLoading,
    isAuthenticated,
    setApiKey: handleSetApiKey,
    setDefaultModel: handleSetDefaultModel,
    setOrganization: handleSetOrganization,
    handleSave,
    handleTest
  };
}
