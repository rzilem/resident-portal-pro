
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, FileEdit, Eye, Trash2, Bell, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ViolationActionsProps {
  violationId: string;
}

const ViolationActions: React.FC<ViolationActionsProps> = ({ violationId }) => {
  const handleView = () => {
    toast.info('Viewing violation details', { id: violationId });
    // In a real app, this would navigate to a detailed view
  };

  const handleEdit = () => {
    toast.info('Editing violation', { id: violationId });
    // In a real app, this would open an edit form
  };

  const handleDelete = () => {
    toast.info('Deleting violation', { id: violationId });
    // In a real app, this would show a confirmation dialog
  };

  const handleSendNotification = () => {
    toast.info('Sending notification', { id: violationId });
    // In a real app, this would open a notification form
  };

  const handleAddComment = () => {
    toast.info('Adding comment', { id: violationId });
    // In a real app, this would open a comment form
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <FileEdit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendNotification}>
          <Bell className="mr-2 h-4 w-4" />
          <span>Send Notification</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddComment}>
          <MessageCircle className="mr-2 h-4 w-4" />
          <span>Add Comment</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViolationActions;
