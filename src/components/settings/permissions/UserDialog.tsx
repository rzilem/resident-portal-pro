
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User as UserManagementUser } from './UserManagement';
import { UserRole } from '@/types/user';

interface UserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingUser: UserManagementUser | null;
  users: UserManagementUser[];
  setUsers: React.Dispatch<React.SetStateAction<UserManagementUser[]>>;
}

// Get the role options from the UserRole type
const roles: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Property Manager" },
  { value: "board", label: "Board Member" },
  { value: "committee", label: "Committee Member" },
  { value: "resident", label: "Resident" },
  { value: "guest", label: "Guest" }
];

const UserDialog = ({ open, setOpen, editingUser, users, setUsers }: UserDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'resident' as UserRole
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role as UserRole
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'resident' as UserRole
      });
    }
  }, [editingUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value: UserRole) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(u => 
        u.id === editingUser.id 
          ? { 
              ...u, 
              name: formData.name, 
              email: formData.email, 
              role: formData.role 
            } 
          : u
      );
      setUsers(updatedUsers);
      toast.success("User updated successfully");
    } else {
      // Add new user
      const newUser: UserManagementUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'pending'
      };
      setUsers([...users, newUser]);
      toast.success("User invited successfully");
    }
    
    setOpen(false);
  };

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
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingUser ? "Save Changes" : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
