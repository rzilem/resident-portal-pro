
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { 
  Building, 
  Users, 
  Home, 
  DollarSign, 
  FileSpreadsheet, 
  Bell, 
  Database
} from 'lucide-react';

export function MainNav() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    
    if (path !== '/dashboard' && location.pathname.startsWith(path)) {
      return true;
    }
    
    return false;
  };

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/dashboard">
            <NavigationMenuLink 
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive('/dashboard') && "bg-accent text-accent-foreground"
              )}
            >
              <Home className="w-4 h-4 mr-2" />
              <span>Dashboard</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/properties">
            <NavigationMenuLink 
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive('/properties') && "bg-accent text-accent-foreground"
              )}
            >
              <Building className="w-4 h-4 mr-2" />
              <span>Properties</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/residents">
            <NavigationMenuLink 
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive('/residents') && "bg-accent text-accent-foreground"
              )}
            >
              <Users className="w-4 h-4 mr-2" />
              <span>Residents</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className={isActive('/accounting') ? "bg-accent text-accent-foreground" : ""}>
            <DollarSign className="w-4 h-4 mr-2" />
            <span>Accounting</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[200px]">
              <li>
                <Link to="/accounting/transactions" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="text-sm font-medium leading-none">Transactions</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Manage all financial transactions
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/accounting/reports" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="text-sm font-medium leading-none">Reports</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Financial reporting and analysis
                  </p>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className={isActive('/communications') ? "bg-accent text-accent-foreground" : ""}>
            <Bell className="w-4 h-4 mr-2" />
            <span>Communications</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[200px]">
              <li>
                <Link to="/communications/announcements" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="text-sm font-medium leading-none">Announcements</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Community announcements and notices
                  </p>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className={isActive('/database') ? "bg-accent text-accent-foreground" : ""}>
            <Database className="w-4 h-4 mr-2" />
            <span>Database</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[200px]">
              <li>
                <Link to="/database/records" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="text-sm font-medium leading-none">Records</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Access community records
                  </p>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default MainNav;
