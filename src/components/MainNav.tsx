
import React from 'react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const MainNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Don't render on mobile
  if (isMobile) {
    return null;
  }
  
  // Simplified top nav that focuses on main sections only
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
  ];

  return (
    <NavigationMenu className="hidden md:flex">
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
};

export default MainNav;
