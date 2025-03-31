
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { integrationService } from '@/services/integrationService';
import { supabase } from '@/integrations/supabase/client';

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
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check if the user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUser(data?.session?.user || null);
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch all integrations
  const fetchIntegrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await integrationService.getIntegrations(entityId);
      console.log('Fetched integrations:', data);
      setIntegrations(data);
    } catch (err) {
      console.error('Error fetching integrations:', err);
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
      console.log('Connecting integration:', integrationId, settings);
      const updatedIntegration = await integrationService.connectIntegration(entityId, integrationId, settings);
      setIntegrations(prev => ({
        ...prev,
        [integrationId]: updatedIntegration
      }));
      return updatedIntegration;
    } catch (err) {
      console.error('Failed to connect integration:', err);
      toast.error(`Failed to connect ${integrationId}`);
      throw err;
    }
  }, [entityId]);

  // Disconnect an integration
  const disconnectIntegration = useCallback(async (integrationId: string) => {
    try {
      const success = await integrationService.disconnectIntegration(entityId, integrationId);
      if (success) {
        setIntegrations(prev => ({
          ...prev,
          [integrationId]: {
            ...prev[integrationId],
            enabled: false
          }
        }));
      }
      return success;
    } catch (err) {
      console.error('Failed to disconnect integration:', err);
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
      console.log('Updating integration settings:', integrationId, updates);
      const updatedIntegration = await integrationService.updateIntegrationSettings(entityId, integrationId, updates);
      if (updatedIntegration) {
        setIntegrations(prev => ({
          ...prev,
          [integrationId]: updatedIntegration
        }));
      }
      return updatedIntegration;
    } catch (err) {
      console.error('Failed to update integration settings:', err);
      toast.error(`Failed to update ${integrationId} settings`);
      throw err;
    }
  }, [entityId]);

  // Load integrations on mount or when auth state changes
  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations, currentUser]);

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
    fetchIntegrations,
    isAuthenticated: !!currentUser
  };
}
