
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';

interface SecuritySettingsFooterProps {
  hasChanges: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => void;
}

const SecuritySettingsFooter: React.FC<SecuritySettingsFooterProps> = ({
  hasChanges,
  isSaving,
  onReset,
  onSave
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        onClick={onReset}
        disabled={!hasChanges || isSaving}
      >
        Reset Changes
      </Button>
      <Button 
        onClick={onSave}
        disabled={!hasChanges || isSaving}
        className="flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>Save Security Settings</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default SecuritySettingsFooter;
