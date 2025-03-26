import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, UserRole } from '@/types/user';
import { userService } from '@/services/userService';
import { emailService } from '@/services/emailService';
import { AlertCircle } from 'lucide-react';

interface UserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingUser: User | null;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

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
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role as UserRole,
        firstName: editingUser.firstName || '',
        lastName: editingUser.lastName || '',
      });
      setEmailError('');
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'resident' as UserRole,
        firstName: '',
        lastName: '',
      });
      setEmailError('');
    }
  }, [editingUser, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email') {
      setEmailError('');
    }
    
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

  const validateEmail = () => {
    if (!editingUser) {
      const existingUser = userService.getUserByEmail(formData.email);
      if (existingUser) {
        setEmailError('A user with this email already exists');
        return false;
      }
    }
    return true;
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
      
      if (!validateEmail()) {
        setIsSubmitting(false);
        return;
      }
      
      if (editingUser) {
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
        const newUser = userService.createUser({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        
        setUsers([...users, newUser]);
        
        await emailService.sendWelcomeEmail(
          newUser.email,
          newUser.firstName || newUser.name,
          getRoleLabel(newUser.role)
        );
        
        const adminUser = users.find(user => user.role === 'admin');
        if (adminUser) {
          await emailService.sendNewUserNotification(
            adminUser.email,
            newUser.name,
            newUser.email,
            getRoleLabel(newUser.role)
          );
        }
        
        toast.success("User invited successfully and welcome email sent");
      }
      
      setOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(editingUser ? "Failed to update user" : "Failed to invite user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleLabel = (roleValue: string): string => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue.charAt(0).toUpperCase() + roleValue.slice(1).replace('_', ' ');
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
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {emailError}
                </div>
              )}
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
