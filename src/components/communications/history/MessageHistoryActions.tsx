
import React, { useState } from 'react';
import { MoreHorizontal, Eye, Calendar, Copy, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Communication } from '@/services/communicationService';
import { TooltipButton } from '@/components/ui/tooltip-button';

interface MessageHistoryActionsProps {
  message: Communication;
  onCancelScheduled: (messageId: string) => Promise<void>;
  onRefresh: () => void;
}

const MessageHistoryActions: React.FC<MessageHistoryActionsProps> = ({ 
  message, 
  onCancelScheduled,
  onRefresh
}) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const handleCopy = () => {
    // Clone to new message function would go here
    toast.success('Message copied to new draft');
    onRefresh();
  };

  const handleViewMessage = () => {
    setViewOpen(true);
  };
  
  const handleCancelScheduled = async () => {
    await onCancelScheduled(message.id);
    setConfirmCancelOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewMessage}>
            <Eye className="mr-2 h-4 w-4" />
            View Message
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy to New
          </DropdownMenuItem>
          
          {message.status === 'scheduled' && (
            <DropdownMenuItem 
              onClick={() => setConfirmCancelOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Scheduled
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Message View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{message.subject || 'SMS Message'}</DialogTitle>
            <DialogDescription>
              {message.message_type === 'email' ? 'Email' : 'SMS'} {message.status} on {new Date(message.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border rounded-md p-4 bg-muted/30">
              <h4 className="text-sm font-medium mb-2">Recipients:</h4>
              <div className="flex flex-wrap gap-2">
                {message.recipients.map(recipient => (
                  <span 
                    key={recipient.id}
                    className="px-2 py-1 bg-primary/10 rounded-full text-xs"
                  >
                    {recipient.recipient_email}
                  </span>
                ))}
              </div>
            </div>
            
            {message.message_type === 'email' && (
              <div>
                <h4 className="text-sm font-medium mb-2">Subject:</h4>
                <p className="text-sm">{message.subject}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium mb-2">Content:</h4>
              {message.format === 'html' ? (
                <div 
                  className="border rounded-md p-4 overflow-auto max-h-96"
                  dangerouslySetInnerHTML={{ __html: message.content }} 
                />
              ) : (
                <div className="border rounded-md p-4 whitespace-pre-wrap overflow-auto max-h-96">
                  {message.content}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex sm:justify-between gap-2">
            <div className="hidden sm:flex gap-2">
              <TooltipButton
                onClick={handleCopy}
                tooltipText="Copy to new message"
                variant="outline"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy to New
              </TooltipButton>
              
              {message.status === 'scheduled' && (
                <TooltipButton
                  onClick={() => {
                    setViewOpen(false);
                    setConfirmCancelOpen(true);
                  }}
                  tooltipText="Cancel scheduled message"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Scheduled
                </TooltipButton>
              )}
            </div>
            
            <DialogClose asChild>
              <TooltipButton
                tooltipText="Close dialog"
                variant="secondary"
              >
                Close
              </TooltipButton>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Cancel Dialog */}
      <Dialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Scheduled Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this scheduled message? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmCancelOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelScheduled}
            >
              Yes, Cancel Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageHistoryActions;
