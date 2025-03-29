
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface TemplateDialogFooterProps {
  onClose: () => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
  type: 'create' | 'edit';
}

const TemplateDialogFooter: React.FC<TemplateDialogFooterProps> = ({
  onClose,
  onSave,
  hasUnsavedChanges,
  type
}) => {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button 
        onClick={onSave}
        disabled={!hasUnsavedChanges}
      >
        {type === 'create' ? 'Create Template' : 'Save Changes'}
      </Button>
    </DialogFooter>
  );
};

export default TemplateDialogFooter;
