
import { useUser } from '@/contexts/UserContext';

export type Permission = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'admin';

export type Module = 
  | 'properties' 
  | 'accounting' 
  | 'communications' 
  | 'calendar' 
  | 'documents' 
  | 'reports' 
  | 'settings' 
  | 'residents' 
  | 'maintenance'
  | 'violations';

export const useRoleBasedAccess = () => {
  const { profile, checkPermission } = useUser();

  const hasPermission = (module: Module, permission: Permission): boolean => {
    return checkPermission(module, permission);
  };

  // Check if user can perform any action on a module
  const canAccessModule = (module: Module): boolean => {
    return (
      hasPermission(module, 'view') ||
      hasPermission(module, 'create') ||
      hasPermission(module, 'edit') ||
      hasPermission(module, 'delete') ||
      hasPermission(module, 'approve') ||
      hasPermission(module, 'admin')
    );
  };

  // Higher-level permission checks
  const canView = (module: Module): boolean => hasPermission(module, 'view');
  const canCreate = (module: Module): boolean => hasPermission(module, 'create');
  const canEdit = (module: Module): boolean => hasPermission(module, 'edit');
  const canDelete = (module: Module): boolean => hasPermission(module, 'delete');
  const canApprove = (module: Module): boolean => hasPermission(module, 'approve');
  const isModuleAdmin = (module: Module): boolean => hasPermission(module, 'admin');

  // Higher-level role checks from the User context
  const { isAdmin, isManager, isBoardMember, isResident } = useUser();

  return {
    hasPermission,
    canAccessModule,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canApprove,
    isModuleAdmin,
    isAdmin,
    isManager,
    isBoardMember,
    isResident,
    userRole: profile?.role
  };
};
