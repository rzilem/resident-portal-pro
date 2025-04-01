
import { supabase } from '@/integrations/supabase/client';
import { ScheduledProcess } from '@/types/process';

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
   * Delete a process
   */
  deleteProcess: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('scheduled_processes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting process:', error);
      throw error;
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
  }
};

export default processSchedulerService;
