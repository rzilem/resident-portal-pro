
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, Download, FileText, HelpCircle } from 'lucide-react';
import AssociationTemplateInfo from './AssociationTemplateInfo';
import { useToast } from '@/components/ui/use-toast';
import { generateOnboardingTemplate } from '@/utils/exportToExcel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * A component to show a preview of a sample template structure and allow download.
 */
const SampleTemplatePreview = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('preview');

  const handleDownloadTemplate = () => {
    // Generate and download the Excel template
    generateOnboardingTemplate();
    
    toast({
      title: "Template downloaded",
      description: "Association template has been downloaded to your device",
    });
    // Close the dialog after download
    setOpen(false);
  };

  const handleOpenChange = (newState: boolean) => {
    console.log("Dialog open state changing to:", newState);
    setOpen(newState);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2" 
        onClick={() => handleOpenChange(true)}
      >
        <Info className="h-4 w-4" />
        View Template Format
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Association Import Template Format</DialogTitle>
            <DialogDescription>
              This is the comprehensive format for importing an entire association with all homeowner data.
              Use this template to ensure your data is formatted correctly.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="preview" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Template Preview</TabsTrigger>
              <TabsTrigger value="instructions">Import Instructions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="mt-4">
              <AssociationTemplateInfo />
            </TabsContent>
            
            <TabsContent value="instructions" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border rounded-md">
                  <HelpCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">How to Use This Template</h3>
                    <ol className="space-y-2 text-sm">
                      <li>1. Download the template using the button below</li>
                      <li>2. Fill in the required fields marked in the template</li>
                      <li>3. Optional fields can be left blank if data is not available</li>
                      <li>4. Save the file as .xlsx or .csv format</li>
                      <li>5. Use the Bulk Upload feature in the Association settings to import the data</li>
                    </ol>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 border rounded-md">
                  <FileText className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Format Requirements</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Do not modify column headers or delete columns</li>
                      <li>• Use the specified date format: MM/DD/YYYY</li>
                      <li>• For Yes/No fields, use only "Yes" or "No" values</li>
                      <li>• For currency fields, you may include or omit the $ symbol</li>
                      <li>• If you encounter any validation errors, review the error messages and fix the data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </Button>
            <Button 
              onClick={handleDownloadTemplate}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SampleTemplatePreview;
