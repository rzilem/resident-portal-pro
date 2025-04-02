
import React from 'react';
import { UserCircle, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuList, 
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle 
} from '@/components/ui/navigation-menu';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { useCompanySettings } from '@/hooks/use-company-settings';
import { useLogout } from '@/hooks/use-logout';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const MainNav = () => {
  const { settings } = useCompanySettings();
  const { handleLogout } = useLogout();
  const navigate = useNavigate();
  
  const goToProfile = () => {
    navigate('/profile/user');
  };
  
  return (
    <div className="flex items-center justify-between w-full">
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={navigationMenuTriggerStyle()}>
                  <UserCircle className="h-4 w-4 mr-1" />
                  My Account
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem onClick={goToProfile}>
                  <UserCircle className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipButton 
            variant="ghost" 
            size="sm" 
            className="md:hidden" 
            tooltipText="User Menu"
          >
            <UserCircle className="h-5 w-5" />
          </TooltipButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={goToProfile}>
            <UserCircle className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <HelpCircle className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default MainNav;
