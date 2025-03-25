
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { printQueueService, PrintJob, PrintCategory } from '@/services/printQueueService';

export function usePrintQueue() {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    category?: PrintCategory;
    associationId?: string;
  }>({});

  // Load all print jobs
  const loadPrintJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let jobs = printQueueService.getAllJobs();
      
      // Apply filters if any
      if (filters.category) {
        jobs = jobs.filter(job => job.category === filters.category);
      }
      if (filters.associationId) {
        jobs = jobs.filter(job => job.associationId === filters.associationId);
      }
      
      setPrintJobs(jobs);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load print jobs'));
      toast.error('Failed to load print queue');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Add a new print job
  const addPrintJob = useCallback(async (job: Omit<PrintJob, 'id'>) => {
    try {
      const newJob = printQueueService.addJob(job);
      setPrintJobs(prev => [...prev, newJob]);
      toast.success('Print job added successfully');
      return newJob;
    } catch (err) {
      toast.error('Failed to add print job');
      throw err;
    }
  }, []);

  // Update a print job
  const updatePrintJob = useCallback(async (id: string, updates: Partial<PrintJob>) => {
    try {
      const updatedJob = printQueueService.updateJob(id, updates);
      if (updatedJob) {
        setPrintJobs(prev => prev.map(job => job.id === id ? updatedJob : job));
        toast.success('Print job updated successfully');
        return updatedJob;
      }
      throw new Error('Job not found');
    } catch (err) {
      toast.error('Failed to update print job');
      throw err;
    }
  }, []);

  // Delete a print job
  const deletePrintJob = useCallback(async (id: string) => {
    try {
      const success = printQueueService.deleteJob(id);
      if (success) {
        setPrintJobs(prev => prev.filter(job => job.id !== id));
        setSelectedJobs(prev => prev.filter(jobId => jobId !== id));
        toast.success('Print job deleted successfully');
      }
      return success;
    } catch (err) {
      toast.error('Failed to delete print job');
      throw err;
    }
  }, []);

  // Toggle job selection
  const toggleJobSelection = useCallback((id: string) => {
    setSelectedJobs(prev => 
      prev.includes(id) 
        ? prev.filter(jobId => jobId !== id) 
        : [...prev, id]
    );
  }, []);

  // Select all jobs
  const selectAllJobs = useCallback(() => {
    setSelectedJobs(printJobs.map(job => job.id));
  }, [printJobs]);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setSelectedJobs([]);
  }, []);

  // Send selected jobs to HOA Mailers
  const sendToHOAMailers = useCallback(async () => {
    if (selectedJobs.length === 0) {
      toast.warning('No jobs selected to send');
      return { success: false, sentJobs: [] };
    }
    
    try {
      const result = printQueueService.sendToHOAMailers(selectedJobs);
      if (result.success) {
        setPrintJobs(prev => prev.map(job => 
          selectedJobs.includes(job.id) && job.status === 'pending'
            ? { ...job, status: 'sent', sentDate: new Date() }
            : job
        ));
        toast.success(`${result.sentJobs.length} jobs sent to HOA Mailers`);
        clearSelections();
      } else {
        toast.error('No eligible jobs to send');
      }
      return result;
    } catch (err) {
      toast.error('Failed to send jobs to HOA Mailers');
      throw err;
    }
  }, [selectedJobs, clearSelections]);

  // Set filters
  const setFilter = useCallback((key: 'category' | 'associationId', value?: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Load jobs on mount and when filters change
  useEffect(() => {
    loadPrintJobs();
  }, [loadPrintJobs]);

  return {
    printJobs,
    isLoading,
    error,
    selectedJobs,
    filters,
    loadPrintJobs,
    addPrintJob,
    updatePrintJob,
    deletePrintJob,
    toggleJobSelection,
    selectAllJobs,
    clearSelections,
    sendToHOAMailers,
    setFilter,
    clearFilters
  };
}
