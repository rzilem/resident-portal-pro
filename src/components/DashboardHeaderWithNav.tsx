
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, Menu, User, Settings, HelpCircle } from 'lucide-react';
import MainNav from './MainNav';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderWithNavProps {
  toggleSidebar?: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const DashboardHeaderWithNav = ({ 
  toggleSidebar, 
  title = "Dashboard",
  description,
  icon
}: DashboardHeaderWithNavProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="h-16 border-b border-border bg-card sticky top-0 z-10 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:inline-flex"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        
        <MainNav />
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" aria-label="Help">
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="User menu">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeaderWithNav;
