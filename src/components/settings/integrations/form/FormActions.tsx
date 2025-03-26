
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  isSaving: boolean;
  isTesting: boolean;
  onTestConnection?: () => Promise<void>;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSaving,
  isTesting,
  onTestConnection
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="gap-2"
      >
        <X className="h-4 w-4" /> Cancel
      </Button>
      
      <div className="space-x-2">
        {onTestConnection && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onTestConnection}
            disabled={isTesting}
          >
            {isTesting ? "Testing..." : "Test Connection"}
          </Button>
        )}
        
        <Button type="submit" disabled={isSaving} className="gap-2">
          <Check className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
