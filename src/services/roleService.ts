import { User, UserRole } from '@/types/user';

// Define permission levels for various features
export type Permission = 'view' | 'edit' | 'create' | 'delete' | 'approve' | 'admin' | 'export' | 'share' | 'print' | 'assign' | 'manage' | 'configure' | 'invite' | 'report';

// Define module permissions
export interface ModulePermissions {
  [key: string]: Permission[];
}

// Map roles to their permissions
const rolePermissionsMap: Record<UserRole, ModulePermissions> = {
  admin: {
    resale: ['view', 'edit', 'create', 'delete', 'approve', 'admin', 'export', 'share', 'print', 'manage', 'configure', 'report'],
    accounting: ['view', 'edit', 'create', 'delete', 'approve', 'admin', 'export', 'share', 'print', 'manage', 'configure', 'report'],
    properties: ['view', 'edit', 'create', 'delete', 'admin', 'export', 'share', 'print', 'manage', 'configure', 'report'],
    residents: ['view', 'edit', 'create', 'delete', 'admin', 'export', 'share', 'print', 'assign', 'invite', 'report'],
    calendar: ['view', 'edit', 'create', 'delete', 'admin', 'export', 'share', 'print'],
    documents: ['view', 'edit', 'create', 'delete', 'admin', 'export', 'share', 'print', 'configure'],
    communications: ['view', 'edit', 'create', 'delete', 'admin', 'export', 'share', 'print'],
    maintenance: ['view', 'edit', 'create', 'delete', 'approve', 'admin', 'assign', 'report'],
    compliance: ['view', 'edit', 'create', 'delete', 'approve', 'admin', 'export', 'report'],
    settings: ['view', 'edit', 'create', 'delete', 'admin', 'configure']
  },
  manager: {
    resale: ['view', 'edit', 'create', 'approve', 'export', 'share', 'print', 'report'],
    accounting: ['view', 'edit', 'create', 'export', 'print', 'report'],
    properties: ['view', 'edit', 'export', 'print', 'report'],
    residents: ['view', 'edit', 'create', 'export', 'print', 'assign', 'invite'],
    calendar: ['view', 'edit', 'create', 'export', 'share', 'print'],
    documents: ['view', 'edit', 'create', 'export', 'share', 'print'],
    communications: ['view', 'edit', 'create', 'export', 'share', 'print'],
    maintenance: ['view', 'edit', 'create', 'approve', 'export', 'assign', 'report'],
    compliance: ['view', 'edit', 'create', 'approve', 'export', 'report'],
    settings: ['view', 'edit']
  },
  staff: {
    resale: ['view', 'create', 'print'],
    accounting: ['view', 'print'],
    properties: ['view', 'print'],
    residents: ['view', 'print'],
    calendar: ['view', 'create', 'print'],
    documents: ['view', 'create', 'print'],
    communications: ['view', 'create'],
    maintenance: ['view', 'create', 'print'],
    compliance: ['view', 'create', 'report'],
    settings: []
  },
  resident: {
    resale: ['view'],
    accounting: [],
    properties: ['view'],
    residents: ['view'],
    calendar: ['view'],
    documents: ['view'],
    communications: ['view'],
    maintenance: ['view', 'create'],
    compliance: ['view'],
    settings: []
  },
  board_member: {
    resale: ['view', 'approve', 'print'],
    accounting: ['view', 'print'],
    properties: ['view', 'print'],
    residents: ['view', 'print'],
    calendar: ['view', 'create', 'edit', 'share'],
    documents: ['view', 'share', 'print'],
    communications: ['view', 'create', 'share'],
    maintenance: ['view', 'create', 'approve', 'print'],
    compliance: ['view', 'approve', 'print'],
    settings: ['view']
  },
  board: {
    resale: ['view', 'approve', 'print'],
    accounting: ['view', 'print'],
    properties: ['view', 'print'],
    residents: ['view', 'print'],
    calendar: ['view', 'create', 'edit', 'share'],
    documents: ['view', 'share', 'print'],
    communications: ['view', 'create', 'share'],
    maintenance: ['view', 'create', 'approve', 'print'],
    compliance: ['view', 'approve', 'print'],
    settings: ['view']
  },
  committee: {
    resale: ['view'],
    accounting: [],
    properties: ['view'],
    residents: ['view'],
    calendar: ['view', 'create'],
    documents: ['view', 'print'],
    communications: ['view', 'create'],
    maintenance: ['view', 'create'],
    compliance: ['view', 'create'],
    settings: []
  },
  guest: {
    resale: [],
    accounting: [],
    properties: [],
    residents: [],
    calendar: ['view'],
    documents: [],
    communications: [],
    maintenance: [],
    compliance: [],
    settings: []
  },
  invoice_approver: {
    resale: ['view'],
    accounting: ['view', 'approve', 'print', 'report'],
    properties: ['view'],
    residents: ['view'],
    calendar: ['view'],
    documents: ['view', 'print'],
    communications: ['view'],
    maintenance: ['view'],
    compliance: ['view'],
    settings: []
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
  
  // Get all permissions for a specific role
  getRolePermissions: (role: UserRole): ModulePermissions => {
    return rolePermissionsMap[role] || {};
  },
  
  // Get list of all available permissions
  getAllPermissionTypes: (): Permission[] => {
    return ['view', 'edit', 'create', 'delete', 'approve', 'admin', 'export', 'share', 'print', 'assign', 'manage', 'configure', 'invite', 'report'];
  },
  
  // Get all users with specific permission for a module
  getUsersWithPermission: (users: User[], module: string, permission: Permission): User[] => {
    return users.filter(user => roleService.hasPermission(user, module, permission));
  }
};
