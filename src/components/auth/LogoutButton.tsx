
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/use-logout';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'outline', 
  size = 'default',
  className
}) => {
  const { handleLogout } = useLogout();
  
  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleLogout(); // Directly call the logout function instead of navigating
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogoutClick}
      className={className}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
