
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { Plus, RefreshCw } from 'lucide-react';
import UserManagementTable from './components/UserManagementTable';
import AddUserDialog from './dialogs/AddUserDialog';
import EditUserDialog from './dialogs/EditUserDialog';
import { userService } from '@/services/userService';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface UserManagementProps {
  users: User[];
  setUsers: (users: User[]) => void;
}

const UserManagement = ({ users, setUsers }: UserManagementProps) => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = () => {
    setIsAddUserOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleRefreshUsers = async () => {
    setIsLoading(true);
    try {
      const refreshedUsers = await userService.getUsers();
      if (refreshedUsers && refreshedUsers.length > 0) {
        setUsers(refreshedUsers.filter(user => user.role !== 'resident'));
      }
    } catch (error) {
      console.error('Failed to refresh users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Users</CardTitle>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshUsers}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh user list</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" onClick={handleAddUser}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a new user</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <UserManagementTable 
              users={users} 
              onEdit={handleEditUser} 
            />
          </CardContent>
        </Card>

        <AddUserDialog 
          open={isAddUserOpen} 
          onOpenChange={setIsAddUserOpen} 
          onUserAdded={(user) => {
            setUsers([...users, user]);
          }} 
        />

        {selectedUser && (
          <EditUserDialog 
            user={selectedUser}
            open={isEditUserOpen} 
            onOpenChange={setIsEditUserOpen} 
            onUserUpdated={(updatedUser) => {
              setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            }} 
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default UserManagement;
