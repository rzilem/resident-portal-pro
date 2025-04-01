
import { User } from '@/types/user';

export type Permission = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'import' | 'admin';

// Mock implementation for role-based permissions
export const roleService = {
  /**
   * Check if a user has a specific permission for a module
   */
  hasPermission: (user: User, module: string, permission: Permission): boolean => {
    // For this mock implementation, admins have all permissions
    if (user.role === 'admin') {
      return true;
    }

    // Board members can approve workflows
    if (user.role === 'board_member' && module === 'workflows' && permission === 'approve') {
      return true;
    }

    // Managers can approve most things
    if (user.role === 'manager' && permission === 'approve') {
      return true;
    }

    // Staff have limited permissions
    if (user.role === 'staff') {
      if (permission === 'view' || permission === 'create') {
        return true;
      }
      
      // Staff can edit and delete in certain modules
      if ((permission === 'edit' || permission === 'delete') && 
          ['documents', 'communications', 'events'].includes(module)) {
        return true;
      }
    }

    return false;
  },

  /**
   * Get all permissions for a user
   */
  getUserPermissions: (user: User): Record<string, Permission[]> => {
    const modules = ['workflows', 'communications', 'documents', 'residents', 'finances', 'events'];
    const permissions: Record<string, Permission[]> = {};

    // For demo purposes, return mock permissions based on role
    modules.forEach(module => {
      if (user.role === 'admin') {
        permissions[module] = ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'admin'];
      } else if (user.role === 'manager') {
        permissions[module] = ['view', 'create', 'edit', 'delete', 'approve'];
      } else if (user.role === 'staff') {
        permissions[module] = ['view', 'create'];
        
        if (['documents', 'communications', 'events'].includes(module)) {
          permissions[module].push('edit', 'delete');
        }
      } else if (user.role === 'board_member' && module === 'workflows') {
        permissions[module] = ['view', 'approve'];
      } else {
        permissions[module] = ['view'];
      }
    });

    return permissions;
  }
};
