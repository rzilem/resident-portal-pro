
import React from 'react';
import { Outlet } from 'react-router-dom';

export const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* App layout structure */}
      <main className="p-4">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AppLayout;
