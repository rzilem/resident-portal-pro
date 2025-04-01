
export type ProcessFrequency = 'daily' | 'weekly' | 'monthly' | 'hourly' | 'custom';

export type ProcessType = 
  | 'email-notification' 
  | 'data-sync' 
  | 'report-generation' 
  | 'data-cleanup' 
  | 'invoice-processing'
  | 'payment-processing'
  | 'custom';

export interface ScheduledProcess {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  run_time: string;
  created_at: string;
  last_run?: string;
  last_end?: string;
  enabled: boolean;
  frequency: ProcessFrequency;
  parameters: Record<string, any>;
  process_type: ProcessType;
  created_by?: string;
  association_id?: string;
}

export interface ProcessHistoryEntry {
  id: string;
  process_id: string;
  start_time: string;
  end_time?: string;
  status: 'running' | 'completed' | 'failed';
  result?: any;
  error_message?: string;
}
