
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
  const emptyContent = format === 'html' 
    ? '<p>No content to preview</p>' 
    : 'No content to preview';

  const contentToDisplay = content || emptyContent;

  // Apply appropriate styling for iframe content
  const getIframeStyle = () => {
    if (format === 'html') {
      return `
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.5;
          color: #333;
          margin: 0;
          padding: 16px;
        }
        img { max-width: 100%; height: auto; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid #ddd; padding: 8px; }
        a { color: #0284c7; text-decoration: underline; }
      `;
    }
    return '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Preview with Merge Tags</DialogTitle>
        </DialogHeader>
        <div className="border rounded-md flex-1 overflow-auto">
          {format === 'html' ? (
            <iframe
              srcDoc={`<!DOCTYPE html>
                <html>
                  <head>
                    <style>${getIframeStyle()}</style>
                  </head>
                  <body>${contentToDisplay}</body>
                </html>`}
              className="w-full h-[500px]"
              title="Message Preview"
              sandbox="allow-same-origin"
            />
          ) : (
            <div className="whitespace-pre-wrap p-4">{contentToDisplay}</div>
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
