import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { integrationService } from '@/services/integrationService';
import { supabase } from '@/lib/supabase';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const authStatus = !!data.session;
        setIsAuthenticated(authStatus);
        console.log("Auth status:", authStatus ? "Authenticated" : "Not authenticated");
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          const newAuthStatus = !!session;
          console.log(`Auth state changed to: ${newAuthStatus ? "Authenticated" : "Not authenticated"} (event: ${event})`);
          setIsAuthenticated(newAuthStatus);
          
          // Refresh integrations when auth state changes
          if (newAuthStatus !== isAuthenticated) {
            console.log("Auth state changed, refreshing integrations");
            // Use setTimeout to prevent potential deadlocks with Supabase client
            setTimeout(() => {
              fetchIntegrations();
            }, 0);
          }
        });
        
        if (!isInitialized) {
          console.log("Initial fetch of integrations");
          fetchIntegrations();
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [isInitialized]);

  const fetchIntegrations = useCallback(async () => {
    console.log('Fetching integrations...');
    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const authStatus = !!sessionData.session;
      setIsAuthenticated(authStatus);
      
      if (!authStatus) {
        console.log('Not authenticated, cannot fetch integrations');
        return false;
      }

      const entityId = sessionData.session?.user?.id || 'current-user';
      const fetchedIntegrations = await integrationService.getIntegrations(entityId);
      
      console.log('Loaded integrations:', Object.keys(fetchedIntegrations));
      
      const formattedIntegrations = Object.entries(fetchedIntegrations).map(
        ([id, settings]) => ({
          id,
          name: id,
          ...settings
        })
      );
      
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
      // Check authentication status first
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('You must be logged in to connect integrations');
        return false;
      }
      
      console.log(`Connecting integration ${id}...`, {
        ...settings,
        apiKey: settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none'
      });
      
      // Use the actual user ID if authenticated
      const entityId = sessionData.session.user.id;
      const result = await integrationService.connectIntegration(entityId, id, settings);
      
      if (!result) {
        console.error(`Failed to connect integration ${id}`);
        return false;
      }
      
      setIntegrations(prev => {
        const existing = prev.find(item => item.id === id);
        
        if (existing) {
          // Update existing integration
          return prev.map(item => 
            item.id === id ? { ...item, ...settings, enabled: true } : item
          );
        } else {
          // Add new integration if it doesn't exist
          return [...prev, { id, name: id, ...settings, enabled: true }];
        }
      });
      
      console.log(`Integration ${id} connected successfully`);
      return true;
    } catch (error) {
      console.error(`Error connecting integration ${id}:`, error);
      toast.error(`Failed to connect ${id}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectIntegration = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Check authentication status first
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('You must be logged in to disconnect integrations');
        return false;
      }
      
      console.log(`Disconnecting integration ${id}...`);
      
      const entityId = sessionData.session.user.id;
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
      // Check authentication status first
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('You must be logged in to update integration settings');
        return false;
      }
      
      console.log(`Updating integration ${id} settings...`, {
        ...settings,
        apiKey: settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none'
      });
      
      const entityId = sessionData.session.user.id;
      const result = await integrationService.updateIntegrationSettings(entityId, id, settings);
      
      if (!result) {
        console.error(`Failed to update integration ${id} settings`);
        return false;
      }
      
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
      return result;
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
  const checkAuthentication = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        return false;
      }
      
      const isAuth = !!data.session;
      console.log("Checking authentication:", isAuth ? "Authenticated" : "Not authenticated");
      setIsAuthenticated(isAuth);
      return isAuth;
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

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
    testWebhook: useCallback(async () => true, []) // Placeholder to keep existing interface
  };
}
