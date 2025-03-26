
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ViolationActionsProps {
  violationId: string;
}

const ViolationActions: React.FC<ViolationActionsProps> = ({ violationId }) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Edit className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Edit Violation</DropdownMenuItem>
          <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete Violation</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ViolationActions;
