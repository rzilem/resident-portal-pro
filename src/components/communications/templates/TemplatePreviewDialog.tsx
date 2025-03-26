
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageTemplate } from './types';

interface TemplatePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: MessageTemplate | null;
  onUseTemplate: (template: MessageTemplate) => void;
}

const TemplatePreviewDialog: React.FC<TemplatePreviewDialogProps> = ({
  isOpen,
  onClose,
  template,
  onUseTemplate
}) => {
  if (!template) return null;

  const handleUseTemplate = () => {
    console.log("Using template with content:", template.content);
    onUseTemplate(template);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{template.name} - Preview</DialogTitle>
          <DialogDescription>
            Subject: {template.subject}
          </DialogDescription>
        </DialogHeader>
        
        <div className="border rounded-md p-4 my-4 bg-white">
          <div dangerouslySetInnerHTML={{ __html: template.content || '' }} />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handleUseTemplate}>
            Use Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
