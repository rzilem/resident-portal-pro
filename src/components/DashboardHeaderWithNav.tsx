
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, Menu, User, Settings, HelpCircle } from 'lucide-react';
import MainNav from './MainNav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipButton } from '@/components/ui/tooltip-button';
import { useCompanySettings } from '@/hooks/use-company-settings';

interface DashboardHeaderWithNavProps {
  toggleSidebar?: () => void;
  title?: string;
  icon?: React.ReactNode;
}

const DashboardHeaderWithNav = ({ 
  toggleSidebar, 
  title,
  icon
}: DashboardHeaderWithNavProps) => {
  const location = useLocation();
  const { settings } = useCompanySettings();
  
  const getPageTitle = () => {
    if (title) return title;
    
    const path = location.pathname;
    
    if (path === '/hoa/dashboard') return 'HOA Dashboard';
    if (path === '/hoa/finances') return 'HOA Finances';
    if (path === '/hoa/maintenance') return 'HOA Maintenance';
    if (path === '/hoa/members') return 'HOA Members';
    if (path === '/hoa/events') return 'HOA Events';
    
    if (path === '/accounting/dashboard') return 'Accounting Dashboard';
    if (path === '/accounting/transactions') return 'Transactions';
    if (path === '/accounting/payments') return 'Payments';
    if (path === '/accounting/reports') return 'Financial Reports';
    if (path === '/accounting/invoice-queue') return 'Invoice Queue';
    if (path === '/accounting/journal-entries') return 'Journal Entries';
    if (path === '/accounting/gl-accounts') return 'General Ledger Accounts';
    
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/properties') return 'Properties';
    if (path === '/residents') return 'Residents';
    if (path === '/calendar') return 'Calendar';
    if (path === '/reports') return 'Reports';
    if (path === '/integrations') return 'Integrations';
    if (path === '/workflows') return 'Workflows';
    if (path === '/community-hub') return 'Community Hub';
    if (path === '/vendors') return 'Vendors';
    if (path === '/print-queue') return 'Print Queue';
    if (path === '/database/records') return 'Database Records';
    if (path === '/system-uploads') return 'System Uploads';
    
    if (path === '/communications/messaging') return 'Community Messaging';
    if (path === '/communications/announcements') return 'Announcements';
    
    if (path === '/documents/association') return 'Association Documents';
    
    if (path === '/resale') return 'Resale Management';
    if (path === '/resale/certificate') return 'Resale Certificate';
    if (path === '/resale/questionnaire') return 'Condo Questionnaire';
    if (path === '/resale/inspection') return 'Property Inspection';
    if (path === '/resale/statements') return 'Account Statements';
    if (path === '/resale/trec-forms') return 'TREC Forms';
    if (path === '/resale/wizard') return 'Resale Wizard';
    if (path === '/resale/bid-request') return 'Bid Request';
    if (path === '/resale/bid-requests') return 'Bid Requests';
    if (path.match(/^\/resale\/bid-requests\/\d+$/)) return 'Bid Request Details';
    if (path === '/resale/admin/project-images') return 'Project Images';
    
    if (path === '/settings') return 'Settings';
    if (path === '/settings/associations') return 'Association Settings';
    if (path === '/settings/permissions') return 'User Permissions';
    if (path === '/settings/calendar') return 'Calendar Settings';
    if (path === '/email-workflows') return 'Email Workflows';
    
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      return lastSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return 'Dashboard';
  };

  return (
    <header className="h-16 border-b border-border bg-card sticky top-0 z-10 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="inline-flex md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <div>
            <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
          </div>
        </div>
      </div>
      
      <div className="flex-1 mx-4 justify-center hidden md:flex">
        <MainNav />
      </div>
      
      <div className="flex items-center space-x-2">
        <TooltipButton 
          variant="ghost" 
          size="icon" 
          tooltipText="Help Center"
        >
          <HelpCircle className="h-5 w-5" />
        </TooltipButton>
        
        <TooltipButton 
          variant="ghost" 
          size="icon" 
          tooltipText="Notifications"
        >
          <Bell className="h-5 w-5" />
        </TooltipButton>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TooltipButton 
              variant="ghost" 
              size="icon" 
              tooltipText="User Menu"
            >
              <User className="h-5 w-5" />
            </TooltipButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
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
