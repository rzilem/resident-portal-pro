
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UserManagement from './permissions/UserManagement';
import DocumentAccess from './permissions/DocumentAccess';
import DocumentSecuritySettings from './permissions/DocumentSecuritySettings';
import { roles } from './permissions/roles';
import { userService } from '@/services/userService';
import { User } from '@/types/user';

const PermissionSettings = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await userService.getUsers();
        
        // Deduplicate users by email (keep most recent)
        const emailMap = new Map<string, User>();
        fetchedUsers.forEach(user => {
          const email = user.email.toLowerCase();
          const existingUser = emailMap.get(email);
          
          if (!existingUser || 
              (user.createdAt && existingUser.createdAt && 
               new Date(user.createdAt) > new Date(existingUser.createdAt))) {
            emailMap.set(email, user);
          }
        });
        
        setUsers(Array.from(emailMap.values()));
      } catch (error) {
        console.error("Failed to load users:", error);
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  const [documentPermissions, setDocumentPermissions] = useState({
    financialReports: {
      owner: true, admin: true, manager: true, board: true, resident: false, vendor: false
    },
    bylaws: {
      owner: true, admin: true, manager: true, board: true, resident: true, vendor: false
    },
    boardMinutes: {
      owner: true, admin: true, manager: true, board: true, resident: true, vendor: false
    },
    vendorContracts: {
      owner: true, admin: true, manager: true, board: false, resident: false, vendor: true
    }
  });

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
          <DocumentAccess 
            documentPermissions={documentPermissions}
            setDocumentPermissions={setDocumentPermissions}
            roles={roles}
          />
        </TabsContent>
        
        <TabsContent value="document-security">
          <DocumentSecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermissionSettings;
