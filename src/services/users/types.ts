
import { User } from '@/types/user';

// Mock users for fallback
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    securityLevel: 'full_access'
  },
  {
    id: '2',
    name: 'Staff Member',
    email: 'staff@example.com',
    role: 'staff',
    status: 'active',
    securityLevel: 'moderate_access'
  }
];

// Convert a Supabase profile to our User type
export function profileToUser(profile: any): User {
  return {
    id: profile.id,
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email?.split('@')[0] || 'Unnamed User',
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    email: profile.email || '',
    role: profile.role || 'resident',
    status: 'active', // Default to active
    securityLevel: profile.role === 'admin' ? 'full_access' : 'basic',
    phoneNumber: profile.phone_number,
    profileImageUrl: profile.profile_image_url,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at
  };
}
