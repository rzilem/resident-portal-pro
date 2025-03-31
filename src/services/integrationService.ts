
import { supabase } from "@/integrations/supabase/client";
import { UserIntegration } from "@/types/supabase";

interface IntegrationSettings {
  enabled: boolean;
  apiKey?: string;
  webhookUrl?: string;
  connectedAccount?: string;
  lastSync?: string;
  config?: Record<string, any>;
  [key: string]: any; // Allow any additional fields for integration-specific configurations
}

// Cache for integration settings to avoid unnecessary DB calls
let integrationsCache: Record<string, Record<string, IntegrationSettings>> = {};

// Helper to persist settings to localStorage as fallback
const persistToLocalStorage = () => {
  try {
    localStorage.setItem('integrationSettings', JSON.stringify(integrationsCache));
  } catch (e) {
    console.error('Error saving integration settings to localStorage:', e);
  }
};

// Load initial cache from localStorage
try {
  const saved = localStorage.getItem('integrationSettings');
  integrationsCache = saved ? JSON.parse(saved) : {};
} catch (e) {
  console.error('Error loading integration settings from localStorage:', e);
  integrationsCache = {};
}

// Integration schema registry - defines what fields each integration requires
const integrationSchemas: Record<string, { fields: string[] }> = {
  Stripe: { fields: ['apiKey', 'webhookSecret', 'publishableKey'] },
  PayPal: { fields: ['clientId', 'clientSecret', 'environment'] },
  Twilio: { fields: ['accountSid', 'authToken', 'phoneNumber'] },
  SendGrid: { fields: ['apiKey', 'fromEmail'] },
  // Add more integrations as needed
};

