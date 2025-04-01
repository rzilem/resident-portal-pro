
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  User, 
  Wrench, 
  AlertTriangle, 
  ClipboardCheck, 
  DollarSign, 
  CreditCard, 
  Receipt, 
  Truck, 
  MessageSquare, 
  Bell, 
  FileText, 
  Code,
  GitBranch,
  Folder, 
  BarChart2, 
  PieChart, 
  Calendar, 
  CalendarPlus, 
  Settings, 
  Building, 
  Lock,
  Mail
} from 'lucide-react';
import { useAuthRole } from '@/hooks/use-auth-role';

interface NavigationSectionProps {
  title: string;
  children: React.ReactNode;
}

const NavigationSection: React.FC<NavigationSectionProps> = ({ title, children }) => (
  <li>
    <span className="text-xs font-semibold text-muted-foreground">{title}</span>
    <ul className="ml-4 mt-2 space-y-1">{children}</ul>
  </li>
);

const iconSize = 18;

const NavigationMenu = () => {
  const { pathname } = useLocation();
  const { hasPermission } = useAuthRole();

  const linkClass = (isActive: boolean) =>
    `flex items-center text-sm font-medium py-2 px-4 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
      isActive ? 'bg-accent text-accent-foreground' : 'text-foreground'
    }`;

  // Helper function to check permissions with correct type
  const canAccess = (resource: string) => {
    try {
      return hasPermission(resource as any, 'read' as any);
    } catch (error) {
      // Fallback to true for development
      return true;
    }
  };

  return (
    <ul className="space-y-2 py-4">
      <li>
        <Link to="/" className={linkClass(pathname === '/')}>
          <Home size={iconSize} />
          <span className="ml-3">Dashboard</span>
        </Link>
      </li>
      
      {/* Account & Association Management */}
      {canAccess('associations') && (
        <NavigationSection title="Community Management">
          <li>
            <Link to="/associations" className={linkClass(pathname.includes('/associations'))}>
              <Building2 size={iconSize} />
              <span className="ml-3">Associations</span>
            </Link>
          </li>
          <li>
            <Link to="/board-members" className={linkClass(pathname.includes('/board-members'))}>
              <Users size={iconSize} />
              <span className="ml-3">Board Members</span>
            </Link>
          </li>
          <li>
            <Link to="/properties" className={linkClass(pathname.includes('/properties'))}>
              <Home size={iconSize} />
              <span className="ml-3">Properties</span>
            </Link>
          </li>
          <li>
            <Link to="/residents" className={linkClass(pathname.includes('/residents'))}>
              <User size={iconSize} />
              <span className="ml-3">Residents</span>
            </Link>
          </li>
        </NavigationSection>
      )}
      
      {/* Properties Management */}
      {canAccess('properties') && (
        <NavigationSection title="Property Management">
          <li>
            <Link to="/maintenance" className={linkClass(pathname.includes('/maintenance'))}>
              <Wrench size={iconSize} />
              <span className="ml-3">Maintenance</span>
            </Link>
          </li>
          <li>
            <Link to="/violations" className={linkClass(pathname.includes('/violations'))}>
              <AlertTriangle size={iconSize} />
              <span className="ml-3">Violations</span>
            </Link>
          </li>
          <li>
            <Link to="/inspections" className={linkClass(pathname.includes('/inspections'))}>
              <ClipboardCheck size={iconSize} />
              <span className="ml-3">Inspections</span>
            </Link>
          </li>
        </NavigationSection>
      )}
      
      {/* Accounting */}
      {canAccess('accounting') && (
        <NavigationSection title="Financial Management">
          <li>
            <Link to="/accounting" className={linkClass(pathname.includes('/accounting'))}>
              <DollarSign size={iconSize} />
              <span className="ml-3">Accounting</span>
            </Link>
          </li>
          <li>
            <Link to="/payments" className={linkClass(pathname.includes('/payments'))}>
              <CreditCard size={iconSize} />
              <span className="ml-3">Payments</span>
            </Link>
          </li>
          <li>
            <Link to="/invoices" className={linkClass(pathname.includes('/invoices'))}>
              <Receipt size={iconSize} />
              <span className="ml-3">Invoices</span>
            </Link>
          </li>
          <li>
            <Link to="/vendors" className={linkClass(pathname.includes('/vendors'))}>
              <Truck size={iconSize} />
              <span className="ml-3">Vendors</span>
            </Link>
          </li>
        </NavigationSection>
      )}
      
      {/* Communications */}
      {canAccess('communications') && (
        <NavigationSection title="Communications">
          <li>
            <Link to="/communications" className={linkClass(pathname === '/communications')}>
              <MessageSquare size={iconSize} />
              <span className="ml-3">Messaging</span>
            </Link>
          </li>
          <li>
            <Link to="/communications/announcements" className={linkClass(pathname.includes('/communications/announcements'))}>
              <Bell size={iconSize} />
              <span className="ml-3">Announcements</span>
            </Link>
          </li>
          <li>
            <Link to="/communications/templates" className={linkClass(pathname.includes('/communications/templates'))}>
              <FileText size={iconSize} />
              <span className="ml-3">Message Templates</span>
            </Link>
          </li>
          <li>
            <Link to="/communications/html-templates" className={linkClass(pathname.includes('/communications/html-templates'))}>
              <Code size={iconSize} />
              <span className="ml-3">HTML Templates</span>
            </Link>
          </li>
          <li>
            <Link to="/communications/workflows" className={linkClass(pathname.includes('/communications/workflows'))}>
              <GitBranch size={iconSize} />
              <span className="ml-3">Email Workflows</span>
            </Link>
          </li>
        </NavigationSection>
      )}
      
      {/* Documents */}
      {canAccess('documents') && (
        <NavigationSection title="Documents">
          <li>
            <Link to="/documents/association" className={linkClass(pathname.includes('/documents/association'))}>
              <Folder size={iconSize} />
              <span className="ml-3">Association Documents</span>
            </Link>
          </li>
          <li>
            <Link to="/documents/templates" className={linkClass(pathname.includes('/documents/templates'))}>
              <FileText size={iconSize} />
              <span className="ml-3">Document Templates</span>
            </Link>
          </li>
        </NavigationSection>
      )}
      
      {/* Reports & Analytics */}
      {canAccess('reports') && (
        <NavigationSection title="Reports & Analytics">
          <li>
            <Link to="/reports" className={linkClass(pathname.includes('/reports'))}>
              <BarChart2 size={iconSize} />
              <span className="ml-3">Reports</span>
            </Link>
          </li>
          <li>
            <Link to="/analytics" className={linkClass(pathname.includes('/analytics'))}>
              <PieChart size={iconSize} />
              <span className="ml-3">Analytics</span>
            </Link>
          </li>
        </NavigationSection>
      )}
      
      {/* Events & Calendar */}
      {canAccess('calendar') && (
        <NavigationSection title="Events & Calendar">
          <li>
            <Link to="/calendar" className={linkClass(pathname.includes('/calendar'))}>
              <Calendar size={iconSize} />
              <span className="ml-3">Calendar</span>
            </Link>
          </li>
          <li>
            <Link to="/events" className={linkClass(pathname.includes('/events'))}>
              <CalendarPlus size={iconSize} />
              <span className="ml-3">Events</span>
            </Link>
          </li>
        </NavigationSection>
      )}
      
      {/* Settings */}
      {canAccess('settings') && (
        <NavigationSection title="Settings">
          <li>
            <Link to="/settings" className={linkClass(pathname === '/settings')}>
              <Settings size={iconSize} />
              <span className="ml-3">System Settings</span>
            </Link>
          </li>
          <li>
            <Link to="/settings/associations" className={linkClass(pathname.includes('/settings/associations'))}>
              <Building size={iconSize} />
              <span className="ml-3">Association Settings</span>
            </Link>
          </li>
          <li>
            <Link to="/settings/permissions" className={linkClass(pathname.includes('/settings/permissions'))}>
              <Lock size={iconSize} />
              <span className="ml-3">Permissions</span>
            </Link>
          </li>
          <li>
            <Link to="/email-workflows" className={linkClass(pathname.includes('/email-workflows'))}>
              <Mail size={iconSize} />
              <span className="ml-3">Email Workflows</span>
            </Link>
          </li>
        </NavigationSection>
      )}
    </ul>
  );
};

export default NavigationMenu;
