
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardHeaderWithNav from './DashboardHeaderWithNav';
import { Sidebar } from '@/components/Sidebar';
import HoaSidebar from '@/components/HoaSidebar';
import ChatbotButton from './ChatbotButton';
import { useLocation, Outlet, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  title?: string;
}

const DashboardLayout = ({ children, title: propTitle }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Check if we're in an HOA page to show appropriate sidebar
  const isHoaPage = location.pathname.startsWith('/hoa');
  
  // Check if we're coming from an HOA page to show back button
  const showHoaBackButton = location.state?.from?.startsWith('/hoa');
  const hoaPage = location.state?.from || '/hoa/dashboard';
  
  // Dynamically set title based on the current route
  const getPageTitle = () => {
    if (propTitle) return propTitle;
    
    const path = location.pathname;
    
    // HOA routes
    if (path === '/hoa/dashboard') return 'HOA Dashboard';
    if (path === '/hoa/finances') return 'HOA Finances';
    if (path === '/hoa/maintenance') return 'HOA Maintenance';
    if (path === '/hoa/members') return 'HOA Members';
    if (path === '/hoa/events') return 'HOA Events';
    
    // Accounting routes take precedence
    if (path === '/accounting/dashboard') return 'Accounting Dashboard';
    if (path === '/accounting/transactions') return 'Transactions';
    if (path === '/accounting/payments') return 'Payments';
    if (path === '/accounting/reports') return 'Financial Reports';
    
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
      {/* Render appropriate sidebar based on whether we're in an HOA page */}
      {isHoaPage ? (
        <div 
          className={`fixed md:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <HoaSidebar 
            collapsed={!sidebarOpen} 
            onCollapse={toggleSidebar} 
          />
        </div>
      ) : (
        <div 
          className={`fixed md:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <Sidebar className="min-h-screen"/>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Header - using the consistent DashboardHeaderWithNav component */}
        <DashboardHeaderWithNav 
          toggleSidebar={toggleSidebar} 
          title={getPageTitle()} 
        />
        
        {/* Back to HOA button if applicable */}
        {showHoaBackButton && !isHoaPage && (
          <div className="mx-4 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              asChild
            >
              <Link to={hoaPage} state={{ from: location.pathname }}>
                <ArrowLeft className="h-4 w-4" />
                Back to HOA Dashboard
              </Link>
            </Button>
          </div>
        )}
        
        {/* Main Content - use Outlet for nested routes or fallback to children */}
        <main className="flex-1 animate-fade-in">
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
