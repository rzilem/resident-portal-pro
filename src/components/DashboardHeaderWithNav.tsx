
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, Menu, User } from 'lucide-react';
import MainNav from './MainNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardHeaderWithNavProps {
  toggleSidebar?: () => void;
  title?: string;
}

const DashboardHeaderWithNav = ({ toggleSidebar, title = "Dashboard" }: DashboardHeaderWithNavProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="h-16 border-b border-border bg-card sticky top-0 z-10 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <Link to="/" className="text-xl font-bold text-gradient mr-6 hidden md:block">
          ResidentPro
        </Link>
        
        <h1 className="text-xl font-semibold md:hidden">{title}</h1>
        
        <MainNav />
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeaderWithNav;
