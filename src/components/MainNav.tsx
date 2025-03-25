
import React from 'react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MainNav = () => {
  const location = useLocation();
  
  // Top level navigation items - these should be consistent across all dashboard pages
  const mainNavItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    {
      title: 'Properties',
      href: '/properties',
      active: location.pathname === '/properties',
    },
    {
      title: 'Residents',
      href: '/residents',
      active: location.pathname === '/residents',
    },
    {
      title: 'Calendar',
      href: '/calendar',
      active: location.pathname === '/calendar',
    },
    {
      title: 'Reports',
      href: '/reports',
      active: location.pathname === '/reports',
    },
  ];

  return (
    <NavigationMenu className="flex">
      <NavigationMenuList>
        {mainNavItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            <Link to={item.href} className="no-underline">
              <NavigationMenuLink 
                className={cn(
                  navigationMenuTriggerStyle(),
                  item.active ? "bg-accent text-accent-foreground" : ""
                )}
              >
                {item.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default MainNav;