export const integrationService = {
  /**
   * Get all integrations for a user/association
   */
  getIntegrations: async (entityId: string): Promise<Record<string, IntegrationSettings>> => {
    // First check cache
    if (integrationsCache[entityId]) {
      return integrationsCache[entityId];
    }

    try {
      // Try to fetch from Supabase if authenticated
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        const { data: integrations, error } = await supabase
          .from('user_integrations')
          .select('*')
          .eq('user_id', session.session.user.id);
          
        if (error) {
          console.error('Error fetching integrations from Supabase:', error);
          // Fall back to localStorage
          return integrationsCache[entityId] || {};
        }
        
        if (integrations && integrations.length > 0) {
          // Format the data for our cache
          const formattedIntegrations: Record<string, IntegrationSettings> = {};
          
          integrations.forEach((integration: UserIntegration) => {
            formattedIntegrations[integration.integration_name] = {
              ...integration.settings,
              enabled: integration.enabled
            };
          });
          
          // Update our cache
          integrationsCache[entityId] = formattedIntegrations;
          return formattedIntegrations;
        }
      }
      
      // If no data in Supabase or not authenticated, use localStorage
      return integrationsCache[entityId] || {};
    } catch (error) {
      console.error('Error in getIntegrations:', error);
      return integrationsCache[entityId] || {};
    }
  },

  /**
   * Get a specific integration
   */
  getIntegration: (entityId: string, integrationId: string): IntegrationSettings | null => {
    if (!integrationsCache[entityId]) {
      return null;
    }
    return integrationsCache[entityId][integrationId] || null;
  },

  /**
   * Connect an integration
   */
  connectIntegration: async (
    entityId: string, 
    integrationId: string, 
    settings: IntegrationSettings
  ): Promise<IntegrationSettings> => {
    if (!integrationsCache[entityId]) {
      integrationsCache[entityId] = {};
    }
    
    // Create or update the integration settings
    const existingSettings = integrationsCache[entityId][integrationId] || { enabled: false };
    
    const updatedSettings = {
      ...existingSettings,
      ...settings,
      enabled: true,
      lastSync: new Date().toISOString()
    };
    
    integrationsCache[entityId][integrationId] = updatedSettings;
    
    try {
      // Store in Supabase if authenticated
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        const { error } = await supabase
          .from('user_integrations')
          .upsert({
            user_id: session.session.user.id,
            integration_name: integrationId,
            settings: updatedSettings,
            enabled: true
          }, {
            onConflict: 'user_id,integration_name'
          });
          
        if (error) {
          console.error('Error saving integration to Supabase:', error);
        } else {
          console.log(`Integration ${integrationId} saved to Supabase`);
        }
      }
    } catch (error) {
      console.error('Error connecting integration:', error);
    }
    
    // Always persist to localStorage as fallback
    persistToLocalStorage();
    
    console.log(`Connected integration ${integrationId} for ${entityId}`, updatedSettings);
    
    return updatedSettings;
  },

  /**
   * Disconnect an integration
   */
  disconnectIntegration: async (entityId: string, integrationId: string): Promise<boolean> => {
    if (!integrationsCache[entityId] || !integrationsCache[entityId][integrationId]) {
      return false;
    }
    
    integrationsCache[entityId][integrationId].enabled = false;
    
    try {
      // Update in Supabase if authenticated
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        const { error } = await supabase
          .from('user_integrations')
          .update({ enabled: false })
          .eq('user_id', session.session.user.id)
          .eq('integration_name', integrationId);
          
        if (error) {
          console.error('Error updating integration in Supabase:', error);
        }
      }
    } catch (error) {
      console.error('Error disconnecting integration:', error);
    }
    
    // Persist to localStorage as fallback
    persistToLocalStorage();
    
    console.log(`Disconnected integration ${integrationId} for ${entityId}`);
    
    return true;
  },

  /**
   * Update integration settings
   */
  updateIntegrationSettings: async (
    entityId: string, 
    integrationId: string, 
    updates: Partial<IntegrationSettings>
  ): Promise<IntegrationSettings> => {
    if (!integrationsCache[entityId]) {
      integrationsCache[entityId] = {};
    }
    
    if (!integrationsCache[entityId][integrationId]) {
      integrationsCache[entityId][integrationId] = {
        enabled: false
      };
    }
    
    const updatedSettings = {
      ...integrationsCache[entityId][integrationId],
      ...updates
    };
    
    integrationsCache[entityId][integrationId] = updatedSettings;
    
    try {
      // Update in Supabase if authenticated
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        const { error } = await supabase
          .from('user_integrations')
          .upsert({
            user_id: session.session.user.id,
            integration_name: integrationId,
            settings: updatedSettings,
            enabled: updatedSettings.enabled
          }, {
            onConflict: 'user_id,integration_name'
          });
          
        if (error) {
          console.error('Error updating integration in Supabase:', error);
        } else {
          console.log(`Integration ${integrationId} updated in Supabase`);
        }
      }
    } catch (error) {
      console.error('Error updating integration settings:', error);
    }
    
    // Persist to localStorage as fallback
    persistToLocalStorage();
    
    console.log(`Updated settings for ${integrationId}`, {
      entityId,
      updatedFields: Object.keys(updates),
      enabled: updatedSettings.enabled
    });
    
    return updatedSettings;
  },

  /**
   * Test a webhook integration
   */
  testWebhook: async (url: string, payload: any) => {
    try {
      console.log(`Testing webhook to ${url} with payload:`, payload);
      
      // In a real application, you would actually send the request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });
      
      console.log('Webhook test successful');
      return true;
    } catch (error) {
      console.error('Error testing webhook:', error);
      return false;
    }
  },

  /**
   * Test an API integration
   */
  testAPIConnection: async (integrationId: string, config: Record<string, any>) => {
    // This is a mock implementation - in a real app, you would test the actual service
    console.log(`Testing API connection for ${integrationId} with config:`, config);
    
    // Simulate API test
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // 80% success rate for demo purposes
        const success = Math.random() > 0.2;
        console.log(`API test ${success ? 'succeeded' : 'failed'} for ${integrationId}`);
        resolve(success);
      }, 1000);
    });
  },

  /**
   * Get required fields for an integration
   */
  getRequiredFields: (integrationId: string) => {
    return integrationSchemas[integrationId]?.fields || [];
  },

  /**
   * Validate integration configuration
   */
  validateConfig: (integrationId: string, config: Record<string, any>) => {
    const requiredFields = integrationSchemas[integrationId]?.fields || [];
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
      return {
        valid: false,
        missingFields
      };
    }
    
    return {
      valid: true,
      missingFields: []
    };
  }
};
