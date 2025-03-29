
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserRole, SecurityLevel, GlobalPermission } from "@/types/user";
import { 
  securityLevelIcons,
  securityLevelDescriptions
} from '../constants/securityLevels';

interface RoleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: UserRole | null;
  roleData?: {
    securityLevel: SecurityLevel;
    globalPermission: string;
    modules: Record<string, string>;
  };
  onSave: (role: UserRole | null, securityLevel: string, globalPermission: string) => void;
}

const RoleEditDialog = ({ 
  open, 
  onOpenChange, 
  role, 
  roleData, 
  onSave 
}: RoleEditDialogProps) => {
  const [securityLevel, setSecurityLevel] = useState<string>('standard');
  const [globalPermission, setGlobalPermission] = useState<string>('view');
  
  // Initialize form values when dialog opens with a role
  useEffect(() => {
    if (role && roleData) {
      setSecurityLevel(roleData.securityLevel);
      setGlobalPermission(roleData.globalPermission);
    }
  }, [role, roleData, open]);
  
  const handleSave = () => {
    onSave(role, securityLevel, globalPermission);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Role: {role?.replace('_', ' ')}</DialogTitle>
          <DialogDescription>
            Customize security level and permissions for this role
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="security-level">Security Level</Label>
            <Select
              value={securityLevel}
              onValueChange={setSecurityLevel}
            >
              <SelectTrigger id="security-level">
                <SelectValue placeholder="Select security level" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(securityLevelDescriptions).map(([level, description]) => (
                  <SelectItem key={level} value={level}>
                    <div className="flex items-center gap-2">
                      {securityLevelIcons[level as SecurityLevel]()}
                      <span className="capitalize">{level.replace('_', ' ')}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {securityLevel && (
              <p className="text-sm text-muted-foreground mt-1">
                {securityLevelDescriptions[securityLevel as SecurityLevel]}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="global-permission">Global Permission</Label>
            <Select
              value={globalPermission}
              onValueChange={setGlobalPermission}
            >
              <SelectTrigger id="global-permission">
                <SelectValue placeholder="Select global permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manage">Manager</SelectItem>
                <SelectItem value="approve">Approver</SelectItem>
                <SelectItem value="contribute">Contributor</SelectItem>
                <SelectItem value="view">Viewer</SelectItem>
                <SelectItem value="none">No Access</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleEditDialog;
