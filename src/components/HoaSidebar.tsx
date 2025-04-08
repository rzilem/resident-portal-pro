
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
import { useCompanySettings } from '@/hooks/use-company-settings';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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
  const { settings } = useCompanySettings();
  
  const navItems = [
    { name: 'Dashboard', path: '/hoa/dashboard', icon: <Home size={20} /> },
    { name: 'Finances', path: '/hoa/finances', icon: <CreditCard size={20} /> },
    { name: 'Maintenance', path: '/hoa/maintenance', icon: <Wrench size={20} /> },
    { name: 'Members', path: '/hoa/members', icon: <Users size={20} /> },
    { name: 'Events', path: '/hoa/events', icon: <Calendar size={20} /> },
  ];
  
  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-30",
        collapsed ? "w-20" : "w-[260px]",
        className
      )} 
      {...props}
    >
      <div className="h-full flex flex-col">
        <div className="p-3 flex items-center justify-between border-b transition-all">
          {!collapsed ? (
            settings.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.companyName || "Company Logo"} 
                className="h-8 w-auto object-contain transition-all duration-200 hover:scale-105" 
              />
            ) : (
              <img 
                src="/lovable-uploads/75230129-3746-4768-9d0c-a4c8ebdb352e.png" 
                alt="CI Logo" 
                className="h-8 w-auto object-contain transition-all duration-200 hover:scale-105" 
              />
            )
          ) : null}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCollapse}
            className="ml-auto transition-all duration-200 hover:scale-110 hover:bg-accent"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        
        {/* Back to main app - prominent placement */}
        <div className="p-2 border-b border-gray-100">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 
              transition-all duration-200 hover:scale-[1.02] group"
            asChild
          >
            <Link to="/dashboard" state={{ from: location.pathname }}>
              <ArrowLeft size={16} className="transition-transform duration-200 group-hover:translate-x-[-2px]" />
              {!collapsed && <span>Back to Main App</span>}
            </Link>
          </Button>
        </div>
        
        <nav className="flex-1 p-3">
          <div className="mb-1">
            <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 border-blue-200 animate-fade-in">
              {collapsed ? "HOA" : "HOA Navigation"}
            </Badge>
          </div>
          
          <ul className="space-y-2">
            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.name} className={`animate-fade-in animate-delay-${(idx + 1) * 100}`}>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start text-left transition-all duration-200",
                          isActive ? 
                            "bg-blue-600 text-white hover:bg-blue-700" : 
                            "text-gray-700 hover:bg-gray-100",
                          "hover:scale-[1.02] hover:shadow-sm"
                        )}
                        onClick={() => navigate(item.path)}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {!collapsed && <span>{item.name}</span>}
                      </Button>
                    </HoverCardTrigger>
                    {collapsed && (
                      <HoverCardContent side="right" className="w-40">
                        <p className="text-sm font-medium">{item.name}</p>
                      </HoverCardContent>
                    )}
                  </HoverCard>
                </li>
              );
            })}
          </ul>
          
          {/* Main app quick links */}
          <div className="my-3 border-t border-gray-200 pt-3">
            <h3 className={cn("text-xs uppercase text-gray-500 font-semibold mb-2 animate-fade-in", collapsed && "sr-only")}>
              Main App Links
            </h3>
            <ul className="space-y-2">
              <li className="animate-fade-in animate-delay-300">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left text-gray-700 hover:bg-gray-100 
                        transition-all duration-200 hover:scale-[1.02]"
                      asChild
                    >
                      <Link to="/dashboard" state={{ from: location.pathname }}>
                        <span className="mr-3"><LayoutDashboard size={20} /></span>
                        {!collapsed && <span>Main Dashboard</span>}
                      </Link>
                    </Button>
                  </HoverCardTrigger>
                  {collapsed && (
                    <HoverCardContent side="right" className="w-40">
                      <p className="text-sm font-medium">Main Dashboard</p>
                    </HoverCardContent>
                  )}
                </HoverCard>
              </li>
              <li className="animate-fade-in animate-delay-400">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left text-gray-700 hover:bg-gray-100 
                        transition-all duration-200 hover:scale-[1.02]"
                      asChild
                    >
                      <Link to="/properties" state={{ from: location.pathname }}>
                        <span className="mr-3"><Building size={20} /></span>
                        {!collapsed && <span>Properties</span>}
                      </Link>
                    </Button>
                  </HoverCardTrigger>
                  {collapsed && (
                    <HoverCardContent side="right" className="w-40">
                      <p className="text-sm font-medium">Properties</p>
                    </HoverCardContent>
                  )}
                </HoverCard>
              </li>
              <li className="animate-fade-in animate-delay-500">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left text-gray-700 hover:bg-gray-100 
                        transition-all duration-200 hover:scale-[1.02]"
                      asChild
                    >
                      <Link to="/residents" state={{ from: location.pathname }}>
                        <span className="mr-3"><Users size={20} /></span>
                        {!collapsed && <span>Residents</span>}
                      </Link>
                    </Button>
                  </HoverCardTrigger>
                  {collapsed && (
                    <HoverCardContent side="right" className="w-40">
                      <p className="text-sm font-medium">Residents</p>
                    </HoverCardContent>
                  )}
                </HoverCard>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="p-3 border-t">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-left transition-all duration-200 hover:scale-[1.02]"
                onClick={() => navigate('/settings')}
              >
                <span className="mr-3"><Settings size={20} /></span>
                {!collapsed && <span>Settings</span>}
              </Button>
            </HoverCardTrigger>
            {collapsed && (
              <HoverCardContent side="right" className="w-40">
                <p className="text-sm font-medium">Settings</p>
              </HoverCardContent>
            )}
          </HoverCard>
        </div>
      </div>
    </aside>
  );
};

export default HoaSidebar;
