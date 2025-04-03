
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Info } from "lucide-react";
import { DocumentFile } from '@/types/documents';
import { useDocumentPreview } from './useDocumentPreview';
import { formatBytes, formatDateTime } from '@/utils/format';
import PreviewContent from './PreviewContent';

interface DocumentPreviewProps {
  document: DocumentFile | null;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  open,
  onOpenChange
}) => {
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
  } = useDocumentPreview(document, open);

  if (!document) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.name}
          </DialogTitle>
          <DialogDescription>
            {document.description || "No description provided"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
          
          <TabsContent 
            value="preview" 
            className="flex-1 border rounded-md mt-4 overflow-hidden min-h-[500px]"
          >
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
          </TabsContent>
          
          <TabsContent value="details" className="mt-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Document Details
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Name
                    </h4>
                    <p>{document.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Category
                    </h4>
                    <p className="capitalize">{document.category}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Size
                    </h4>
                    <p>{formatBytes(document.fileSize)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      File Type
                    </h4>
                    <p>{document.fileType || "Unknown"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Uploaded Date
                    </h4>
                    <p>{formatDateTime(document.uploadedDate)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Last Modified
                    </h4>
                    <p>
                      {document.lastModified 
                        ? formatDateTime(document.lastModified) 
                        : "Not modified since upload"}
                    </p>
                  </div>
                </div>
                
                {document.version > 1 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Version
                    </h4>
                    <p>Version {document.version}</p>
                  </div>
                )}
                
                {document.description && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Description
                    </h4>
                    <p>{document.description}</p>
                  </div>
                )}
                
                {document.tags && document.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {document.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-muted px-2 py-1 rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
