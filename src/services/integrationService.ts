
interface IntegrationSettings {
  enabled: boolean;
  apiKey?: string;
  webhookUrl?: string;
  connectedAccount?: string;
  lastSync?: string;
  config?: Record<string, any>;
}

// Integration settings storage
let integrationSettings: Record<string, Record<string, IntegrationSettings>> = {};

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
    
    integrationSettings[entityId][integrationId] = {
      ...settings,
      enabled: true,
      lastSync: new Date().toISOString()
    };
    
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
    if (!integrationSettings[entityId] || !integrationSettings[entityId][integrationId]) {
      return null;
    }
    
    integrationSettings[entityId][integrationId] = {
      ...integrationSettings[entityId][integrationId],
      ...updates
    };
    
    return integrationSettings[entityId][integrationId];
  },

  /**
   * Test a webhook integration
   */
  testWebhook: async (url: string, payload: any) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });
      
      return true;
    } catch (error) {
      console.error('Error testing webhook:', error);
      return false;
    }
  }
};
