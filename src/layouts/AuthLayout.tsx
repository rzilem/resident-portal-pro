
import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default AuthLayout;
