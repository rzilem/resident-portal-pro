
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import APIConfigForm, { APIConfigFormProps } from '../APIConfigForm';

interface ConfigFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIntegration: string | null;
  fields: APIConfigFormProps['fields'];
  initialValues: Record<string, any>;
  onSave: (values: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  testConnection?: (values: Record<string, any>) => Promise<boolean>;
}

const ConfigFormDialog: React.FC<ConfigFormDialogProps> = ({
  open,
  onOpenChange,
  selectedIntegration,
  fields,
  initialValues,
  onSave,
  onCancel,
  testConnection
}) => {
  if (!selectedIntegration) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure {selectedIntegration}</DialogTitle>
          <DialogDescription>
            Enter your API details for {selectedIntegration}
          </DialogDescription>
        </DialogHeader>
        
        <APIConfigForm 
          integrationId={selectedIntegration}
          fields={fields}
          initialValues={initialValues}
          onSave={onSave}
          onCancel={onCancel}
          testConnection={testConnection}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ConfigFormDialog;
