
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X, FileExport, Settings } from 'lucide-react';

interface TemplateToolbarProps {
  onSave: () => void;
  onCancel: () => void;
  onExport: () => void;
}

const TemplateToolbar = ({ onSave, onCancel, onExport }: TemplateToolbarProps) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button variant="default" size="sm" onClick={onSave} className="flex items-center gap-1">
        <Save className="h-4 w-4" />
        Save changes
      </Button>
      <Button variant="outline" size="sm" onClick={onCancel} className="flex items-center gap-1">
        <X className="h-4 w-4" />
        Cancel changes
      </Button>
      <Button variant="outline" size="sm" onClick={onExport} className="flex items-center gap-1">
        <FileExport className="h-4 w-4" />
        Export to Excel
      </Button>
      <div className="ml-auto">
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TemplateToolbar;
