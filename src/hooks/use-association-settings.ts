
import { useState, useEffect, useCallback } from 'react';
import { associationService } from '@/services/associationService';

interface ModuleSettings {
  documents: boolean;
  calendar: boolean;
  financials: boolean;
  maintenance: boolean;
  violations: boolean;
  residents: boolean;
  [key: string]: boolean;
}

interface CommunicationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  defaultEmailSender: string | null;
  [key: string]: any;
}

export interface AssociationSettings {
  modules: ModuleSettings;
  communications: CommunicationSettings;
  [key: string]: any;
}

export const useAssociationSettings = (associationId?: string) => {
  const [settings, setSettings] = useState<AssociationSettings>({
    modules: {
      documents: true,
      calendar: true,
      financials: true,
      maintenance: true,
      violations: true,
      residents: true
    },
    communications: {
      emailEnabled: true,
      smsEnabled: false,
      defaultEmailSender: null
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!associationId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await associationService.getAssociationSettings(associationId);
      
      // Merge with defaults to ensure all expected properties exist
      const mergedSettings = {
        modules: {
          documents: true,
          calendar: true,
          financials: true,
          maintenance: true,
          violations: true,
          residents: true,
          ...(data.modules || {})
        },
        communications: {
          emailEnabled: true,
          smsEnabled: false,
          defaultEmailSender: null,
          ...(data.communications || {})
        },
        ...data
      };
      
      setSettings(mergedSettings);
    } catch (err) {
      console.error('Error fetching association settings:', err);
      setError('Failed to load association settings');
    } finally {
      setIsLoading(false);
    }
  }, [associationId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (
    category: string,
    updates: Record<string, any>
  ): Promise<boolean> => {
    if (!associationId) {
      setError('No association selected');
      return false;
    }

    try {
      const success = await associationService.updateAssociationSetting(
        associationId,
        category,
        updates
      );
      
      if (success) {
        // Update local state
        setSettings(prev => ({
          ...prev,
          [category]: {
            ...(prev[category] || {}),
            ...updates
          }
        }));
      }
      
      return success;
    } catch (err) {
      console.error(`Error updating ${category} settings:`, err);
      setError(`Failed to update ${category} settings`);
      return false;
    }
  };

  const toggleModule = async (module: string, enabled: boolean): Promise<boolean> => {
    return updateSettings('modules', { [module]: enabled });
  };

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
    toggleModule
  };
};
