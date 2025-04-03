
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  
  async createAssociation(association: any) {
    try {
      const { data, error } = await supabase
        .from('associations')
        .insert(association)
        .select()
        .single();
      
      if (error) throw error;
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
      const { data, error } = await supabase
        .from('associations')
        .update(updates)
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
  }
};
