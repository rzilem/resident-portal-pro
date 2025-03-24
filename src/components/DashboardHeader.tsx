
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Building, 
  Users, 
  CreditCard, 
  BarChart, 
  Bell, 
  Database,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const DashboardHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      title: 'Properties',
      href: '/properties',
      icon: Building,
    },
    {
      title: 'Residents',
      href: '/residents',
      icon: Users,
    },
    {
      title: 'Accounting',
      subItems: [
        { title: 'Transactions', href: '/accounting/transactions', icon: CreditCard },
        { title: 'Reports', href: '/accounting/reports', icon: BarChart },
      ],
    },
    {
      title: 'Communications',
      subItems: [
        { title: 'Announcements', href: '/communications/announcements', icon: Bell },
      ],
    },
    {
      title: 'Database',
      subItems: [
        { title: 'Records', href: '/database/records', icon: Database },
      ],
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">ResidentPro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((item) => (
                  item.subItems ? (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 w-[220px]">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={subItem.href}
                                  className={cn(
                                    "flex items-center gap-2 p-2 hover:bg-muted rounded-md",
                                    location.pathname === subItem.href && "bg-muted"
                                  )}
                                >
                                  <subItem.icon className="h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.title}>
                      <Link 
                        to={item.href}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-md", 
                          location.pathname === item.href && "bg-muted"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </NavigationMenuItem>
                  )
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="hidden md:flex"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={cn(
          "md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto transition-transform transform",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 space-y-4">
          {menuItems.map((item) => (
            <div key={item.title} className="space-y-2">
              {item.subItems ? (
                <>
                  <div className="font-medium text-sm text-gray-500 px-2">{item.title}</div>
                  <div className="pl-4 space-y-1 border-l-2 border-gray-100">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.href}
                        className={cn(
                          "flex items-center gap-2 p-2 hover:bg-muted rounded-md text-sm",
                          location.pathname === subItem.href && "bg-muted"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <subItem.icon className="h-4 w-4" />
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 p-2 hover:bg-muted rounded-md", 
                    location.pathname === item.href && "bg-muted"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
          
          <div className="pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
