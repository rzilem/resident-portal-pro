
import { supabase } from '@/integrations/supabase/client';
import { ScheduledProcess, ProcessType, ProcessFrequency } from '@/types/process';
import { toast } from 'sonner';

export const processSchedulerService = {
  /**
   * Get all scheduled processes
   */
  getProcesses: async (): Promise<ScheduledProcess[]> => {
    try {
      const { data, error } = await supabase
        .from('scheduled_processes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching scheduled processes:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProcesses:', error);
      toast.error('Failed to fetch processes');
      return [];
    }
  },

  /**
   * Get a single process by ID
   */
  getProcessById: async (id: string): Promise<ScheduledProcess | null> => {
    try {
      const { data, error } = await supabase
        .from('scheduled_processes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Error fetching process ${id}:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getProcessById:', error);
      return null;
    }
  },

  /**
   * Create a new scheduled process
   */
  createProcess: async (process: Omit<ScheduledProcess, 'id' | 'created_at'>): Promise<ScheduledProcess | null> => {
    try {
      const { data, error } = await supabase
        .from('scheduled_processes')
        .insert([process])
        .select()
        .single();

      if (error) {
        console.error('Error creating process:', error);
        toast.error('Failed to create process');
        throw error;
      }

      toast.success('Process scheduled successfully');
      return data;
    } catch (error) {
      console.error('Error in createProcess:', error);
      return null;
    }
  },

  /**
   * Update an existing scheduled process
   */
  updateProcess: async (id: string, updates: Partial<ScheduledProcess>): Promise<ScheduledProcess | null> => {
    try {
      const { data, error } = await supabase
        .from('scheduled_processes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating process ${id}:`, error);
        toast.error('Failed to update process');
        throw error;
      }

      toast.success('Process updated successfully');
      return data;
    } catch (error) {
      console.error('Error in updateProcess:', error);
      return null;
    }
  },

  /**
   * Delete a scheduled process
   */
  deleteProcess: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('scheduled_processes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting process ${id}:`, error);
        toast.error('Failed to delete process');
        throw error;
      }

      toast.success('Process deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteProcess:', error);
      return false;
    }
  },

  /**
   * Toggle a process enabled/disabled state
   */
  toggleProcessEnabled: async (id: string, enabled: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('scheduled_processes')
        .update({ enabled })
        .eq('id', id);

      if (error) {
        console.error(`Error toggling process ${id}:`, error);
        toast.error(`Failed to ${enabled ? 'enable' : 'disable'} process`);
        throw error;
      }

      toast.success(`Process ${enabled ? 'enabled' : 'disabled'} successfully`);
      return true;
    } catch (error) {
      console.error('Error in toggleProcessEnabled:', error);
      return false;
    }
  },

  /**
   * Get available process types and their descriptions
   */
  getProcessTypes: (): {type: ProcessType, label: string, description: string}[] => {
    return [
      {
        type: 'email-notification',
        label: 'Email Notification',
        description: 'Sends automated email notifications based on configured triggers.'
      },
      {
        type: 'data-sync',
        label: 'Data Synchronization',
        description: 'Synchronizes data between systems or database tables.'
      },
      {
        type: 'report-generation',
        label: 'Report Generation',
        description: 'Generates and distributes reports on a schedule.'
      },
      {
        type: 'data-cleanup',
        label: 'Data Cleanup',
        description: 'Performs maintenance tasks like removing old data or optimizing storage.'
      },
      {
        type: 'invoice-processing',
        label: 'Invoice Processing',
        description: 'Automates processing of pending invoices.'
      },
      {
        type: 'payment-processing',
        label: 'Payment Processing',
        description: 'Handles scheduled payment tasks and updates.'
      },
      {
        type: 'custom',
        label: 'Custom Process',
        description: 'Custom process with configurable parameters.'
      }
    ];
  },

  /**
   * Get available frequency options
   */
  getFrequencyOptions: (): {value: ProcessFrequency, label: string}[] => {
    return [
      { value: 'hourly', label: 'Hourly' },
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'custom', label: 'Custom' }
    ];
  }
};
