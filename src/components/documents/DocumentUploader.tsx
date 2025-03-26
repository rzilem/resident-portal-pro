
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useAssociations } from '@/hooks/use-associations';
import { toast } from 'sonner';

interface DocumentUploaderProps {
  refreshDocuments?: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ refreshDocuments }) => {
  const { activeAssociation } = useAssociations();

  const handleUpload = () => {
    if (!activeAssociation) {
      toast.error("Please select an association first");
      return;
    }
    
    // In a real app, this would open a file upload dialog
    // For now, just show a toast
    toast.success(`Uploading document to ${activeAssociation.name}`);
    
    // Simulate successful upload after a delay
    setTimeout(() => {
      toast.success(`Document uploaded successfully to ${activeAssociation.name}`);
      if (refreshDocuments) {
        refreshDocuments();
      }
    }, 1500);
  };

  return (
    <Button onClick={handleUpload} className="flex items-center gap-2">
      <Upload className="h-4 w-4" />
      <span>Upload Document</span>
    </Button>
  );
};

export default DocumentUploader;
