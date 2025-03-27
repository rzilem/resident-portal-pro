
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';

const AuthStatusDisplay = () => {
  const { isAuthenticated, user } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="hidden text-xs text-muted-foreground mb-4 p-2 border border-dashed border-muted-foreground/30 rounded">
      <p>Auth Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
      {user && (
        <p>User: {user.email}</p>
      )}
    </div>
  );
};

export default AuthStatusDisplay;
