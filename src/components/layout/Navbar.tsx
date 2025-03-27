
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  User, 
  Menu, 
  X, 
  LogOut,
  CreditCard,
  FileText,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/theme/mode-toggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user?.profile) return 'U';
    const { first_name, last_name } = user.profile;
    return `${first_name?.[0] || ''}${last_name?.[0] || ''}` || 'U';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">HOA Manager</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium hover:underline">
            Dashboard
          </Link>
          
          {/* Financial Management Links */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Financial Menu</span>
                <DollarSign className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Financial Management</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/financial/transactions">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Transactions</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/financial/payments">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Payments</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/financial/finances">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Finances</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Compliance Link */}
          <Link to="/compliance" className="text-sm font-medium hover:underline flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>Compliance</span>
          </Link>
          
          <Link to="/settings" className="text-sm font-medium hover:underline">
            Settings
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.profile?.profile_image_url || ''}
                      alt={user?.profile?.first_name || 'User'}
                    />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.profile?.first_name} {user?.profile?.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.profile?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
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
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="flex flex-col space-y-3 p-4">
            <Link
              to="/dashboard"
              className="flex items-center text-sm font-medium hover:underline"
              onClick={toggleMenu}
            >
              <Home size={16} className="mr-2" />
              Dashboard
            </Link>
            <Link
              to="/financial/transactions"
              className="flex items-center text-sm font-medium hover:underline"
              onClick={toggleMenu}
            >
              <CreditCard size={16} className="mr-2" />
              Transactions
            </Link>
            <Link
              to="/financial/payments"
              className="flex items-center text-sm font-medium hover:underline"
              onClick={toggleMenu}
            >
              <FileText size={16} className="mr-2" />
              Payments
            </Link>
            <Link
              to="/compliance"
              className="flex items-center text-sm font-medium hover:underline"
              onClick={toggleMenu}
            >
              <AlertTriangle size={16} className="mr-2" />
              Compliance
            </Link>
            <Link
              to="/settings"
              className="flex items-center text-sm font-medium hover:underline"
              onClick={toggleMenu}
            >
              <Settings size={16} className="mr-2" />
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
