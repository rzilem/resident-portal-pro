
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

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
      <Button onClick={openNewUserDialog} size="sm" className="gap-1">
        <UserPlus className="h-4 w-4" />
        <span>Invite User</span>
      </Button>
    </div>
  );
};

export default UserManagementHeader;
