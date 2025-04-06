
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

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  phone_number?: string | null;
  profile_image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ResaleCertificate {
  id: string;
  property_id?: string;
  owner_name: string;
  association_name: string;
  status?: string;
  regular_assessment?: number;
  assessment_frequency?: string;
  special_assessment?: string;
  transfer_fee?: number;
  outstanding_balance?: number;
  violations?: string;
  litigation?: string;
  closing_date?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}
