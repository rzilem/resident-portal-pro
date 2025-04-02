
import { useState, useEffect, useCallback } from 'react';
import { EmailSequence } from '@/types/lead';
import { emailSequenceService } from '@/services/emailSequenceService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

export function useLeadSequences() {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSequences = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedSequences = await emailSequenceService.getSequences();
      setSequences(fetchedSequences);
      setError(null);
    } catch (err) {
      console.error('Error fetching sequences:', err);
      setError('Failed to load sequences');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSequences();
  }, [fetchSequences]);

  const createSequence = useCallback(async (sequence: Omit<EmailSequence, 'id' | 'createdat' | 'updatedat'>) => {
    try {
      const newSequence = await emailSequenceService.createSequence({
        ...sequence,
        createdby: user?.id
      });
      
      if (newSequence) {
        setSequences(prev => [...prev, newSequence]);
      }
      
      return newSequence;
    } catch (err) {
      console.error('Error creating sequence:', err);
      toast.error('Failed to create sequence');
      throw err;
    }
  }, [user]);

  const updateSequence = useCallback(async (id: string, updates: Partial<EmailSequence>) => {
    try {
      const updatedSequence = await emailSequenceService.updateSequence(id, updates);
      
      if (updatedSequence) {
        setSequences(prev => 
          prev.map(sequence => sequence.id === id ? updatedSequence : sequence)
        );
        
        if (selectedSequence?.id === id) {
          setSelectedSequence(updatedSequence);
        }
      }
      
      return updatedSequence;
    } catch (err) {
      console.error('Error updating sequence:', err);
      toast.error('Failed to update sequence');
      throw err;
    }
  }, [selectedSequence]);

  const deleteSequence = useCallback(async (id: string) => {
    try {
      const success = await emailSequenceService.deleteSequence(id);
      
      if (success) {
        setSequences(prev => prev.filter(sequence => sequence.id !== id));
        
        if (selectedSequence?.id === id) {
          setSelectedSequence(null);
        }
      }
      
      return success;
    } catch (err) {
      console.error('Error deleting sequence:', err);
      toast.error('Failed to delete sequence');
      throw err;
    }
  }, [selectedSequence]);

  const enrollLeadInSequence = useCallback(async (leadId: string, sequenceId: string) => {
    try {
      const result = await emailSequenceService.enrollLeadInSequence(leadId, sequenceId);
      
      if (result.success) {
        toast.success('Lead enrolled in sequence successfully');
      } else if (result.error) {
        toast.error(`Failed to enroll lead: ${result.error}`);
      }
      
      return result;
    } catch (err) {
      console.error('Error enrolling lead in sequence:', err);
      toast.error('Failed to enroll lead in sequence');
      return { success: false, error: err.message };
    }
  }, []);

  const pauseSequence = useCallback(async (leadId: string, sequenceId: string) => {
    try {
      const result = await emailSequenceService.pauseSequence(leadId, sequenceId);
      
      if (result.success) {
        toast.success('Sequence paused successfully');
      } else if (result.error) {
        toast.error(`Failed to pause sequence: ${result.error}`);
      }
      
      return result;
    } catch (err) {
      console.error('Error pausing sequence:', err);
      toast.error('Failed to pause sequence');
      return { success: false, error: err.message };
    }
  }, []);

  const resumeSequence = useCallback(async (leadId: string, sequenceId: string) => {
    try {
      const result = await emailSequenceService.resumeSequence(leadId, sequenceId);
      
      if (result.success) {
        toast.success('Sequence resumed successfully');
      } else if (result.error) {
        toast.error(`Failed to resume sequence: ${result.error}`);
      }
      
      return result;
    } catch (err) {
      console.error('Error resuming sequence:', err);
      toast.error('Failed to resume sequence');
      return { success: false, error: err.message };
    }
  }, []);

  const getLeadSequences = useCallback(async (leadId: string) => {
    try {
      return await emailSequenceService.getLeadSequences(leadId);
    } catch (err) {
      console.error('Error getting lead sequences:', err);
      return { enrollments: [], error: err.message };
    }
  }, []);

  return {
    sequences,
    selectedSequence,
    setSelectedSequence,
    isLoading,
    error,
    fetchSequences,
    createSequence,
    updateSequence,
    deleteSequence,
    enrollLeadInSequence,
    pauseSequence,
    resumeSequence,
    getLeadSequences
  };
}
