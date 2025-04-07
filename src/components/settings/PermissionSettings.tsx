import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UserManagement from './permissions/UserManagement';
import DocumentAccess from './permissions/DocumentAccess';
import DocumentSecuritySettings from './permissions/DocumentSecuritySettings';
import { userService } from '@/services/userService';
import { User } from '@/types/user';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const PermissionSettings = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { checkAuthentication } = useAuth();
  
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      // Ensure the user is authenticated before fetching users
      const isAuthenticated = await checkAuthentication();
      
      if (!isAuthenticated) {
        toast.error("Authentication required to load users");
        setIsLoading(false);
        return;
      }
      
      console.log("Fetching users from userService...");
      const fetchedUsers = await userService.getUsers();
      
      console.log("User data received:", fetchedUsers);
      
      if (!fetchedUsers || fetchedUsers.length === 0) {
        toast.warning("No users found. Using mock data.");
        // Add at least one admin user to show something
        setUsers([{
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          status: 'active',
          securityLevel: 'full_access',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]);
        setIsLoading(false);
        return;
      }
      
      // Filter out resident users - only show admin and staff type users
      const filteredUsers = fetchedUsers.filter(user => 
        user.role !== 'resident'
      );
      
      console.log("Non-resident users:", filteredUsers);
      
      // Deduplicate users by email (keep most recent)
      const emailMap = new Map<string, User>();
      filteredUsers.forEach(user => {
        if (!user.email) return; // Skip users without email
        
        const email = user.email.toLowerCase();
        const existingUser = emailMap.get(email);
        
        if (!existingUser || 
            (user.createdAt && existingUser.createdAt && 
             new Date(user.createdAt) > new Date(existingUser.createdAt))) {
          emailMap.set(email, user);
        }
      });
      
      const uniqueUsers = Array.from(emailMap.values());
      console.log("Filtered unique users to display:", uniqueUsers);
      
      setUsers(uniqueUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users: " + (error as Error).message);
      // Set fallback users
      setUsers([{
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        status: 'active',
        securityLevel: 'full_access',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUsers();
    setIsRefreshing(false);
  };
  
  useEffect(() => {
    loadUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">User & Permission Settings</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Users'}
        </Button>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="document-access">Document Access</TabsTrigger>
          <TabsTrigger value="document-security">Document Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement users={users} setUsers={setUsers} />
        </TabsContent>
        
        <TabsContent value="document-access">
          <DocumentAccess />
        </TabsContent>
        
        <TabsContent value="document-security">
          <DocumentSecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermissionSettings;
