
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
    const fetchUser = () => {
      setLoading(true);
      try {
        const user = userService.getUserById(MOCK_CURRENT_USER_ID);
        setCurrentUser(user || null);
        if (user) {
          setRole(user.role);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  // Check if the current user has a specific permission
  const hasPermission = (module: string, permission: Permission): boolean => {
    if (!currentUser) return false;
    return roleService.hasPermission(currentUser, module, permission);
  };
  
  // Get all module permissions for the current user
  const getUserPermissions = () => {
    if (!currentUser) return {};
    return roleService.getUserPermissions(currentUser);
  };
  
  return {
    currentUser,
    loading,
    role,
    hasPermission,
    getUserPermissions,
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isStaff: role === 'staff',
    isResident: role === 'resident',
    isBoardMember: role === 'board_member' || role === 'board',
  };
}
