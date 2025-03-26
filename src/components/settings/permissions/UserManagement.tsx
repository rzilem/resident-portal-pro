
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserManagementHeader from './components/UserManagementHeader';
import UserManagementTable from './components/UserManagementTable';
import UserDialog from './UserDialog';
import DeleteUserDialog from './components/DeleteUserDialog';
import { useUserManagement } from './hooks/useUserManagement';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

import { User } from '@/types/user';

const UserManagement = ({ users: initialUsers, setUsers: setParentUsers }: UserManagementProps) => {
  const {
    users,
    setUsers,
    dialogOpen,
    setDialogOpen,
    editingUser,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    openNewUserDialog,
    openEditDialog,
    toggleUserStatus,
    confirmDeleteUser,
    deleteUser
  } = useUserManagement();

  // Sync with parent state when our local state changes
  React.useEffect(() => {
    setParentUsers(users);
  }, [users, setParentUsers]);

  // Initialize with props
  React.useEffect(() => {
    if (initialUsers.length > 0 && users.length === 0) {
      setUsers(initialUsers);
    }
  }, [initialUsers, users.length, setUsers]);

  return (
    <Card>
      <CardHeader>
        <UserManagementHeader openNewUserDialog={openNewUserDialog} />
      </CardHeader>
      <CardContent>
        <UserManagementTable 
          users={users}
          toggleUserStatus={toggleUserStatus}
          openEditDialog={openEditDialog}
          confirmDeleteUser={confirmDeleteUser}
        />
      </CardContent>
      
      <UserDialog 
        open={dialogOpen} 
        setOpen={setDialogOpen}
        editingUser={editingUser}
        users={users}
        setUsers={setUsers}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={userToDelete}
        onDelete={deleteUser}
      />
    </Card>
  );
};

export default UserManagement;
