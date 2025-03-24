
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

const DocumentActionButtons: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Download size={16} />
        {!isMobile && <span>Download</span>}
      </Button>
      <Button size="sm" className="flex items-center gap-1">
        <Upload size={16} />
        {!isMobile && <span>Upload Document</span>}
        {isMobile && <span>Upload</span>}
      </Button>
    </div>
  );
};

export default DocumentActionButtons;
