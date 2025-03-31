
import type { Database } from '@/integrations/supabase/types';

// Define profile type from the database schema
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Define association type from the database schema
export type Association = Database['public']['Tables']['associations']['Row'];

// Define property type from the database schema
export type Property = Database['public']['Tables']['properties']['Row'];

// Define resident type from the database schema
export type Resident = Database['public']['Tables']['residents']['Row'];

// Define resale certificate type from the database schema
export type ResaleCertificate = Database['public']['Tables']['resale_certificates']['Row'];

// Custom types that extend database types
export interface UserProfile extends Profile {
  fullName?: string;
}

export interface PropertyWithAssociation extends Property {
  association?: Association;
}

export interface ResidentWithDetails extends Resident {
  profile?: Profile;
  property?: Property;
}

// Define UserIntegration type manually since it might not be in the generated types yet
export interface UserIntegration {
  id: string;
  user_id: string;
  integration_name: string;
  settings: Record<string, any>;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}
