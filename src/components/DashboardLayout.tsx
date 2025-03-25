
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardHeaderWithNav from './DashboardHeaderWithNav';
import { Sidebar } from '@/components/Sidebar';
import ChatbotButton from './ChatbotButton';
import { useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout = ({ children, title: propTitle }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Dynamically set title based on the current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (propTitle) return propTitle;
    
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/properties') return 'Properties';
    if (path === '/residents') return 'Residents';
    if (path === '/calendar') return 'Calendar';
    if (path === '/settings/calendar') return 'Calendar Settings';
    if (path === '/settings') return 'Settings';
    if (path === '/workflows') return 'Workflows';
    if (path === '/chatbot') return 'Community Hub';
    if (path === '/reports') return 'Reports';
    
    if (path.startsWith('/accounting')) {
      if (path === '/accounting') return 'Accounting Dashboard';
      if (path === '/accounting/transactions') return 'Transactions';
      if (path === '/accounting/reports') return 'Financial Reports';
      if (path === '/accounting/payments') return 'Payments';
      return 'Accounting';
    }
    
    if (path.startsWith('/communications')) {
      if (path === '/communications/announcements') return 'Announcements';
      if (path === '/communications/messaging') return 'Messaging';
      if (path === '/communications/email-templates') return 'Email Templates';
      return 'Communications';
    }
    
    if (path.startsWith('/database')) {
      if (path === '/database/records') return 'Association Records';
      if (path === '/database/templates') return 'Document Templates';
      return 'Records';
    }
    
    return 'HOA Management';
  };
  
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
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar - improved animations */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar className="min-h-screen"/>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Header */}
        <DashboardHeaderWithNav 
          toggleSidebar={toggleSidebar} 
          title={getPageTitle()} 
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
