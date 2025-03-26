
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import the tab components
import UploadDataTab from './upload/UploadDataTab';
import DocumentStructureTab from './upload/DocumentStructureTab';
import TemplatesTab from './upload/TemplatesTab';
import SuccessState from './upload/SuccessState';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BulkUploadDialog = ({ open, onOpenChange }: BulkUploadDialogProps) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadState, setUploadState] = useState<'idle' | 'success'>('idle');

  const resetUpload = () => {
    setUploadState('idle');
  };

  const handleUploadComplete = () => {
    setUploadState('success');
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Import Association Data</DialogTitle>
          <DialogDescription>
            Upload a spreadsheet with all homeowner data for an entire association at once.
          </DialogDescription>
        </DialogHeader>

        {uploadState === 'success' ? (
          <SuccessState 
            onReset={resetUpload} 
            onClose={handleClose} 
          />
        ) : (
          <Tabs defaultValue="upload" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="upload">Upload Data</TabsTrigger>
              <TabsTrigger value="documents">Upload Documents</TabsTrigger>
              <TabsTrigger value="templates">Download Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4 py-4">
              <UploadDataTab onComplete={handleUploadComplete} />
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-6 py-4">
              <DocumentStructureTab onOpenChange={handleClose} />
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-6 py-4">
              <TemplatesTab onOpenChange={handleClose} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
