
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardHeaderWithNav from './DashboardHeaderWithNav';
import { Sidebar } from '@/components/Sidebar';
import ChatbotButton from './ChatbotButton';
import { useLocation, Outlet } from 'react-router-dom';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  title?: string;
}

const DashboardLayout = ({ children, title: propTitle }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Dynamically set title based on the current route
  const getPageTitle = () => {
    if (propTitle) return propTitle;
    
    const path = location.pathname;
    
    // Main sections
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/properties') return 'Properties';
    if (path === '/residents') return 'Residents';
    if (path === '/calendar') return 'Calendar';
    if (path === '/reports') return 'Reports';
    if (path === '/integrations') return 'Integrations';
    if (path === '/workflows') return 'Workflows';
    if (path === '/community-hub') return 'Community Hub';
    
    // Settings section
    if (path === '/settings') return 'Settings';
    if (path === '/settings/calendar') return 'Calendar Settings';
    if (path === '/settings/permissions') return 'User Permissions';
    
    // Accounting section
    if (path.startsWith('/accounting')) {
      if (path === '/accounting/dashboard') return 'Accounting Dashboard';
      if (path === '/accounting/transactions') return 'Transactions';
      if (path === '/accounting/reports') return 'Financial Reports';
      if (path === '/accounting/payments') return 'Payments';
      return 'Accounting';
    }
    
    // Communications section
    if (path.startsWith('/communications')) {
      if (path === '/communications/announcements') return 'Announcements';
      if (path === '/communications/messaging') return 'Community Messaging';
      return 'Communications';
    }
    
    // Database section
    if (path.startsWith('/database')) {
      if (path === '/database/records') return 'Association Records';
      if (path === '/database/templates') return 'Document Templates';
      return 'Records';
    }
    
    return 'HOA Management';
  };
  
  // Auto close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  // Initialize sidebar state based on screen size
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
      {/* Sidebar - with smooth transition */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar className="min-h-screen"/>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Header - using the consistent DashboardHeaderWithNav component */}
        <DashboardHeaderWithNav 
          toggleSidebar={toggleSidebar} 
          title={getPageTitle()} 
        />
        
        {/* Main Content - use Outlet for nested routes or fallback to children */}
        <main className="flex-1 animate-fade-in p-4">
          {children || <Outlet />}
        </main>
      </div>
      
      {/* Chatbot Button */}
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
