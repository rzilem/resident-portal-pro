
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface MessagePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  format: 'plain' | 'html';
}

const MessagePreview: React.FC<MessagePreviewProps> = ({
  open,
  onOpenChange,
  content,
  format
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Preview with Merge Tags</DialogTitle>
        </DialogHeader>
        <div className="border rounded-md p-4 max-h-[500px] overflow-auto">
          {format === 'html' ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <div className="whitespace-pre-wrap">{content}</div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close Preview</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessagePreview;
