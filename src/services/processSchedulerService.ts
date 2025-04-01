
import { supabase } from '@/integrations/supabase/client';
import { ScheduledProcess, ProcessType, ProcessFrequency } from '@/types/process';

// Define process types with labels for the UI
const processTypes = [
  { type: 'email-notification', label: 'Email Notification' },
  { type: 'data-sync', label: 'Data Synchronization' },
  { type: 'report-generation', label: 'Report Generation' },
  { type: 'data-cleanup', label: 'Data Cleanup' },
  { type: 'invoice-processing', label: 'Invoice Processing' },
  { type: 'payment-processing', label: 'Payment Processing' },
  { type: 'custom', label: 'Custom Process' }
];

// Define frequency options with labels for the UI
const frequencyOptions = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom Schedule' }
];

export const processSchedulerService = {
  /**
   * Get all scheduled processes
   */
  getProcesses: async (): Promise<ScheduledProcess[]> => {
    const { data, error } = await supabase
      .from('scheduled_processes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching processes:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get a single process by ID
   */
  getProcessById: async (id: string): Promise<ScheduledProcess | null> => {
    const { data, error } = await supabase
      .from('scheduled_processes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching process:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new scheduled process
   */
  createProcess: async (process: Omit<ScheduledProcess, 'id' | 'created_at'>): Promise<ScheduledProcess> => {
    const { data, error } = await supabase
      .from('scheduled_processes')
      .insert(process)
      .select()
      .single();

    if (error) {
      console.error('Error creating process:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update an existing process
   */
  updateProcess: async (id: string, updates: Partial<ScheduledProcess>): Promise<ScheduledProcess> => {
    const { data, error } = await supabase
      .from('scheduled_processes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating process:', error);
      throw error;
    }

    return data;
  },

  /**
   * Toggle a process's enabled status
   */
  toggleProcessStatus: async (id: string, enabled: boolean): Promise<void> => {
    const { error } = await supabase
      .from('scheduled_processes')
      .update({ enabled })
      .eq('id', id);

    if (error) {
      console.error('Error toggling process status:', error);
      throw error;
    }
  },

  /**
   * Toggle a process's enabled status - alias for toggleProcessStatus for compatibility
   */
  toggleProcessEnabled: async (id: string, enabled: boolean): Promise<boolean> => {
    try {
      await processSchedulerService.toggleProcessStatus(id, enabled);
      return true;
    } catch (error) {
      console.error('Error toggling process enabled status:', error);
      return false;
    }
  },

  /**
   * Delete a process
   */
  deleteProcess: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('scheduled_processes')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      return true;
    } catch (error) {
      console.error('Error deleting process:', error);
      return false;
    }
  },

  /**
   * Update the last run time for a process
   */
  updateLastRunTime: async (id: string): Promise<void> => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('scheduled_processes')
      .update({ last_run: now })
      .eq('id', id);

    if (error) {
      console.error('Error updating last run time:', error);
      throw error;
    }
  },

  /**
   * Update the last end time for a process
   */
  updateLastEndTime: async (id: string): Promise<void> => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('scheduled_processes')
      .update({ last_end: now })
      .eq('id', id);

    if (error) {
      console.error('Error updating last end time:', error);
      throw error;
    }
  },

  /**
   * Get available process types
   */
  getProcessTypes: () => {
    return processTypes;
  },

  /**
   * Get available frequency options
   */
  getFrequencyOptions: () => {
    return frequencyOptions;
  }
};

export default processSchedulerService;
