
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, UserRole, SecurityLevel } from '@/types/user';
import { userService } from '@/services/userService';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: User) => void;
}

const AddUserDialog = ({ open, onOpenChange, onUserAdded }: AddUserDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff' as UserRole,
    securityLevel: 'basic' as SecurityLevel
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (e.target.name === 'email') {
      setEmailError(null);
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as UserRole
    });
  };

  const handleSecurityLevelChange = (value: string) => {
    setFormData({
      ...formData,
      securityLevel: value as SecurityLevel
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newUser = await userService.createUser({
        ...formData,
        status: 'active',
      } as User);
      
      toast.success(`User ${formData.name} has been added successfully`);
      onUserAdded(newUser);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'staff' as UserRole,
        securityLevel: 'basic' as SecurityLevel
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account. They will receive an invitation email to set up their password.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name"
              name="name"
              placeholder="John Doe"
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
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              name="role" 
              value={formData.role} 
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="board">Board Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="securityLevel">Security Level</Label>
            <Select 
              name="securityLevel" 
              value={formData.securityLevel} 
              onValueChange={handleSecurityLevelChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select security level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_access">Full Access</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="view_only">View Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
