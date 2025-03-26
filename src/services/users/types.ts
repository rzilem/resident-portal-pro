
import { User, UserRole, SecurityLevel } from '@/types/user';
import { Profile } from '@/types/supabase';

// Local users array for fallback when offline or during development
export let users: User[] = [
  { 
    id: '1', 
    name: 'Jane Smith', 
    email: 'jane.smith@example.com', 
    role: 'admin', 
    status: 'active',
    firstName: 'Jane',
    lastName: 'Smith',
    lastLogin: new Date().toISOString(),
    createdAt: '2023-01-15T10:30:00Z',
  },
  { 
    id: '2', 
    name: 'John Doe', 
    email: 'john.doe@example.com', 
    role: 'manager', 
    status: 'active',
    firstName: 'John',
    lastName: 'Doe',
    lastLogin: new Date().toISOString(),
    createdAt: '2023-02-10T14:20:00Z',
  },
  { 
    id: '3', 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    role: 'board', 
    status: 'active',
    firstName: 'Alice',
    lastName: 'Johnson',
    lastLogin: new Date().toISOString(),
    createdAt: '2023-03-05T09:15:00Z',
  },
  { 
    id: '4', 
    name: 'Bob Wilson', 
    email: 'bob@example.com', 
    role: 'resident', 
    status: 'pending',
    firstName: 'Bob',
    lastName: 'Wilson',
    createdAt: '2023-04-20T11:45:00Z',
  },
];

// Helper to convert Profile from Supabase to User
export const profileToUser = (profile: Profile): User => {
  return {
    id: profile.id,
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
    email: profile.email,
    role: profile.role as UserRole,
    status: 'active', // Default status
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    createdAt: profile.created_at || new Date().toISOString(),
    lastLogin: profile.updated_at || new Date().toISOString(),
  };
};

// Update the local users cache
export const updateUsersCache = (updatedUser: User): void => {
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
  }
};

// Add user to local cache
export const addUserToCache = (user: User): void => {
  users.push(user);
};

// Remove user from local cache
export const removeUserFromCache = (id: string): void => {
  users = users.filter(user => user.id !== id);
};
