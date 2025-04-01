
import { useState, useEffect } from 'react';
import { useXAI } from '@/hooks/use-xai';
import { toast } from 'sonner';

export function useXAIDialog(open: boolean, onOpenChange: (open: boolean) => void) {
  const { settings, saveXAISettings, testXAIConnection, isLoading, isAuthenticated } = useXAI();
  
  // Form state
  const [apiKey, setApiKey] = useState('');
  const [defaultModel, setDefaultModel] = useState('grok-1');
  const [organization, setOrganization] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // Update local state when dialog opens or settings change
  useEffect(() => {
    if (open) {
      console.log('XAI Dialog opened, initializing with settings:', {
        apiKey: settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none',
        defaultModel: settings.defaultModel || 'grok-1',
        organization: settings.organization
      });
      setApiKey(settings.apiKey || '');
      setDefaultModel(settings.defaultModel || 'grok-1');
      setOrganization(settings.organization || '');
    }
  }, [open, settings]);

  // Debug state changes
  useEffect(() => {
    console.log('X.AI Dialog State:', {
      openStatus: open,
      currentSettings: settings,
      localApiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'none',
      localDefaultModel: defaultModel,
      localOrganization: organization
    });
  }, [open, settings, apiKey, defaultModel, organization]);

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
    
    const success = await saveXAISettings({
      apiKey,
      defaultModel,
      organization
    });
    
    if (success) {
      toast.success('X.AI settings saved successfully');
      onOpenChange(false);
    } else {
      toast.error('Failed to save X.AI settings');
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast.error('API key is required');
      return;
    }
    
    setIsTesting(true);
    try {
      console.log('Testing X.AI API...');
      const success = await testXAIConnection(apiKey);
      
      if (success) {
        toast.success('X.AI API connection test successful');
      } else {
        toast.error('X.AI API connection test failed');
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
    setApiKey,
    setDefaultModel,
    setOrganization,
    handleSave,
    handleTest
  };
}
