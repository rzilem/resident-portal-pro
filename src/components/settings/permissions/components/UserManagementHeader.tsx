
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface UserManagementHeaderProps {
  openNewUserDialog: () => void;
}

const UserManagementHeader = ({ openNewUserDialog }: UserManagementHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold">User Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage user accounts and permissions
        </p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={openNewUserDialog} size="sm" className="gap-1">
              <UserPlus className="h-4 w-4" />
              <span>Invite User</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Invite a new user to the system</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default UserManagementHeader;
