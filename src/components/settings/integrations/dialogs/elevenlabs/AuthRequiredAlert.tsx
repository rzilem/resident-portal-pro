
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AuthRequiredAlertProps {
  isAuthenticated: boolean;
}

const AuthRequiredAlert: React.FC<AuthRequiredAlertProps> = ({ isAuthenticated }) => {
  if (isAuthenticated) return null;

  return (
    <Alert variant="default" className="mb-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="text-yellow-600 dark:text-yellow-400">
        You need to be logged in to save settings permanently. Settings will be saved in local storage for now.
      </AlertDescription>
    </Alert>
  );
};

export default AuthRequiredAlert;
