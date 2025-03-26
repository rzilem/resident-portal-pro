
import React, { ReactNode } from 'react';
import { useAuthRole } from '@/hooks/use-auth-role';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

// Define the Permission type to match the one in roleService.ts
// Update to include specific permission strings used in ResaleDashboard.tsx
type Permission = 'view' | 'edit' | 'create' | 'delete' | 'approve' | 'admin' | string;

interface ResaleRbacWrapperProps {
  children: ReactNode;
  requiredPermission: Permission;
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
  
  // Fix the type issue by casting the permission string to the Permission type
  // Since we've defined Permission to include string, this should work properly
  const authorized = hasPermission(actualModule, actualPermission as Permission);
  
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
