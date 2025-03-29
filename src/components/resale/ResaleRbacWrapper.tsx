
import React, { ReactNode } from 'react';
import { useAuthRole } from '@/hooks/use-auth-role';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Permission } from '@/services/roleService';

interface ResaleRbacWrapperProps {
  children: ReactNode;
  requiredPermission: string;
  module?: string;
  fallback?: ReactNode;
}

const ResaleRbacWrapper = ({
  children,
  requiredPermission,
  module = 'resale',
  fallback
}: ResaleRbacWrapperProps) => {
  const { hasPermission, loading } = useAuthRole();
  
  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading...</div>;
  }
  
  // Split the permission if it contains a dot notation (e.g., "resale.certificate.view")
  const permissionParts = requiredPermission.split('.');
  const actualPermission = permissionParts.length > 1 
    ? permissionParts[permissionParts.length - 1] 
    : requiredPermission;
  
  // If the permission has module prefix (e.g., "resale.certificate.view"), 
  // use the module part from the permission
  const actualModule = permissionParts.length > 1 
    ? permissionParts.slice(0, permissionParts.length - 1).join('.') 
    : module;
  
  // Check if the actualPermission is a valid Permission type value
  // and cast it only if it matches one of the expected values
  const isValidPermission = (permission: string): permission is Permission => {
    return [
      'view', 'edit', 'create', 'delete', 'approve', 'admin', 
      'export', 'share', 'print', 'assign', 'manage', 'configure', 'invite', 'report'
    ].includes(permission);
  };
  
  // Use type assertion with validation
  const permissionValue = isValidPermission(actualPermission) 
    ? actualPermission 
    : 'view'; // Default to 'view' if the permission is not valid
  
  // Now use the validated permission value
  const authorized = hasPermission(actualModule, permissionValue);
  
  if (!authorized) {
    return fallback || (
      <Alert variant="destructive" className="my-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to {actualPermission} in the {actualModule} module.
        </AlertDescription>
      </Alert>
    );
  }
  
  return <>{children}</>;
};

export default ResaleRbacWrapper;
