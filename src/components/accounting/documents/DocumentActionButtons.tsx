
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import DocumentUploadDialog from '@/components/documents/DocumentUploadDialog';
import { useAuth } from '@/contexts/auth/AuthProvider';

const DocumentActionButtons: React.FC = () => {
  const isMobile = useIsMobile();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download size={16} />
          {!isMobile && <span>Download</span>}
        </Button>
        <Button 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => setShowUploadDialog(true)}
        >
          <Upload size={16} />
          {!isMobile && <span>Upload Document</span>}
          {isMobile && <span>Upload</span>}
        </Button>
      </div>
      
      <DocumentUploadDialog
        open={showUploadDialog}
        setOpen={setShowUploadDialog}
        onSuccess={() => {
          console.log("Document uploaded successfully");
          // Additional success handling if needed
        }}
      />
    </>
  );
};

export default DocumentActionButtons;
