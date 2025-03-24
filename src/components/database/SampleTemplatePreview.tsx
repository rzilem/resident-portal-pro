
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, Download } from 'lucide-react';
import AssociationTemplateInfo from './AssociationTemplateInfo';
import { useToast } from '@/hooks/use-toast';

/**
 * A component to show a preview of a sample template structure and allow download.
 */
const SampleTemplatePreview = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDownloadTemplate = () => {
    // In a real application, this would generate and download the Excel file
    toast({
      title: "Template downloaded",
      description: "Association template has been downloaded to your device",
    });
    // Close the dialog after download
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2" 
        onClick={() => setOpen(true)}
      >
        <Info className="h-4 w-4" />
        View Template Format
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Association Import Template Format</DialogTitle>
            <DialogDescription>
              This is the comprehensive format for importing an entire association with all homeowner data.
              Use this template to ensure your data is formatted correctly.
            </DialogDescription>
          </DialogHeader>

          <AssociationTemplateInfo />

          <div className="flex justify-end gap-2 mt-4">
            <Button 
              onClick={handleDownloadTemplate}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SampleTemplatePreview;
