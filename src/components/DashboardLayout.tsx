
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardHeaderWithNav from './DashboardHeaderWithNav';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import ChatbotButton from './ChatbotButton';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout = ({ children, title = "Dashboard" }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Automatically close sidebar on mobile and resize events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - improved animations */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Header */}
        <DashboardHeaderWithNav 
          toggleSidebar={toggleSidebar} 
          title={title} 
        />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
      
      {/* Chatbot Button - positioned better for mobile */}
      <div className="fixed bottom-4 right-4 z-40">
        <ChatbotButton />
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
