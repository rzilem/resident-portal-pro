
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download, FileText, FilePdf, FileImage, FileCode } from 'lucide-react';
import { DocumentFile } from '@/types/documents';

interface DocumentPreviewProps {
  document: DocumentFile;
  onClose?: () => void;
}

const DocumentPreviewComponent: React.FC<DocumentPreviewProps> = ({ 
  document, 
  onClose 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (document && document.url) {
      setPreviewUrl(document.url);
    }
    
    return () => {
      // Clean up any resources if needed
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [document]);
  
  const handleDownload = () => {
    if (document.url) {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = document.url;
      link.setAttribute('download', document.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const getFileIcon = () => {
    const fileType = document.fileType?.toLowerCase() || '';
    
    if (fileType.includes('pdf')) {
      return <FilePdf className="h-6 w-6" />;
    } else if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png') || fileType.includes('jpeg')) {
      return <FileImage className="h-6 w-6" />;
    } else if (fileType.includes('html') || fileType.includes('json') || fileType.includes('xml') || fileType.includes('txt')) {
      return <FileCode className="h-6 w-6" />;
    } else {
      return <FileText className="h-6 w-6" />;
    }
  };
  
  const renderFilePreview = () => {
    if (!previewUrl) {
      return (
        <div className="flex items-center justify-center h-96 bg-muted/20">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>Preview not available</p>
          </div>
        </div>
      );
    }
    
    const fileType = document.fileType?.toLowerCase() || '';
    
    if (fileType.includes('pdf')) {
      return (
        <iframe
          src={`${previewUrl}#toolbar=0&navpanes=0`}
          className="w-full h-[500px] border-0"
          title={document.name}
        />
      );
    } else if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png') || fileType.includes('jpeg')) {
      return (
        <div className="flex justify-center bg-muted/20 p-4 h-[500px]">
          <img 
            src={previewUrl} 
            alt={document.name} 
            className="max-h-full object-contain"
          />
        </div>
      );
    } else if (fileType.includes('html')) {
      return (
        <iframe
          src={previewUrl}
          className="w-full h-[500px] border-0"
          title={document.name}
        />
      );
    } else if (fileType.includes('txt') || fileType.includes('json') || fileType.includes('xml')) {
      return (
        <div className="bg-muted/20 p-4 h-[500px] overflow-auto">
          <pre className="text-sm whitespace-pre-wrap">
            {/* Text content would be loaded here in a real implementation */}
            Document preview not supported directly. Please download the file to view its contents.
          </pre>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-96 bg-muted/20">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>Preview not available for this file type</p>
            <p className="text-sm text-muted-foreground mt-2">Please download the file to view it</p>
          </div>
        </div>
      );
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {getFileIcon()}
          <CardTitle className="text-xl font-semibold">{document.name}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderFilePreview()}
        
        <div className="mt-4 text-sm text-muted-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Type:</span> {document.fileType || 'Unknown'}</p>
              <p><span className="font-medium">Size:</span> {document.fileSize ? `${Math.round(document.fileSize / 1024)} KB` : 'Unknown'}</p>
            </div>
            <div>
              <p><span className="font-medium">Uploaded:</span> {new Date(document.uploadedDate).toLocaleDateString()}</p>
              <p><span className="font-medium">Category:</span> {document.category}</p>
            </div>
          </div>
          {document.description && (
            <div className="mt-4">
              <p className="font-medium">Description:</p>
              <p>{document.description}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
        <div className="flex gap-2">
          <Button className="flex items-center gap-2" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="secondary" className="flex items-center gap-2" asChild>
            <a href={previewUrl || '#'} target="_blank" rel="noopener noreferrer">
              <Eye className="h-4 w-4" />
              Open in New Tab
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentPreviewComponent;
