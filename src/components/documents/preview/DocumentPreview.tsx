
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, X, Info, File } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { DocumentFile } from '@/types/documents';
import { useDocumentPreview } from './useDocumentPreview';
import PreviewContent from './PreviewContent';
import DocumentDetails from './DocumentDetails';

interface DocumentPreviewProps {
  document: DocumentFile | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  isOpen,
  onClose
}) => {
  // Custom hook for document preview state and functions
  const {
    activeTab,
    setActiveTab,
    isLoading,
    previewError,
    previewUrl,
    useOfficeViewer,
    handleLoadSuccess,
    handleLoadError,
    handleDownload
  } = useDocumentPreview(document, isOpen);

  // If no document is provided, don't render anything
  if (!document) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 py-2 flex flex-col sm:flex-row items-start justify-between">
          <div className="flex-1 mr-2">
            <DialogTitle className="text-xl font-semibold truncate">
              {document.name}
            </DialogTitle>
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownload}
              className="h-8 px-2 mr-1"
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <Separator />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start px-4 pt-2">
            <TabsTrigger value="preview" className="data-[state=active]:font-medium">
              <File className="h-4 w-4 mr-1" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:font-medium">
              <Info className="h-4 w-4 mr-1" />
              Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="m-0 p-0">
            <div className="h-[70vh] overflow-hidden">
              <PreviewContent
                isLoading={isLoading}
                previewError={previewError}
                document={document}
                previewUrl={previewUrl}
                useOfficeViewer={useOfficeViewer}
                onLoadSuccess={handleLoadSuccess}
                onLoadError={handleLoadError}
                onDownload={handleDownload}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="m-0 px-4 py-6">
            <DocumentDetails document={document} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
