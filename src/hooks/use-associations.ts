
import { useState, useEffect, useCallback } from 'react';
import { Association } from '@/types/association';
import { toast } from 'sonner';
import { 
  fetchAssociations,
  createSupabaseAssociation,
  updateSupabaseAssociation,
  updateSupabaseAssociationSetting,
  deleteSupabaseAssociation,
  setDefaultSupabaseAssociation,
  toggleSupabaseAssociationStatus
} from '@/utils/supabase/associationUtils';

export const useAssociations = () => {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [activeAssociation, setActiveAssociation] = useState<Association | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadAssociations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAssociations();
      setAssociations(data);
      
      // Set active association to default or first one if no active
      if (!activeAssociation && data.length > 0) {
        const defaultAssociation = data.find(a => a.settings?.isDefault) || data[0];
        setActiveAssociation(defaultAssociation);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch associations'));
      toast.error('Failed to load associations');
    } finally {
      setIsLoading(false);
    }
  }, [activeAssociation]);

  useEffect(() => {
    loadAssociations();
  }, [loadAssociations]);

  const selectAssociation = useCallback((association: Association) => {
    setActiveAssociation(association);
  }, []);

  const addAssociation = useCallback(async (newAssociation: Omit<Association, 'id'>) => {
    try {
      const created = await createSupabaseAssociation(newAssociation);
      if (created) {
        setAssociations(prev => [...prev, created]);
        toast.success('Association created successfully');
        return created;
      }
      throw new Error('Failed to create association');
    } catch (err) {
      toast.error('Failed to create association');
      throw err;
    }
  }, []);

  const updateAssociationData = useCallback(async (id: string, updates: Partial<Association>) => {
    try {
      const updated = await updateSupabaseAssociation(id, updates);
      if (updated) {
        setAssociations(prev => prev.map(a => a.id === id ? updated : a));
        
        if (activeAssociation && activeAssociation.id === id) {
          setActiveAssociation(updated);
        }
        
        toast.success('Association updated successfully');
        return updated;
      }
      throw new Error('Failed to update association');
    } catch (err) {
      toast.error('Failed to update association');
      throw err;
    }
  }, [activeAssociation]);

  const updateSetting = useCallback(async (
    associationId: string,
    settingName: string,
    value: any
  ) => {
    try {
      const updated = await updateSupabaseAssociationSetting(associationId, settingName, value);
      if (updated) {
        setAssociations(prev => prev.map(a => a.id === associationId ? updated : a));
        
        if (activeAssociation && activeAssociation.id === associationId) {
          setActiveAssociation(updated);
        }
        
        return updated;
      }
      throw new Error(`Failed to update ${settingName}`);
    } catch (err) {
      toast.error(`Failed to update ${settingName}`);
      throw err;
    }
  }, [activeAssociation]);

  const removeAssociation = useCallback(async (id: string) => {
    try {
      const success = await deleteSupabaseAssociation(id);
      if (success) {
        setAssociations(prev => prev.filter(a => a.id !== id));
        
        if (activeAssociation && activeAssociation.id === id) {
          const nextAssociation = associations.find(a => a.id !== id);
          setActiveAssociation(nextAssociation || null);
        }
        
        toast.success('Association deleted successfully');
        return true;
      }
      throw new Error('Failed to delete association');
    } catch (err) {
      toast.error('Failed to delete association');
      throw err;
    }
  }, [activeAssociation, associations]);

  const makeDefaultAssociation = useCallback(async (id: string) => {
    try {
      const updated = await setDefaultSupabaseAssociation(id);
      if (updated && updated.length > 0) {
        setAssociations(updated);
        toast.success('Default association updated');
        return updated;
      }
      throw new Error('Failed to set default association');
    } catch (err) {
      toast.error('Failed to set default association');
      throw err;
    }
  }, []);

  const toggleStatus = useCallback(async (id: string) => {
    try {
      const updated = await toggleSupabaseAssociationStatus(id);
      if (updated) {
        setAssociations(prev => prev.map(a => a.id === id ? updated : a));
        
        if (activeAssociation && activeAssociation.id === id) {
          setActiveAssociation(updated);
        }
        
        toast.success(`Association ${updated.status === 'active' ? 'activated' : 'deactivated'}`);
        return updated;
      }
      throw new Error('Failed to toggle association status');
    } catch (err) {
      toast.error('Failed to toggle association status');
      throw err;
    }
  }, [activeAssociation]);

  return {
    associations,
    activeAssociation,
    setActiveAssociation,
    isLoading,
    error,
    fetchAssociations: loadAssociations,
    selectAssociation,
    addAssociation,
    updateAssociation: updateAssociationData,
    updateSetting,
    removeAssociation,
    makeDefaultAssociation,
    toggleStatus
  };
};
