
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { integrationService } from '@/services/integrationService';

// Types for integration data
interface Integration {
  id: string;
  name: string;
  apiKey?: string;
  defaultModel?: string;
  defaultVoiceId?: string;
  organization?: string;
  endpoint?: string;
  enabled: boolean;
  [key: string]: any;
}

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load integrations on initialization
  useEffect(() => {
    if (!isInitialized) {
      fetchIntegrations();
    }
  }, [isInitialized]);

  const fetchIntegrations = useCallback(async () => {
    console.log('Fetching integrations...');
    setIsLoading(true);
    try {
      // Use entity ID 'current-user' as a placeholder - in a real implementation, 
      // this would be the user ID from authentication
      const entityId = 'current-user';
      const fetchedIntegrations = await integrationService.getIntegrations(entityId);
      
      // Convert to our interface format
      const formattedIntegrations: Integration[] = Object.entries(fetchedIntegrations).map(
        ([id, settings]) => ({
          id,
          name: id,
          ...settings
        })
      );
      
      console.log('Loaded integrations:', formattedIntegrations);
      setIntegrations(formattedIntegrations);
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast.error('Failed to load integrations');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getIntegration = useCallback((id: string): Integration | undefined => {
    const integration = integrations.find(integration => integration.id === id);
    console.log(`Getting integration for ${id}:`, integration);
    return integration;
  }, [integrations]);

  const isConnected = useCallback((id: string): boolean => {
    const integration = getIntegration(id);
    return integration ? integration.enabled : false;
  }, [getIntegration]);

  const connectIntegration = useCallback(async (id: string, settings: any) => {
    setIsLoading(true);
    try {
      console.log(`Connecting integration ${id}...`, settings);
      
      // Use entity ID 'current-user' as a placeholder
      const entityId = 'current-user';
      await integrationService.connectIntegration(entityId, id, settings);
      
      setIntegrations(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, ...settings, enabled: true }
            : item
        )
      );
      
      // If the integration doesn't exist yet, add it
      if (!getIntegration(id)) {
        setIntegrations(prev => [
          ...prev, 
          { id, name: id, ...settings, enabled: true }
        ]);
      }
      
      console.log(`Integration ${id} connected successfully`);
      return true;
    } catch (error) {
      console.error(`Error connecting integration ${id}:`, error);
      toast.error(`Failed to connect ${id}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getIntegration]);

  const disconnectIntegration = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      console.log(`Disconnecting integration ${id}...`);
      
      // Use entity ID 'current-user' as a placeholder
      const entityId = 'current-user';
      await integrationService.disconnectIntegration(entityId, id);
      
      setIntegrations(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, enabled: false }
            : item
        )
      );
      
      console.log(`Integration ${id} disconnected successfully`);
      return true;
    } catch (error) {
      console.error(`Error disconnecting integration ${id}:`, error);
      toast.error(`Failed to disconnect ${id}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateIntegrationSettings = useCallback(async (id: string, settings: any) => {
    setIsLoading(true);
    try {
      console.log(`Updating integration ${id} settings...`, settings);
      
      // Use entity ID 'current-user' as a placeholder
      const entityId = 'current-user';
      await integrationService.updateIntegrationSettings(entityId, id, settings);
      
      setIntegrations(prev => {
        const existing = prev.find(item => item.id === id);
        
        if (existing) {
          // Update existing integration
          return prev.map(item => 
            item.id === id 
              ? { ...item, ...settings }
              : item
          );
        } else {
          // Add new integration if it doesn't exist
          return [...prev, { id, name: id, ...settings }];
        }
      });
      
      console.log(`Integration ${id} settings updated successfully`);
      return true;
    } catch (error) {
      console.error(`Error updating integration ${id} settings:`, error);
      toast.error(`Failed to update ${id} settings`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testWebhook = useCallback(async (webhookUrl: string, payload: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log(`Testing webhook at ${webhookUrl}...`, payload);
      
      const result = await integrationService.testWebhook(webhookUrl, payload);
      
      if (result) {
        toast.success('Webhook test successful');
      } else {
        toast.error('Webhook test failed');
      }
      
      return result;
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast.error('Failed to test webhook connection');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify authentication status
  const checkAuthentication = useCallback(async () => {
    // In a real app, this would check if the user is authenticated
    return isAuthenticated;
  }, [isAuthenticated]);

  return {
    integrations,
    isLoading,
    isAuthenticated,
    fetchIntegrations,
    getIntegration,
    isConnected,
    connectIntegration,
    disconnectIntegration,
    updateIntegrationSettings,
    checkAuthentication,
    setIsAuthenticated,
    testWebhook
  };
}
