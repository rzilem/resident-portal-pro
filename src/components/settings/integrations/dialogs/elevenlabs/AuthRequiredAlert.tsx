
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AuthRequiredAlertProps {
  isAuthenticated: boolean;
}

const AuthRequiredAlert: React.FC<AuthRequiredAlertProps> = ({ isAuthenticated }) => {
  if (isAuthenticated) return null;
  
  return (
    <div className="flex items-start p-4 mb-4 rounded-md border border-red-200 bg-red-50 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
      <div>
        <p className="font-medium">Authentication Required</p>
        <p className="mt-1">
          You need to be logged in to save integration settings. Please log in and try again.
        </p>
      </div>
    </div>
  );
};

export default AuthRequiredAlert;
