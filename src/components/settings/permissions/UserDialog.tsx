
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, UserRole } from '@/types/user';
import { userService } from '@/services/userService';

interface UserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingUser: User | null;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

// Get the role options from the UserRole type
const roles: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Property Manager" },
  { value: "board_member", label: "Board Member" },
  { value: "board", label: "Board" },
  { value: "committee", label: "Committee Member" },
  { value: "staff", label: "Staff" },
  { value: "resident", label: "Resident" },
  { value: "guest", label: "Guest" }
];

const UserDialog = ({ open, setOpen, editingUser, users, setUsers }: UserDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'resident' as UserRole,
    firstName: '',
    lastName: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role as UserRole,
        firstName: editingUser.firstName || '',
        lastName: editingUser.lastName || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'resident' as UserRole,
        firstName: '',
        lastName: '',
      });
    }
  }, [editingUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update the full name when first or last name changes
    if (name === 'firstName' || name === 'lastName') {
      const fullName = name === 'firstName' 
        ? `${value} ${formData.lastName}`.trim()
        : `${formData.firstName} ${value}`.trim();
      
      if (fullName) {
        setFormData(prev => ({ ...prev, name: fullName }));
      }
    }
  };
  
  const handleRoleChange = (value: UserRole) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!formData.name || !formData.email || !formData.role) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      if (editingUser) {
        // Update existing user
        const updatedUser = userService.updateUser({
          ...editingUser,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        toast.success("User updated successfully");
      } else {
        // Add new user
        const newUser = userService.createUser({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        
        setUsers([...users, newUser]);
        toast.success("User invited successfully");
      }
      
      setOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(editingUser ? "Failed to update user" : "Failed to invite user");
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
