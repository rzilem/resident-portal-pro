
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save, X, FileDown } from 'lucide-react';

interface TemplateToolbarProps {
  onSave: () => void;
  onCancel: () => void;
  onExport: () => void;
}

const TemplateToolbar: React.FC<TemplateToolbarProps> = ({ 
  onSave, 
  onCancel,
  onExport
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 mt-2 mb-4">
      <Button variant="default" className="gap-1.5">
        <PlusCircle className="h-4 w-4" />
        New Template
      </Button>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExport} className="gap-1.5">
          <FileDown className="h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel} className="gap-1.5">
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button variant="default" size="sm" onClick={onSave} className="gap-1.5">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default TemplateToolbar;
