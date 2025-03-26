
import { User, UserRole, SecurityLevel } from '@/types/user';
import { defaultRolePermissions } from '@/components/settings/permissions/constants/securityLevels';

// In a real application, this would be fetched from a database
let users: User[] = [
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

export const userService = {
  getUsers: (): User[] => {
    return users;
  },

  getUserById: (id: string): User | undefined => {
    return users.find(user => user.id === id);
  },

  getUserByEmail: (email: string): User | undefined => {
    if (!email) return undefined;
    const normalizedEmail = email.toLowerCase().trim();
    return users.find(user => user.email.toLowerCase() === normalizedEmail);
  },

  updateUser: (updatedUser: User): User => {
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      // If role has changed, apply the default permissions for the new role
      if (users[index].role !== updatedUser.role) {
        const roleDefaults = defaultRolePermissions[updatedUser.role as UserRole];
        updatedUser.securityLevel = roleDefaults.securityLevel as SecurityLevel;
        // Apply default permissions from the role
      }
      
      users[index] = { ...users[index], ...updatedUser };
      return users[index];
    }
    throw new Error('User not found');
  },

  createUser: (user: Omit<User, 'id'>): User => {
    // Normalize the email by converting to lowercase and trimming
    const normalizedEmail = user.email.toLowerCase().trim();
    
    // Check if user with this email already exists - case insensitive
    const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      throw new Error('A user with this email already exists');
    }
    
    // Generate a unique ID with timestamp and random string to make it truly unique
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 11);
    const uniqueId = `${timestamp}-${randomString}`;
    
    // Get default permissions based on role
    const roleDefaults = defaultRolePermissions[user.role as UserRole];
    const securityLevel = roleDefaults.securityLevel as SecurityLevel;
    
    const newUser: User = { 
      ...user, 
      id: uniqueId, 
      email: normalizedEmail, // Store normalized email
      createdAt: new Date().toISOString(),
      securityLevel,
      status: 'pending' // New users start as pending until they accept the invitation
    };
    
    users.push(newUser);
    return newUser;
  },

  deleteUser: (id: string): void => {
    // Find the exact user with the matching ID (not by any other attribute)
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users.splice(index, 1);
    } else {
      throw new Error('User not found');
    }
  },

  activateUser: (id: string): User => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index].status = 'active';
      return users[index];
    }
    throw new Error('User not found');
  },

  deactivateUser: (id: string): User => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index].status = 'inactive';
      return users[index];
    }
    throw new Error('User not found');
  }
};
