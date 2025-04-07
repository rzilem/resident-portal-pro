
import { User } from '@/types/user';

// Mock data for users when Supabase fails
export const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    securityLevel: 'full_access',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    firstName: 'Manager',
    lastName: 'User',
    role: 'manager',
    status: 'active',
    securityLevel: 'advanced',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'staff@example.com',
    name: 'Staff User',
    firstName: 'Staff',
    lastName: 'User',
    role: 'staff',
    status: 'active',
    securityLevel: 'basic',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Convert a profile from Supabase to our User type
export function profileToUser(profile: any): User {
  return {
    id: profile.id,
    email: profile.email || '',
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email?.split('@')[0] || 'Anonymous User',
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    role: profile.role || 'resident',
    status: 'active',
    securityLevel: 'basic',
    createdAt: profile.created_at,
    updatedAt: profile.updated_at
  };
}

// Cache management functions (stubs for now)
export function addUserToCache(user: User): void {
  console.log('Adding user to cache:', user.id);
  // Implementation would store in memory or localStorage
}

export function updateUserInCache(user: User): void {
  console.log('Updating user in cache:', user.id);
  // Implementation would update in memory or localStorage
}

export function removeUserFromCache(userId: string): void {
  console.log('Removing user from cache:', userId);
  // Implementation would remove from memory or localStorage
}
