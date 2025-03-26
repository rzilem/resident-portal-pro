
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import UserManagement from './permissions/UserManagement';
import DocumentAccess from './permissions/DocumentAccess';
import { roles } from './permissions/roles';
import { userService } from '@/services/userService';
import { User } from '@/types/user';

const PermissionSettings = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUsers = () => {
      try {
        const fetchedUsers = userService.getUsers();
        setUsers(fetchedUsers);
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
      <UserManagement users={users} setUsers={setUsers} />
      <DocumentAccess 
        documentPermissions={documentPermissions}
        setDocumentPermissions={setDocumentPermissions}
        roles={roles}
      />
    </div>
  );
};

export default PermissionSettings;
