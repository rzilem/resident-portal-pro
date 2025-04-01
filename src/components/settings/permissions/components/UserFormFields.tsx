
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { administrativeRoles } from '../roles';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types/user';

interface UserFormData {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UserFormFieldsProps {
  formData: UserFormData;
  emailError: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (value: string) => void;
}

export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  formData,
  emailError,
  handleInputChange,
  handleRoleChange
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {emailError && (
          <p className="text-sm text-destructive">{emailError}</p>
        )}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select 
          value={formData.role} 
          onValueChange={handleRoleChange}
        >
          <SelectTrigger id="role" className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {administrativeRoles.map(role => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
