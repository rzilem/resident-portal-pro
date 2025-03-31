
import React from 'react';
import { UserCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuList, 
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle 
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCompanySettings } from '@/hooks/use-company-settings';
import { useLogout } from '@/hooks/use-logout';

const MainNav = () => {
  const { settings } = useCompanySettings();
  const { handleLogout } = useLogout();
  
  return (
    <div className="flex items-center justify-between w-full">
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>User Account</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[200px]">
                <li className="row-span-1">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/profile"
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
                    >
                      <UserCircle className="h-5 w-5 mb-2" />
                      <div className="mb-2 mt-2 text-base font-medium">
                        Profile
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li className="row-span-1">
                  <NavigationMenuLink asChild>
                    <button
                      onClick={handleLogout}
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
                    >
                      <div className="mb-2 mt-2 text-base font-medium">
                        Logout
                      </div>
                    </button>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/help">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <HelpCircle className="h-4 w-4 mr-1" />
                Help
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      {/* Mobile menu button */}
      <Button variant="ghost" size="sm" className="md:hidden">
        <UserCircle className="h-5 w-5" />
      </Button>
    </div>
  );
}

export default MainNav;
