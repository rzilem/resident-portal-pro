interface IntegrationSettings {
  enabled: boolean;
  apiKey?: string;
  webhookUrl?: string;
  connectedAccount?: string;
  lastSync?: string;
  config?: Record<string, any>;
  [key: string]: any; // Allow any additional fields for integration-specific configurations
}

// Integration settings storage - in real app this would be persistent
// Initialize with localStorage data if available
let integrationSettings: Record<string, Record<string, IntegrationSettings>> = (() => {
  try {
    const saved = localStorage.getItem('integrationSettings');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('Error loading integration settings:', e);
    return {};
  }
})();

// Helper to persist settings to localStorage
const persistSettings = () => {
  try {
    localStorage.setItem('integrationSettings', JSON.stringify(integrationSettings));
  } catch (e) {
    console.error('Error saving integration settings:', e);
  }
};

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
  getIntegrations: (entityId: string) => {
    return integrationSettings[entityId] || {};
  },

  /**
   * Get a specific integration
   */
  getIntegration: (entityId: string, integrationId: string) => {
    if (!integrationSettings[entityId]) {
      return null;
    }
    return integrationSettings[entityId][integrationId] || null;
  },

  /**
   * Connect an integration
   */
  connectIntegration: (
    entityId: string, 
    integrationId: string, 
    settings: IntegrationSettings
  ) => {
    if (!integrationSettings[entityId]) {
      integrationSettings[entityId] = {};
    }
    
    // Create or update the integration settings
    const existingSettings = integrationSettings[entityId][integrationId] || { enabled: false };
    
    integrationSettings[entityId][integrationId] = {
      ...existingSettings,
      ...settings,
      enabled: true,
      lastSync: new Date().toISOString()
    };
    
    console.log(`Connected integration ${integrationId} for ${entityId}`, integrationSettings[entityId][integrationId]);
    
    // Persist to localStorage
    persistSettings();
    
    return integrationSettings[entityId][integrationId];
  },

  /**
   * Disconnect an integration
   */
  disconnectIntegration: (entityId: string, integrationId: string) => {
    if (!integrationSettings[entityId] || !integrationSettings[entityId][integrationId]) {
      return false;
    }
    
    integrationSettings[entityId][integrationId].enabled = false;
    console.log(`Disconnected integration ${integrationId} for ${entityId}`);
    
    // Persist to localStorage
    persistSettings();
    
    return true;
  },

  /**
   * Update integration settings
   */
  updateIntegrationSettings: (
    entityId: string, 
    integrationId: string, 
    updates: Partial<IntegrationSettings>
  ) => {
    if (!integrationSettings[entityId]) {
      integrationSettings[entityId] = {};
    }
    
    if (!integrationSettings[entityId][integrationId]) {
      integrationSettings[entityId][integrationId] = {
        enabled: false
      };
    }
    
    integrationSettings[entityId][integrationId] = {
      ...integrationSettings[entityId][integrationId],
      ...updates
    };
    
    console.log(`Updated settings for ${integrationId}`, {
      entityId,
      updatedFields: Object.keys(updates),
      enabled: integrationSettings[entityId][integrationId].enabled
    });
    
    // Persist to localStorage
    persistSettings();
    
    return integrationSettings[entityId][integrationId];
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
