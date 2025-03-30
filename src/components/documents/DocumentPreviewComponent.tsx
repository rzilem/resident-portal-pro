
import React, { useState, useEffect } from 'react';
import { DocumentFile } from '@/types/documents';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FileImage, Film, FileAudio, File, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface DocumentPreviewProps {
  document: DocumentFile | null;
  onClose?: () => void;
}

const DocumentPreviewComponent: React.FC<DocumentPreviewProps> = ({ 
  document,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<string>('preview');
  
  const getFileIcon = () => {
    if (!document) return <File className="h-16 w-16 text-muted-foreground" />;
    
    const fileType = document.fileType.toLowerCase();
    
    if (fileType.includes('pdf')) {
      return <FileText className="h-16 w-16 text-red-500" />;
    } else if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png') || fileType.includes('jpeg')) {
      return <FileImage className="h-16 w-16 text-blue-500" />;
    } else if (fileType.includes('video') || fileType.includes('mp4')) {
      return <Film className="h-16 w-16 text-purple-500" />;
    } else if (fileType.includes('audio') || fileType.includes('mp3')) {
      return <FileAudio className="h-16 w-16 text-green-500" />;
    } else {
      return <File className="h-16 w-16 text-gray-500" />;
    }
  };
  
  const renderPreview = () => {
    if (!document) return <div className="p-12 text-center text-muted-foreground">No document selected</div>;
    
    const fileType = document.fileType.toLowerCase();
    
    // PDF preview
    if (fileType.includes('pdf')) {
      return (
        <object 
          data={document.url} 
          type="application/pdf" 
          width="100%" 
          height="500px" 
          className="border rounded-md"
        >
          <div className="p-12 text-center">
            <p className="mb-4">Unable to display PDF. Please download to view.</p>
            <Button asChild>
              <a href={document.url} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </a>
            </Button>
          </div>
        </object>
      );
    }
    
    // Image preview  
    if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png') || fileType.includes('jpeg')) {
      return (
        <div className="flex justify-center">
          <img 
            src={document.url} 
            alt={document.name}
            className="max-w-full max-h-[500px] object-contain" 
          />
        </div>
      );
    }
    
    // Video preview
    if (fileType.includes('video') || fileType.includes('mp4')) {
      return (
        <video controls className="w-full max-h-[500px]">
          <source src={document.url} type={document.fileType} />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    // Audio preview
    if (fileType.includes('audio') || fileType.includes('mp3')) {
      return (
        <div className="p-12 text-center">
          <audio controls className="w-full">
            <source src={document.url} type={document.fileType} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }
    
    // Default: No preview available
    return (
      <div className="p-12 text-center">
        <div className="mb-8 flex justify-center">{getFileIcon()}</div>
        <h3 className="text-lg font-medium mb-2">Preview not available</h3>
        <p className="text-muted-foreground mb-6">
          This file type cannot be previewed directly in the browser.
        </p>
        <Button asChild>
          <a href={document.url} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" />
            Download File
          </a>
        </Button>
      </div>
    );
  };
  
  const renderDetails = () => {
    if (!document) return <div className="p-12 text-center text-muted-foreground">No document selected</div>;
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    return (
      <div className="p-6">
        <div className="grid gap-3">
          <div className="grid grid-cols-3 border-b pb-2">
            <div className="font-medium">Name</div>
            <div className="col-span-2">{document.name}</div>
          </div>
          
          {document.description && (
            <div className="grid grid-cols-3 border-b pb-2">
              <div className="font-medium">Description</div>
              <div className="col-span-2">{document.description}</div>
            </div>
          )}
          
          <div className="grid grid-cols-3 border-b pb-2">
            <div className="font-medium">File Type</div>
            <div className="col-span-2">{document.fileType}</div>
          </div>
          
          <div className="grid grid-cols-3 border-b pb-2">
            <div className="font-medium">File Size</div>
            <div className="col-span-2">{formatFileSize(document.fileSize)}</div>
          </div>
          
          <div className="grid grid-cols-3 border-b pb-2">
            <div className="font-medium">Uploaded By</div>
            <div className="col-span-2">{document.uploadedBy || 'Unknown'}</div>
          </div>
          
          <div className="grid grid-cols-3 border-b pb-2">
            <div className="font-medium">Upload Date</div>
            <div className="col-span-2">{formatDate(document.uploadedDate)}</div>
          </div>
          
          <div className="grid grid-cols-3 border-b pb-2">
            <div className="font-medium">Last Modified</div>
            <div className="col-span-2">{formatDate(document.lastModified || document.uploadedDate)}</div>
          </div>
          
          <div className="grid grid-cols-3 border-b pb-2">
            <div className="font-medium">Category</div>
            <div className="col-span-2">{document.category || 'Uncategorized'}</div>
          </div>
          
          {document.tags && document.tags.length > 0 && (
            <div className="grid grid-cols-3 border-b pb-2">
              <div className="font-medium">Tags</div>
              <div className="col-span-2">
                {document.tags.join(', ')}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-3 border-b pb-2">
            <div className="font-medium">Version</div>
            <div className="col-span-2">{document.version || 1}</div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-0">
        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4 flex items-center justify-between border-b">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              {document && (
                <Button variant="outline" size="sm" asChild>
                  <a href={document.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </a>
                </Button>
              )}
              
              {document && (
                <Button variant="secondary" size="sm" asChild>
                  <a href={document.url} download={document.name}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          <TabsContent value="preview" className="pt-2">
            {renderPreview()}
          </TabsContent>
          
          <TabsContent value="details">
            {renderDetails()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentPreviewComponent;
