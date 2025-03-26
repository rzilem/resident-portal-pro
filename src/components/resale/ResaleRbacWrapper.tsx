
import React, { ReactNode } from 'react';
import { useAuthRole } from '@/hooks/use-auth-role';
import { Permission } from '@/services/roleService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

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
  
  const authorized = hasPermission(module, requiredPermission);
  
  if (!authorized) {
    return fallback || (
      <Alert variant="destructive" className="my-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to {requiredPermission} in the {module} module.
        </AlertDescription>
      </Alert>
    );
  }
  
  return <>{children}</>;
};

export default ResaleRbacWrapper;
