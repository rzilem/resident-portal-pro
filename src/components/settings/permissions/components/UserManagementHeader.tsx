
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface UserManagementHeaderProps {
  openNewUserDialog: () => void;
}

const UserManagementHeader = ({ openNewUserDialog }: UserManagementHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium">Administrator & Staff Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage system administrators and staff users with advanced permissions.
          <br/>
          <span className="text-xs italic">
            Note: Resident users are managed in the Residents section.
          </span>
        </p>
      </div>
      <Button 
        onClick={openNewUserDialog} 
        className="flex items-center gap-1"
      >
        <PlusCircle className="h-4 w-4" />
        Add Administrator
      </Button>
    </div>
  );
};

export default UserManagementHeader;
