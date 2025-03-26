
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, FileText, Calendar, User, Clock, Tag, Info } from 'lucide-react';
import { DocumentFile } from '@/types/documents';
import { formatFileSize } from '@/utils/documents/documentUtils';

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
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.name}
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
            <div className="bg-gray-100 border rounded-md flex-1 overflow-hidden">
              {document.fileType.includes('pdf') ? (
                <iframe 
                  src={document.url} 
                  className="w-full h-full" 
                  title={document.name}
                />
              ) : document.fileType.includes('image') ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img src={document.url} alt={document.name} className="max-w-full max-h-full" />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8 text-center">
                  <div>
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Preview not available</h3>
                    <p className="text-muted-foreground mb-4">
                      This file type cannot be previewed in the browser.
                    </p>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                </div>
              )}
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
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
