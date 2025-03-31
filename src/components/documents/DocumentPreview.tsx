
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import { DocumentFile } from '@/types/documents';
import FileIcon from './preview/FileIcon';
import PreviewContent from './preview/PreviewContent';
import DocumentDetailsContent from './preview/DocumentDetailsContent';
import VersionHistoryContent from './preview/VersionHistoryContent';
import { useDocumentPreview } from './preview/useDocumentPreview';
import { documentPreviewLog } from '@/utils/debug';

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
  const {
    activeTab,
    setActiveTab,
    isLoading,
    previewError,
    useOfficeViewer,
    previewUrl,
    handleLoadError,
    handleLoadSuccess,
    handleDownload
  } = useDocumentPreview(document, isOpen);
  
  documentPreviewLog('Rendering component', {
    hasDocument: !!document,
    isOpen,
    isLoading,
    hasError: !!previewError,
    activeTab
  });
  
  if (!document) {
    documentPreviewLog('No document provided, not rendering');
    return null;
  }
  
  const showVersionHistory = document.previousVersions && document.previousVersions.length > 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      documentPreviewLog('Dialog onOpenChange triggered', { newOpenState: open });
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-4xl max-h-[80vh] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileIcon fileType={document.fileType} />
            <span className="truncate">{document.name}</span>
          </DialogTitle>
          <DialogDescription>
            {document.description || 'No description provided'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            {showVersionHistory && (
              <TabsTrigger value="versions">Version History</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="preview" className="flex-1 flex flex-col">
            <div className="bg-muted/30 border rounded-md flex-1 overflow-hidden">
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
          
          <TabsContent value="details" className="space-y-4 flex-1 overflow-auto">
            <DocumentDetailsContent document={document} />
          </TabsContent>
          
          {showVersionHistory && (
            <TabsContent value="versions" className="flex-1 overflow-auto">
              <VersionHistoryContent document={document} />
            </TabsContent>
          )}
        </Tabs>
        
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
