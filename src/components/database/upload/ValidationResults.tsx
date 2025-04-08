
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { importData } from '@/utils/spreadsheets/importData';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface ValidationResultsProps {
  validationResults: {
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  } | null;
  onStepChange: (step: 'initial' | 'mapping' | 'validation' | 'success') => void;
  fileData: {
    headers: string[];
    rows: Record<string, any>[];
  } | null;
  mappings: {
    sourceField: string;
    targetField: string;
  }[];
  onComplete: (results: { recordsImported: number; recordsWithWarnings: number }) => void;
  fileName: string;
  importType: string;
}

const ValidationResults: React.FC<ValidationResultsProps> = ({
  validationResults,
  onStepChange,
  fileData,
  mappings,
  onComplete,
  fileName,
  importType
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleImport = async () => {
    if (!fileData) {
      toast.error("No file data available");
      return;
    }
    
    setIsImporting(true);
    
    try {
      // Start progress animation
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress > 90) {
          currentProgress = 90;
          clearInterval(progressInterval);
        }
        setProgress(currentProgress);
      }, 300);
      
      console.log("Starting import with mappings:", mappings);
      console.log("File data rows:", fileData.rows.length);
      
      // Transform the data using mappings before import
      const result = await importData({
        records: fileData.rows,
        mappings,
        fileName,
        importType
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success) {
        toast.success(`Import completed successfully! ${result.recordsImported} records imported.`);
        onComplete({
          recordsImported: result.recordsImported,
          recordsWithWarnings: result.recordsWithWarnings
        });
      } else {
        toast.error(`Import failed: ${result.errorMessage}`);
        setIsImporting(false);
      }
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Error during import. Please check the console for details.');
      setIsImporting(false);
    }
  };
  
  // Render states for validation results
  const renderValidationAlert = () => {
    if (!validationResults) return null;
    
    if (validationResults.errors > 0) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation errors detected</AlertTitle>
          <AlertDescription>
            {validationResults.errors} record(s) have errors that need to be fixed before importing.
          </AlertDescription>
        </Alert>
      );
    } else if (validationResults.warnings > 0) {
      return (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Validation warnings detected</AlertTitle>
          <AlertDescription>
            {validationResults.warnings} record(s) have warnings but can still be imported.
          </AlertDescription>
        </Alert>
      );
    } else {
      return (
        <Alert variant="success" className="mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Validation passed</AlertTitle>
          <AlertDescription>
            All {validationResults.valid} records are ready to be imported.
          </AlertDescription>
        </Alert>
      );
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-medium">Validation Results</h3>
          <p className="text-sm text-muted-foreground">
            Review validation results before importing
          </p>
        </div>
      </div>
      
      {renderValidationAlert()}
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-muted p-3 rounded-lg text-center">
          <p className="text-2xl font-bold">
            {validationResults?.total || 0}
          </p>
          <p className="text-xs text-muted-foreground">Total Records</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-600">
            {validationResults?.valid || 0}
          </p>
          <p className="text-xs text-muted-foreground">Valid</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {validationResults?.warnings || 0}
          </p>
          <p className="text-xs text-muted-foreground">Warnings</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-600">
            {validationResults?.errors || 0}
          </p>
          <p className="text-xs text-muted-foreground">Errors</p>
        </div>
      </div>
      
      {isImporting && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Importing data...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          variant="outline"
          onClick={() => onStepChange('mapping')}
          disabled={isImporting}
        >
          Back
        </Button>
        <Button
          onClick={handleImport}
          disabled={
            isImporting || 
            !validationResults || 
            validationResults.valid === 0 ||
            validationResults.errors > 0
          }
        >
          Import Data
        </Button>
      </div>
    </div>
  );
};

export default ValidationResults;
