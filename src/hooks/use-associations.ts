
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
}

export const useAssociations = () => {
  const [associations, setAssociations] = useState<Association[]>([]);
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
    } catch (err) {
      console.error('Error fetching associations:', err);
      setError('Failed to load associations');
      toast.error('Failed to load associations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssociations();
  }, [fetchAssociations]);

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
    } catch (err) {
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
      
      toast.success('Association updated successfully');
      
      return data;
    } catch (err) {
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
      
      toast.success('Association deleted successfully');
      
      return true;
    } catch (err) {
      console.error('Error deleting association:', err);
      toast.error('Failed to delete association');
      throw err;
    }
  };

  return {
    associations,
    loading,
    error,
    fetchAssociations,
    createAssociation,
    updateAssociation,
    deleteAssociation
  };
};
