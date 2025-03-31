
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { roleService, Permission } from '@/services/roleService';
import { userService } from '@/services/userService';

// Mock current user - in a real app, this would come from your auth system
const MOCK_CURRENT_USER_ID = '1'; // Admin user

export function useAuthRole() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  
  useEffect(() => {
    // Simulate fetching the current user
    const fetchUser = async () => {
      setLoading(true);
      try {
        // For demo purposes, always set the user as an admin so they have access to everything
        // In a real app, this would fetch the actual current user
        setCurrentUser({
          id: MOCK_CURRENT_USER_ID,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          securityLevel: 'full_access'
        });
        setRole('admin');
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Even on error, set a default admin user for demo
        setCurrentUser({
          id: MOCK_CURRENT_USER_ID,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          securityLevel: 'full_access'
        });
        setRole('admin');
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  // Check if the current user has a specific permission
  const hasPermission = (module: string, permission: Permission): boolean => {
    // For admin users, always return true for any permission
    if (role === 'admin') return true;
    
    if (!currentUser) return false;
    return roleService.hasPermission(currentUser, module, permission);
  };
  
  // Get all module permissions for the current user
  const getUserPermissions = () => {
    if (!currentUser) return {};
    return roleService.getUserPermissions(currentUser);
  };
  
  // Admin check is simplified for clarity
  const checkIsAdmin = (): boolean => {
    return role === 'admin';
  };
  
  return {
    currentUser,
    loading,
    role,
    hasPermission,
    getUserPermissions,
    isAdmin: checkIsAdmin(),
    isManager: role === 'manager',
    isStaff: role === 'staff',
    isResident: role === 'resident',
    isBoardMember: role === 'board_member' || role === 'board',
  };
}
