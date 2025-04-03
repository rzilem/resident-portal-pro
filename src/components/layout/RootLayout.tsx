
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useStorageInitializer } from '@/hooks/use-storage-initializer';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  // Initialize storage on app load
  useStorageInitializer();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
