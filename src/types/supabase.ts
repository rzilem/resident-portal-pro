
/**
 * Types for Supabase data models
 */

export interface UserIntegration {
  id: string;
  user_id: string;
  integration_name: string;
  settings: Record<string, any>;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}
