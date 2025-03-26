
import { User, UserRole, SecurityLevel } from '@/types/user';
import { Profile } from '@/types/supabase';

// In-memory cache of users for when Supabase isn't available
export let users: User[] = [
  {
    id: "user-admin-1",
    name: "Admin User",
    firstName: "Admin",
    lastName: "User",
    email: "admin@residentpro.com",
    role: "admin",
    status: "active",
    securityLevel: "full_access",
    createdAt: "2023-01-01T00:00:00.000Z"
  },
  {
    id: "user-manager-1",
    name: "Manager User",
    firstName: "Manager",
    lastName: "User",
    email: "manager@residentpro.com",
    role: "manager",
    status: "active",
    securityLevel: "advanced",
    createdAt: "2023-01-02T00:00:00.000Z"
  },
  {
    id: "user-resident-1",
    name: "Resident User",
    firstName: "Resident",
    lastName: "User",
    email: "resident@residentpro.com",
    role: "resident",
    status: "active",
    securityLevel: "basic",
    createdAt: "2023-01-03T00:00:00.000Z"
  }
];

// Helper function to transform Profile to User
export const profileToUser = (profile: Profile): User => {
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  
  return {
    id: profile.id,
    name: fullName || profile.email,
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    email: profile.email,
    role: profile.role as UserRole || 'resident',
    status: 'active', // Default to active for profiles
    securityLevel: getSecurityLevelForRole(profile.role as UserRole),
    profileImageUrl: profile.profile_image_url,
    phoneNumber: profile.phone_number,
    createdAt: profile.created_at
  };
};

// Helper function to get security level based on role
const getSecurityLevelForRole = (role: UserRole): SecurityLevel => {
  switch (role) {
    case 'admin':
      return 'full_access';
    case 'manager':
      return 'advanced';
    case 'board_member':
    case 'board':
      return 'elevated';
    case 'committee':
      return 'moderate_access';
    case 'staff':
      return 'limited_access';
    case 'resident':
      return 'basic';
    case 'guest':
      return 'restricted';
    default:
      return 'basic';
  }
};

// Add a user to the in-memory cache
export const addUserToCache = (user: User): void => {
  // Check if user already exists in the cache
  const existingUserIndex = users.findIndex(u => u.id === user.id);
  
  if (existingUserIndex >= 0) {
    // Update the existing user
    users[existingUserIndex] = { ...users[existingUserIndex], ...user };
  } else {
    // Add the new user
    users.push(user);
  }
};

// Remove a user from the in-memory cache
export const removeUserFromCache = (userId: string): void => {
  users = users.filter(user => user.id !== userId);
};

// Update a user in the in-memory cache
export const updateUserInCache = (userId: string, userData: Partial<User>): User | undefined => {
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex >= 0) {
    users[userIndex] = { ...users[userIndex], ...userData };
    return users[userIndex];
  }
  
  return undefined;
};
