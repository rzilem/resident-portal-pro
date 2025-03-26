
import { User, UserRole } from '@/types/user';

// Define permission levels for various features
export type Permission = 'view' | 'edit' | 'create' | 'delete' | 'approve' | 'admin';

// Define module permissions
export interface ModulePermissions {
  [key: string]: Permission[];
}

// Map roles to their permissions
const rolePermissionsMap: Record<UserRole, ModulePermissions> = {
  admin: {
    resale: ['view', 'edit', 'create', 'delete', 'approve', 'admin'],
    accounting: ['view', 'edit', 'create', 'delete', 'approve', 'admin'],
    properties: ['view', 'edit', 'create', 'delete', 'admin'],
    residents: ['view', 'edit', 'create', 'delete', 'admin']
  },
  manager: {
    resale: ['view', 'edit', 'create', 'approve'],
    accounting: ['view', 'edit', 'create'],
    properties: ['view', 'edit'],
    residents: ['view', 'edit', 'create']
  },
  staff: {
    resale: ['view', 'create'],
    accounting: ['view'],
    properties: ['view'],
    residents: ['view']
  },
  resident: {
    resale: ['view'],
    accounting: [],
    properties: ['view'],
    residents: ['view']
  },
  board_member: {
    resale: ['view', 'approve'],
    accounting: ['view'],
    properties: ['view'],
    residents: ['view']
  },
  board: {
    resale: ['view', 'approve'],
    accounting: ['view'],
    properties: ['view'],
    residents: ['view']
  },
  committee: {
    resale: ['view'],
    accounting: [],
    properties: ['view'],
    residents: ['view']
  },
  guest: {
    resale: [],
    accounting: [],
    properties: [],
    residents: []
  }
};

export const roleService = {
  // Check if user has permission for a specific action on a module
  hasPermission: (user: User, module: string, permission: Permission): boolean => {
    if (!user || !user.role) return false;
    
    const userPermissions = rolePermissionsMap[user.role][module] || [];
    return userPermissions.includes(permission) || userPermissions.includes('admin');
  },
  
  // Get all permissions for a user
  getUserPermissions: (user: User): ModulePermissions => {
    if (!user || !user.role) return {};
    return rolePermissionsMap[user.role];
  },
  
  // Get all users with specific permission for a module
  getUsersWithPermission: (users: User[], module: string, permission: Permission): User[] => {
    return users.filter(user => roleService.hasPermission(user, module, permission));
  }
};
