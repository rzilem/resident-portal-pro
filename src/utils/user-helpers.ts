
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/types/user';

/**
 * Adapts a Supabase User to our application's User type
 * Used to ensure compatibility between auth system and application
 */
export function adaptSupabaseUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.full_name || supabaseUser.email || 'Anonymous User',
    firstName: supabaseUser.user_metadata?.first_name || '',
    lastName: supabaseUser.user_metadata?.last_name || '',
    role: supabaseUser.user_metadata?.role || 'resident',
    status: 'active',
    securityLevel: 'basic'
  };
}
