
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileCheck, AlertCircle } from 'lucide-react';

interface ValidationResultsProps {
  validationResults: {
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  } | null;
  onStepChange: (step: 'initial' | 'mapping' | 'validation') => void;
  fileData: {
    headers: string[];
    rows: Record<string, any>[];
  } | null;
  mappings: {
    sourceField: string;
    targetField: string;
  }[];
  onComplete: () => void;
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ 
  validationResults,
  onStepChange,
  fileData,
  mappings,
  onComplete
}) => {
  const handleFinalize = () => {
    // In a real app, you would finalize the import here
    onComplete();
  };

  if (!validationResults) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Validation</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Check your data for errors before finalizing
      </p>
      <div className="border rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Total Records</span>
          <span className="bg-primary/10 text-primary font-medium py-1 px-3 rounded-full">
            {validationResults.total}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Valid Records</span>
          <span className="bg-green-100 text-green-800 font-medium py-1 px-3 rounded-full flex items-center gap-1">
            <FileCheck className="h-3.5 w-3.5" />
            {validationResults.valid}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Records with Warnings</span>
          <span className="bg-amber-100 text-amber-800 font-medium py-1 px-3 rounded-full flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {validationResults.warnings}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Records with Errors</span>
          <span className="bg-red-100 text-red-800 font-medium py-1 px-3 rounded-full">
            {validationResults.errors}
          </span>
        </div>
      </div>
      
      {validationResults.warnings > 0 && (
        <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-sm">
          <h4 className="font-medium text-amber-800">Warning Details</h4>
          <ul className="mt-2 space-y-1 text-sm">
            {validationResults.warnings > 0 && (
              <li>Some email addresses may be invalid (missing @ symbol)</li>
            )}
            {fileData && mappings.find(m => m.targetField === 'phone') && (
              <li>Some phone numbers may be in an incorrect format</li>
            )}
            {fileData && !mappings.find(m => m.targetField === 'property.unitNumber') && (
              <li>Unit numbers not mapped for possible multi-unit properties</li>
            )}
          </ul>
        </div>
      )}
      
      {validationResults.errors > 0 && (
        <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-sm">
          <h4 className="font-medium text-red-800">Error Details</h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Some records are missing required fields (First Name, Last Name, or Email)</li>
          </ul>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={() => onStepChange('mapping')}>Back</Button>
        <Button onClick={handleFinalize} disabled={validationResults.errors > 0}>
          Finalize Import
        </Button>
      </div>
    </div>
  );
};

export default ValidationResults;
