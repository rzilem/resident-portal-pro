
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

const DocumentActionButtons: React.FC = () => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Download size={16} /> Download
      </Button>
      <Button size="sm" className="flex items-center gap-1">
        <Upload size={16} /> Upload Document
      </Button>
    </div>
  );
};

export default DocumentActionButtons;
