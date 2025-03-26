
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useAssociations } from '@/hooks/use-associations';
import { toast } from 'sonner';

const DocumentUploader: React.FC = () => {
  const { activeAssociation } = useAssociations();

  const handleUpload = () => {
    if (!activeAssociation) {
      toast.error("Please select an association first");
      return;
    }
    
    // In a real app, this would open a file upload dialog
    // For now, just show a toast
    toast.success(`Uploading document to ${activeAssociation.name}`);
  };

  return (
    <Button onClick={handleUpload} className="flex items-center gap-2">
      <Upload className="h-4 w-4" />
      <span>Upload Document</span>
    </Button>
  );
};

export default DocumentUploader;
