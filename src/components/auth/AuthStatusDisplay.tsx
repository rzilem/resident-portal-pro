
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const AuthStatusDisplay = () => {
  const { isAuthenticated, user, profile } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <InfoIcon className="h-4 w-4 text-green-500" />
          <AlertDescription>
            Logged in as: {profile?.first_name} {profile?.last_name} ({user?.email})
            <br />
            <span className="text-xs text-muted-foreground">You should be redirected to dashboard soon...</span>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            Not currently logged in. Please sign in or create an account.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AuthStatusDisplay;
