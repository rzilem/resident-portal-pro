import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { integrationService } from '@/services/integrationService';

interface IntegrationSettings {
  enabled: boolean;
  apiKey?: string;
  webhookUrl?: string;
  connectedAccount?: string;
  lastSync?: string;
  config?: Record<string, any>;
  [key: string]: any; // Allow any additional fields for integration-specific configurations
}

export function useIntegrations(entityId: string = 'current-user') {
  const [integrations, setIntegrations] = useState<Record<string, IntegrationSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all integrations
  const fetchIntegrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = integrationService.getIntegrations(entityId);
      setIntegrations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch integrations'));
      toast.error('Failed to load integrations');
    } finally {
      setIsLoading(false);
    }
  }, [entityId]);

  // Connect an integration
  const connectIntegration = useCallback(async (
    integrationId: string, 
    settings: IntegrationSettings
  ) => {
    try {
      const updatedIntegration = integrationService.connectIntegration(entityId, integrationId, settings);
      setIntegrations(prev => ({
        ...prev,
        [integrationId]: updatedIntegration
      }));
      toast.success(`${integrationId} connected successfully`);
      return updatedIntegration;
    } catch (err) {
      toast.error(`Failed to connect ${integrationId}`);
      throw err;
    }
  }, [entityId]);

  // Disconnect an integration
  const disconnectIntegration = useCallback(async (integrationId: string) => {
    try {
      const success = integrationService.disconnectIntegration(entityId, integrationId);
      if (success) {
        setIntegrations(prev => ({
          ...prev,
          [integrationId]: {
            ...prev[integrationId],
            enabled: false
          }
        }));
        toast.success(`${integrationId} disconnected successfully`);
      }
      return success;
    } catch (err) {
      toast.error(`Failed to disconnect ${integrationId}`);
      throw err;
    }
  }, [entityId]);

  // Update integration settings
  const updateIntegrationSettings = useCallback(async (
    integrationId: string, 
    updates: Partial<IntegrationSettings>
  ) => {
    try {
      const updatedIntegration = integrationService.updateIntegrationSettings(entityId, integrationId, updates);
      if (updatedIntegration) {
        setIntegrations(prev => ({
          ...prev,
          [integrationId]: updatedIntegration
        }));
        console.log(`${integrationId} settings updated successfully`, updatedIntegration);
      }
      return updatedIntegration;
    } catch (err) {
      toast.error(`Failed to update ${integrationId} settings`);
      throw err;
    }
  }, [entityId]);

  // Test a webhook
  const testWebhook = useCallback(async (url: string, payload: any = {}) => {
    try {
      const success = await integrationService.testWebhook(url, {
        ...payload,
        test: true,
        timestamp: new Date().toISOString()
      });
      
      if (success) {
        toast.success('Webhook test successful');
      } else {
        toast.error('Webhook test failed');
      }
      
      return success;
    } catch (err) {
      toast.error('Webhook test failed');
      throw err;
    }
  }, []);

  // Check if an integration is connected
  const isConnected = useCallback((integrationId: string) => {
    return integrations[integrationId]?.enabled || false;
  }, [integrations]);

  // Get a specific integration
  const getIntegration = useCallback((integrationId: string) => {
    return integrations[integrationId] || null;
  }, [integrations]);

  // Load integrations on mount
  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  return {
    integrations,
    isLoading,
    error,
    connectIntegration,
    disconnectIntegration,
    updateIntegrationSettings,
    testWebhook: integrationService.testWebhook,
    isConnected: useCallback((integrationId: string) => {
      return integrations[integrationId]?.enabled || false;
    }, [integrations]),
    getIntegration: useCallback((integrationId: string) => {
      return integrations[integrationId] || null;
    }, [integrations]),
    fetchIntegrations
  };
}
