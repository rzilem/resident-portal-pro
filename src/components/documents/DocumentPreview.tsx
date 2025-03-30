
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, Download, FileText, Calendar, User, Clock, Tag, Info, 
  ExternalLink, AlertTriangle, FileSpreadsheet, FileImage, FileCode, FileArchive 
} from 'lucide-react';
import { DocumentFile } from '@/types/documents';
import { 
  formatFileSize, 
  isFilePreviewable, 
  getMimeTypeFromFileName, 
  canUseOfficeViewer, 
  getOfficeViewerUrl,
  sanitizeDocumentUrl 
} from '@/utils/documents/documentUtils';
import { toast } from 'sonner';

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
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [useOfficeViewer, setUseOfficeViewer] = useState(false);
  
  // Reset loading state when document changes
  useEffect(() => {
    if (document) {
      setIsLoading(true);
      setPreviewError(null);
      
      // Check if we should use Office viewer
      const shouldUseOfficeViewer = document.fileType && canUseOfficeViewer(document.fileType);
      setUseOfficeViewer(shouldUseOfficeViewer);
    }
  }, [document]);
  
  if (!document) {
    return null;
  }
  
  const showVersionHistory = document.previousVersions && document.previousVersions.length > 0;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleDownload = () => {
    if (!document.url) {
      toast.error("Document URL is not available");
      return;
    }
    
    // Create a temporary anchor element to trigger download
    const link = window.document.createElement('a');
    link.href = sanitizeDocumentUrl(document.url);
    link.download = document.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    
    toast.success(`Downloading ${document.name}`);
  };
  
  const handleLoadError = () => {
    setIsLoading(false);
    setPreviewError("Failed to load document preview");
    console.error("Failed to load document preview for:", document.name, document.url);
  };
  
  const handleLoadSuccess = () => {
    setIsLoading(false);
    setPreviewError(null);
  };
  
  const getFileIcon = (fileType: string) => {
    const lowerType = fileType.toLowerCase();
    
    if (lowerType.includes('pdf')) {
      return <FileText className="h-16 w-16 text-red-500" />;
    } else if (lowerType.includes('xls') || lowerType.includes('csv') || lowerType.includes('sheet')) {
      return <FileSpreadsheet className="h-16 w-16 text-green-500" />;
    } else if (lowerType.includes('doc') || lowerType.includes('word')) {
      return <FileText className="h-16 w-16 text-blue-500" />;
    } else if (lowerType.includes('ppt') || lowerType.includes('presentation')) {
      return <FileCode className="h-16 w-16 text-orange-500" />;
    } else if (lowerType.includes('image') || lowerType.includes('png') || lowerType.includes('jpg') || lowerType.includes('jpeg') || lowerType.includes('gif')) {
      return <FileImage className="h-16 w-16 text-purple-500" />;
    } else if (lowerType.includes('html') || lowerType.includes('xml') || lowerType.includes('json')) {
      return <FileCode className="h-16 w-16 text-gray-500" />;
    } else {
      return <FileText className="h-16 w-16 text-gray-500" />;
    }
  };
  
  const canPreview = () => {
    return isFilePreviewable(document.fileType) || canUseOfficeViewer(document.fileType);
  };
  
  const getPreviewUrl = () => {
    if (!document.url) return '';
    
    if (useOfficeViewer) {
      return getOfficeViewerUrl(document.url);
    }
    return sanitizeDocumentUrl(document.url);
  };
  
  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    }
    
    if (previewError) {
      return (
        <div className="w-full h-full flex items-center justify-center p-8 text-center">
          <div>
            <AlertTriangle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Preview Error</h3>
            <p className="text-muted-foreground mb-4">{previewError}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Instead
              </Button>
              {document.url && (
                <Button variant="outline" onClick={() => window.open(sanitizeDocumentUrl(document.url), '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (!document.url) {
      return (
        <div className="w-full h-full flex items-center justify-center p-8 text-center">
          <div>
            <AlertTriangle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">No URL Available</h3>
            <p className="text-muted-foreground mb-4">The document URL is not available</p>
          </div>
        </div>
      );
    }
    
    // Determine file type from mime type or file extension
    const fileType = document.fileType.toLowerCase();
    const previewUrl = getPreviewUrl();
    
    console.log("Preview URL:", previewUrl);
    console.log("File type:", fileType);
    
    // PDF preview
    if (fileType.includes('pdf')) {
      return (
        <iframe 
          src={previewUrl} 
          className="w-full h-full" 
          title={document.name}
          onLoad={handleLoadSuccess}
          onError={handleLoadError}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      );
    } 
    // Image preview
    else if (
      fileType.includes('image') || 
      fileType.includes('jpg') || 
      fileType.includes('jpeg') || 
      fileType.includes('png') || 
      fileType.includes('gif') ||
      fileType.includes('svg') ||
      fileType.includes('webp') ||
      document.name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)
    ) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-background/50">
          <img 
            src={previewUrl} 
            alt={document.name} 
            className="max-w-full max-h-full object-contain"
            onLoad={handleLoadSuccess}
            onError={handleLoadError}
          />
        </div>
      );
    }
    // Office documents (Word, Excel, PowerPoint)
    else if (useOfficeViewer) {
      return (
        <iframe 
          src={previewUrl} 
          className="w-full h-full" 
          title={document.name}
          onLoad={handleLoadSuccess}
          onError={handleLoadError}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      );
    }
    // No preview available
    else {
      return (
        <div className="w-full h-full flex items-center justify-center p-8 text-center">
          <div>
            {getFileIcon(document.fileType)}
            <h3 className="text-lg font-medium mb-2">Preview not available</h3>
            <p className="text-muted-foreground mb-4">
              This file type ({document.fileType}) cannot be previewed in the browser.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              {document.url && (
                <Button variant="outline" onClick={() => window.open(sanitizeDocumentUrl(document.url), '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFileIcon(document.fileType)}
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
              {renderPreview()}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4 flex-1 overflow-auto">
            <Card>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Upload Date
                    </h3>
                    <p>{formatDate(document.uploadedDate)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Uploaded By
                    </h3>
                    <p>{document.uploadedBy}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Last Modified
                    </h3>
                    <p>{document.lastModified ? formatDate(document.lastModified) : 'N/A'}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      File Size
                    </h3>
                    <p>{formatFileSize(document.fileSize)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      File Type
                    </h3>
                    <p>{document.fileType}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Version
                    </h3>
                    <p>v{document.version}</p>
                  </div>
                  
                  {document.expirationDate && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Expiration Date
                      </h3>
                      <p>{formatDate(document.expirationDate)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {document.tags && document.tags.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {showVersionHistory && (
            <TabsContent value="versions" className="flex-1 overflow-auto">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Version History</h3>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-md bg-primary/5">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Current Version (v{document.version})</p>
                          <p className="text-sm text-muted-foreground">
                            Modified: {document.lastModified ? formatDate(document.lastModified) : 'N/A'}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                    
                    {document.previousVersions?.map(version => (
                      <div key={version.version} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Version {version.version}</p>
                            <p className="text-sm text-muted-foreground">
                              Modified: {formatDate(version.lastModified)} by {version.modifiedBy}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
