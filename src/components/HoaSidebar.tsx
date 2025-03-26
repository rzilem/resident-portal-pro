
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  CreditCard, 
  Home, 
  Menu, 
  Settings, 
  Wrench, 
  Users, 
  Calendar, 
  ChevronLeft,
  LayoutDashboard,
  Building,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  onCollapse?: () => void;
}

export const HoaSidebar = ({ 
  className, 
  collapsed = false, 
  onCollapse,
  ...props 
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/hoa/dashboard', icon: <Home size={20} /> },
    { name: 'Finances', path: '/hoa/finances', icon: <CreditCard size={20} /> },
    { name: 'Maintenance', path: '/hoa/maintenance', icon: <Wrench size={20} /> },
    { name: 'Members', path: '/hoa/members', icon: <Users size={20} /> },
    { name: 'Events', path: '/hoa/events', icon: <Calendar size={20} /> },
  ];
  
  // Show a more visible back button at the top of the sidebar
  const showBackButton = true;

  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-30",
        collapsed ? "w-20" : "w-64",
        className
      )} 
      {...props}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 flex items-center justify-between border-b">
          {!collapsed && <h2 className="text-xl font-bold text-blue-600">HOA Manager</h2>}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCollapse}
            className="ml-auto"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        
        {/* Back to main app - prominent placement */}
        {showBackButton && (
          <div className="p-3 border-b border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              asChild
            >
              <Link to="/dashboard" state={{ from: location.pathname }}>
                <ArrowLeft size={16} />
                {!collapsed && <span>Back to Main App</span>}
              </Link>
            </Button>
          </div>
        )}
        
        <nav className="flex-1 p-4">
          <div className="mb-1">
            <Badge variant="outline" className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
              {collapsed ? "HOA" : "HOA Navigation"}
            </Badge>
          </div>
          
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.name}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left",
                      isActive ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {!collapsed && <span>{item.name}</span>}
                  </Button>
                </li>
              );
            })}
          </ul>
          
          {/* Main app quick links */}
          <div className="my-4 border-t border-gray-200 pt-4">
            <h3 className={cn("text-xs uppercase text-gray-500 font-semibold mb-2", collapsed && "sr-only")}>
              Main App Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left text-gray-700 hover:bg-gray-100"
                  asChild
                >
                  <Link to="/dashboard" state={{ from: location.pathname }}>
                    <span className="mr-3"><LayoutDashboard size={20} /></span>
                    {!collapsed && <span>Main Dashboard</span>}
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left text-gray-700 hover:bg-gray-100"
                  asChild
                >
                  <Link to="/properties" state={{ from: location.pathname }}>
                    <span className="mr-3"><Building size={20} /></span>
                    {!collapsed && <span>Properties</span>}
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left text-gray-700 hover:bg-gray-100"
                  asChild
                >
                  <Link to="/residents" state={{ from: location.pathname }}>
                    <span className="mr-3"><Users size={20} /></span>
                    {!collapsed && <span>Residents</span>}
                  </Link>
                </Button>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => navigate('/settings')}
          >
            <span className="mr-3"><Settings size={20} /></span>
            {!collapsed && <span>Settings</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default HoaSidebar;
