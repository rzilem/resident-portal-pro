
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";

interface UserManagementHeaderProps {
  openNewUserDialog: () => void;
}

const UserManagementHeader = ({ openNewUserDialog }: UserManagementHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>Manage users and their roles in the system</CardDescription>
      </div>
      <Button onClick={openNewUserDialog}>
        <UserPlus className="h-4 w-4 mr-2" />
        Invite User
      </Button>
    </div>
  );
};

export default UserManagementHeader;
