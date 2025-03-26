
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from '@/types/user';
import { useUserForm } from './hooks/useUserForm';
import { UserFormFields } from './components/UserFormFields';

interface UserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingUser: User | null;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserDialog = ({ open, setOpen, editingUser, users, setUsers }: UserDialogProps) => {
  const {
    formData,
    isSubmitting,
    emailError,
    handleInputChange,
    handleRoleChange,
    handleSubmit
  } = useUserForm({
    editingUser,
    users,
    setUsers,
    onSuccess: () => setOpen(false)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Edit User" : "Invite New User"}
          </DialogTitle>
          <DialogDescription>
            {editingUser 
              ? "Update user details and permissions" 
              : "Enter the details of the user you want to invite"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <UserFormFields
            formData={formData}
            emailError={emailError}
            handleInputChange={handleInputChange}
            handleRoleChange={handleRoleChange}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? "Saving..." 
                : editingUser 
                  ? "Save Changes" 
                  : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
