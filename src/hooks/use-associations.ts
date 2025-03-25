
import { useState, useEffect, useCallback } from 'react';
import { Association } from '@/types/association';
import {
  getAssociations,
  getAssociationById,
  createAssociation,
  updateAssociation,
  updateAssociationSetting,
  deleteAssociation,
  setDefaultAssociation,
  toggleAssociationStatus
} from '@/services/associationService';
import { toast } from 'sonner';

export const useAssociations = () => {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [activeAssociation, setActiveAssociation] = useState<Association | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssociations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAssociations();
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
    fetchAssociations();
  }, [fetchAssociations]);

  const selectAssociation = useCallback((association: Association) => {
    setActiveAssociation(association);
  }, []);

  const addAssociation = useCallback(async (newAssociation: Omit<Association, 'id'>) => {
    try {
      const created = await createAssociation(newAssociation);
      setAssociations(prev => [...prev, created]);
      toast.success('Association created successfully');
      return created;
    } catch (err) {
      toast.error('Failed to create association');
      throw err;
    }
  }, []);

  const updateAssociationData = useCallback(async (id: string, updates: Partial<Association>) => {
    try {
      const updated = await updateAssociation(id, updates);
      setAssociations(prev => prev.map(a => a.id === id ? updated : a));
      
      if (activeAssociation && activeAssociation.id === id) {
        setActiveAssociation(updated);
      }
      
      toast.success('Association updated successfully');
      return updated;
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
      const updated = await updateAssociationSetting(associationId, settingName, value);
      setAssociations(prev => prev.map(a => a.id === associationId ? updated : a));
      
      if (activeAssociation && activeAssociation.id === associationId) {
        setActiveAssociation(updated);
      }
      
      return updated;
    } catch (err) {
      toast.error(`Failed to update ${settingName}`);
      throw err;
    }
  }, [activeAssociation]);

  const removeAssociation = useCallback(async (id: string) => {
    try {
      await deleteAssociation(id);
      setAssociations(prev => prev.filter(a => a.id !== id));
      
      if (activeAssociation && activeAssociation.id === id) {
        const nextAssociation = associations.find(a => a.id !== id);
        setActiveAssociation(nextAssociation || null);
      }
      
      toast.success('Association deleted successfully');
      return true;
    } catch (err) {
      toast.error('Failed to delete association');
      throw err;
    }
  }, [activeAssociation, associations]);

  const makeDefaultAssociation = useCallback(async (id: string) => {
    try {
      const updated = await setDefaultAssociation(id);
      setAssociations(updated);
      toast.success('Default association updated');
      return updated;
    } catch (err) {
      toast.error('Failed to set default association');
      throw err;
    }
  }, []);

  const toggleStatus = useCallback(async (id: string) => {
    try {
      const updated = await toggleAssociationStatus(id);
      setAssociations(prev => prev.map(a => a.id === id ? updated : a));
      
      if (activeAssociation && activeAssociation.id === id) {
        setActiveAssociation(updated);
      }
      
      toast.success(`Association ${updated.status === 'active' ? 'activated' : 'deactivated'}`);
      return updated;
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
    fetchAssociations,
    selectAssociation,
    addAssociation,
    updateAssociation: updateAssociationData,
    updateSetting,
    removeAssociation,
    makeDefaultAssociation,
    toggleStatus
  };
};
