
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/types/user';

/**
 * Adapts a Supabase User to our application's User type
 * Used to ensure compatibility between auth system and application
 */
export function adaptSupabaseUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;
  
  // Extract name from user metadata or email
  const firstName = supabaseUser.user_metadata?.first_name || '';
  const lastName = supabaseUser.user_metadata?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || 
                  supabaseUser.user_metadata?.full_name || 
                  supabaseUser.email?.split('@')[0] || 
                  'Anonymous User';
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: fullName,
    firstName: firstName,
    lastName: lastName,
    role: supabaseUser.user_metadata?.role || 'resident',
    status: supabaseUser.banned ? 'inactive' : 'active',
    securityLevel: 'basic',
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at
  };
}
