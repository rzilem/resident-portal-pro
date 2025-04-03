
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Association } from '@/types/association';
import { adaptPartialFullTypeToAssociation } from '@/utils/type-adapters';

/**
 * Get an association by ID
 * @param {string} id - The association ID 
 * @returns {Promise<any>} - The association object or null if not found
 */
export const getAssociationById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('associations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching association:', error);
    toast.error('Failed to load association details');
    return null;
  }
};

/**
 * Get association settings by association ID
 * @param {string} associationId - The association ID
 * @returns {Promise<any>} - The settings object or null if not found
 */
export const getAssociationSettings = async (associationId: string) => {
  try {
    const { data, error } = await supabase
      .from('association_settings')
      .select('settings')
      .eq('association_id', associationId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows found" error, which is fine for a new association
      console.error('Error fetching association settings:', error);
      throw error;
    }
    
    return data?.settings || {};
  } catch (error) {
    console.error('Error fetching association settings:', error);
    toast.error('Failed to load association settings');
    return {};
  }
};

/**
 * Update association settings
 * @param {string} associationId - The association ID
 * @param {string} category - Settings category (e.g., 'modules', 'communications')
 * @param {any} settings - The settings to update
 * @returns {Promise<boolean>} - Whether the update was successful
 */
export const updateAssociationSetting = async (
  associationId: string,
  category: string,
  settings: any
): Promise<boolean> => {
  try {
    // First get existing settings
    const existingSettings = await getAssociationSettings(associationId);
    
    // Update the specific category
    const updatedSettings = {
      ...existingSettings,
      [category]: {
        ...(existingSettings[category] || {}),
        ...settings
      }
    };
    
    // Upsert the settings
    const { error } = await supabase
      .from('association_settings')
      .upsert({
        association_id: associationId,
        settings: updatedSettings,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    toast.success('Association settings updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating association settings:', error);
    toast.error('Failed to update association settings');
    return false;
  }
};

export const associationService = {
  async getAssociations() {
    try {
      const { data, error } = await supabase
        .from('associations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching associations:', error);
      toast.error('Failed to load associations');
      return [];
    }
  },
  
  getAssociationById,
  
  async createAssociation(association: Partial<Association>) {
    try {
      // Convert from full type to DB type if needed
      const dbAssociation = adaptPartialFullTypeToAssociation(association);
      
      // Remove any id from the association to let the database generate one
      if (dbAssociation.id) {
        delete dbAssociation.id;
      }
      
      // Create the association
      const { data, error } = await supabase
        .from('associations')
        .insert(dbAssociation)
        .select()
        .single();
      
      if (error) throw error;
      
      // Initialize default settings
      if (data?.id) {
        await updateAssociationSetting(data.id, 'modules', {
          documents: true,
          calendar: true,
          financials: true,
          maintenance: true,
          violations: true,
          residents: true
        });
        
        await updateAssociationSetting(data.id, 'communications', {
          emailEnabled: true,
          smsEnabled: false,
          defaultEmailSender: null
        });
      }
      
      toast.success('Association created successfully');
      return data;
    } catch (error) {
      console.error('Error creating association:', error);
      toast.error('Failed to create association');
      return null;
    }
  },
  
  async updateAssociation(id: string, updates: any) {
    try {
      // Convert from full type to DB type if needed
      const dbUpdates = adaptPartialFullTypeToAssociation(updates);
      
      const { data, error } = await supabase
        .from('associations')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      toast.success('Association updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating association:', error);
      toast.error('Failed to update association');
      return null;
    }
  },
  
  async deleteAssociation(id: string) {
    try {
      // First delete settings to avoid foreign key constraints
      await supabase
        .from('association_settings')
        .delete()
        .eq('association_id', id);
      
      // Then delete the association
      const { error } = await supabase
        .from('associations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Association deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting association:', error);
      toast.error('Failed to delete association');
      return false;
    }
  },
  
  // New function for settings
  getAssociationSettings,
  
  // New function for updating settings
  updateAssociationSetting
};
