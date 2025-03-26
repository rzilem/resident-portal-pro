
import { useAuthRole } from '@/hooks/use-auth-role';
import { DocumentCategory, DocumentAccessLevel } from '@/types/documents';

export interface DocumentPermissionResult {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canDownload: boolean;
  canShare: boolean;
  accessLevel: DocumentAccessLevel;
}

export function useDocumentPermissions() {
  const { 
    role, 
    isAdmin,
    isManager,
    isBoardMember,
    isResident 
  } = useAuthRole();

  const checkCategoryAccess = (category: DocumentCategory): boolean => {
    if (!category.accessLevel || category.accessLevel === 'all') {
      return true;
    }

    switch(category.accessLevel) {
      case 'admin':
        return isAdmin;
      case 'management':
        return isAdmin || isManager;
      case 'board':
        return isAdmin || isManager || isBoardMember;
      case 'homeowner':
        return isAdmin || isManager || isBoardMember || isResident;
      default:
        return false;
    }
  };

  const getPermissionsForCategory = (category: DocumentCategory): DocumentPermissionResult => {
    const canAccess = checkCategoryAccess(category);
    const isManagement = isAdmin || isManager;
    
    return {
      canView: canAccess,
      canEdit: isManagement,
      canDelete: isAdmin,
      canDownload: canAccess,
      canShare: isManagement || isBoardMember,
      accessLevel: category.accessLevel || 'all'
    };
  };

  return {
    checkCategoryAccess,
    getPermissionsForCategory
  };
}
