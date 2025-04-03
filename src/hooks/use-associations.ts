
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Association {
  id: string;
  name: string;
  type?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  units?: number;
  created_at?: string;
  updated_at?: string;
  status?: 'active' | 'inactive';
}

export const useAssociations = () => {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [activeAssociation, setActiveAssociation] = useState<Association | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssociations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('associations')
        .select('*')
        .order('name');
      
      if (fetchError) {
        throw fetchError;
      }
      
      setAssociations(data || []);
      
      // Set active association to the first one if no active association
      if (data && data.length > 0 && !activeAssociation) {
        setActiveAssociation(data[0]);
      }
    } catch (err: any) {
      console.error('Error fetching associations:', err);
      setError(err.message || 'Failed to load associations');
      toast.error('Failed to load associations');
    } finally {
      setLoading(false);
    }
  }, [activeAssociation]);

  useEffect(() => {
    fetchAssociations();
  }, [fetchAssociations]);

  const selectAssociation = (association: Association) => {
    setActiveAssociation(association);
  };

  const createAssociation = async (association: Omit<Association, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('associations')
        .insert(association)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setAssociations(prev => [...prev, data]);
      toast.success('Association created successfully');
      
      return data;
    } catch (err: any) {
      console.error('Error creating association:', err);
      toast.error('Failed to create association');
      throw err;
    }
  };

  const updateAssociation = async (id: string, updates: Partial<Association>) => {
    try {
      const { data, error } = await supabase
        .from('associations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setAssociations(prev => 
        prev.map(assoc => assoc.id === id ? data : assoc)
      );
      
      // Update activeAssociation if it's the one being updated
      if (activeAssociation && activeAssociation.id === id) {
        setActiveAssociation(data);
      }
      
      toast.success('Association updated successfully');
      
      return data;
    } catch (err: any) {
      console.error('Error updating association:', err);
      toast.error('Failed to update association');
      throw err;
    }
  };

  const deleteAssociation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('associations')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setAssociations(prev => 
        prev.filter(assoc => assoc.id !== id)
      );
      
      // Clear activeAssociation if it's the one being deleted
      if (activeAssociation && activeAssociation.id === id) {
        setActiveAssociation(associations.length > 1 ? 
          associations.find(a => a.id !== id) || null : null);
      }
      
      toast.success('Association deleted successfully');
      
      return true;
    } catch (err: any) {
      console.error('Error deleting association:', err);
      toast.error('Failed to delete association');
      throw err;
    }
  };

  // Add additional methods needed by components
  const addAssociation = createAssociation;
  
  const updateSetting = async (id: string, settingName: string, value: any) => {
    // This would typically update a specific setting in the association
    return updateAssociation(id, { [settingName]: value });
  };
  
  const removeAssociation = deleteAssociation;
  
  const makeDefaultAssociation = async (id: string) => {
    // Implement logic for making an association the default
    // For now, just set it as the active association
    const assoc = associations.find(a => a.id === id);
    if (assoc) {
      setActiveAssociation(assoc);
      toast.success(`${assoc.name} set as default association`);
      return true;
    }
    return false;
  };
  
  const toggleStatus = async (id: string) => {
    const assoc = associations.find(a => a.id === id);
    if (assoc) {
      const newStatus = assoc.status === 'active' ? 'inactive' : 'active';
      return updateAssociation(id, { status: newStatus });
    }
    return null;
  };

  return {
    associations,
    activeAssociation,
    loading,
    isLoading: loading, // Alias for components expecting 'isLoading'
    error,
    fetchAssociations,
    createAssociation,
    updateAssociation,
    deleteAssociation,
    selectAssociation,
    addAssociation,
    updateSetting,
    removeAssociation,
    makeDefaultAssociation,
    toggleStatus
  };
};
