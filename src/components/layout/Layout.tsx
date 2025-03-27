
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useUser } from '@/contexts/UserContext';
import { Sidebar } from '@/components/Sidebar';

const Layout = () => {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
