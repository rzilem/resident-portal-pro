
import { useState, useEffect, useCallback } from 'react';
import { useXAI } from '@/hooks/use-xai';
import { toast } from 'sonner';

export function useXAIDialog(open: boolean, onOpenChange: (open: boolean) => void) {
  const { 
    settings,
    saveXAISettings,
    testXAIConnection,
    isLoading,
    isAuthenticated
  } = useXAI();
  
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [defaultModel, setDefaultModel] = useState(settings.defaultModel);
  const [organization, setOrganization] = useState(settings.organization);
  const [isTesting, setIsTesting] = useState(false);
  
  // Reset form fields when dialog opens with the current settings
  useEffect(() => {
    if (open) {
      setApiKey(settings.apiKey);
      setDefaultModel(settings.defaultModel);
      setOrganization(settings.organization);
    }
  }, [open, settings]);
  
  const handleSave = useCallback(async () => {
    try {
      const success = await saveXAISettings({
        apiKey,
        defaultModel,
        organization
      });
      
      if (success) {
        toast.success("X.AI settings saved successfully");
        onOpenChange(false);
      } else {
        toast.error("Failed to save X.AI settings");
      }
    } catch (error) {
      console.error("Error saving X.AI settings:", error);
      toast.error("An error occurred while saving settings");
    }
  }, [apiKey, defaultModel, organization, saveXAISettings, onOpenChange]);
  
  const handleTest = useCallback(async () => {
    setIsTesting(true);
    try {
      const success = await testXAIConnection(apiKey);
      
      if (success) {
        toast.success("X.AI connection test successful");
      } else {
        toast.error("X.AI connection test failed");
      }
    } catch (error) {
      console.error("Error testing X.AI API:", error);
      toast.error("An error occurred during the connection test");
    } finally {
      setIsTesting(false);
    }
  }, [apiKey, testXAIConnection]);
  
  return {
    apiKey,
    defaultModel,
    organization,
    isTesting,
    isLoading,
    setApiKey,
    setDefaultModel,
    setOrganization,
    handleSave,
    handleTest
  };
}
