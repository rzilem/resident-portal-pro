
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageTemplate } from './types';
import { mergeTagService } from '@/services/mergeTagService';
import { Loader2 } from 'lucide-react';

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
  const [processedContent, setProcessedContent] = useState<string>('');
  const [processedSubject, setProcessedSubject] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && template) {
      setIsLoading(true);
      
      // Process the merge tags in content
      Promise.all([
        mergeTagService.processMergeTags(template.content || ''),
        mergeTagService.processMergeTags(template.subject || '')
      ])
        .then(([processedContentResult, processedSubjectResult]) => {
          setProcessedContent(processedContentResult);
          setProcessedSubject(processedSubjectResult);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error processing merge tags:', error);
          setProcessedContent(template.content || '');
          setProcessedSubject(template.subject || '');
          setIsLoading(false);
        });
    }
  }, [isOpen, template]);

  if (!template) return null;

  const handleUseTemplate = () => {
    console.log("Using template with content:", template.content);
    onUseTemplate(template);
    onClose();
  };

  // Apply appropriate styling for iframe content
  const getIframeStyle = () => {
    return `
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.5;
        color: #333;
        margin: 0;
        padding: 16px;
        background-color: white;
      }
      img { max-width: 100%; height: auto; }
      table { border-collapse: collapse; width: 100%; }
      td, th { border: 1px solid #ddd; padding: 8px; }
      a { color: #0284c7; text-decoration: underline; }
    `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{template.name} - Preview</DialogTitle>
          <DialogDescription>
            Subject: {processedSubject || template.subject}
          </DialogDescription>
        </DialogHeader>
        
        <div className="border rounded-md flex-1 overflow-hidden my-4 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-[500px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Processing merge tags...</span>
            </div>
          ) : (
            <iframe
              srcDoc={`<!DOCTYPE html>
                <html>
                  <head>
                    <style>${getIframeStyle()}</style>
                  </head>
                  <body>${processedContent || '<p>No content available</p>'}</body>
                </html>`}
              className="w-full h-[500px]"
              title="Template Preview"
              sandbox="allow-same-origin"
            />
          )}
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
