
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileCheck, AlertCircle, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { importData } from '@/utils/spreadsheets/importData';

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
  fileName?: string;
  importType?: string;
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ 
  validationResults,
  onStepChange,
  fileData,
  mappings,
  onComplete,
  fileName = "unknown.xlsx",
  importType = "association"
}) => {
  const [importing, setImporting] = useState(false);
  
  useEffect(() => {
    // Log for debugging purposes
    console.log("Validation Results component loaded with:", validationResults);
  }, [validationResults]);

  const handleFinalize = async () => {
    if (!validationResults) {
      toast.error("No validation results available");
      return;
    }
    
    if (validationResults.errors > 0) {
      toast.error("Please correct errors before finalizing");
      return;
    }
    
    if (!fileData || fileData.rows.length === 0) {
      toast.error("No data to import");
      return;
    }
    
    setImporting(true);
    
    try {
      // Import the data into Supabase
      const result = await importData({
        records: fileData.rows,
        mappings,
        fileName,
        importType
      });
      
      if (result.success) {
        toast.success(`Successfully imported ${result.recordsImported} records with ${result.recordsWithWarnings} warnings`);
        onComplete();
      } else {
        toast.error(result.errorMessage || "Error importing data");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setImporting(false);
    }
  };

  if (!validationResults) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
        <h3 className="text-lg font-medium">No Validation Results</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-4">
          Please complete the mapping step first.
        </p>
        <Button onClick={() => onStepChange('mapping')}>Return to Mapping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Validation Results</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Check your data for errors before finalizing
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Total Records</span>
            <span className="bg-primary/10 text-primary font-medium py-1 px-3 rounded-full">
              {validationResults.total}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-primary rounded-full" 
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Valid Records</span>
            <span className="bg-green-100 text-green-800 font-medium py-1 px-3 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {validationResults.valid}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-green-500 rounded-full" 
              style={{ width: `${(validationResults.valid / validationResults.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Records with Warnings</span>
            <span className="bg-amber-100 text-amber-800 font-medium py-1 px-3 rounded-full flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              {validationResults.warnings}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-amber-500 rounded-full" 
              style={{ width: `${(validationResults.warnings / validationResults.total) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Records with Errors</span>
            <span className="bg-red-100 text-red-800 font-medium py-1 px-3 rounded-full flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5" />
              {validationResults.errors}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-red-500 rounded-full" 
              style={{ width: `${(validationResults.errors / validationResults.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {validationResults.warnings > 0 && (
        <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-sm mb-4">
          <h4 className="font-medium text-amber-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Warning Details
          </h4>
          <ul className="mt-2 space-y-1 text-sm">
            {validationResults.warnings > 0 && (
              <li>Some email addresses may be invalid (missing @ symbol)</li>
            )}
            {fileData && mappings.find(m => m.targetField === 'homeowner_phone') && (
              <li>Some phone numbers may be in an incorrect format</li>
            )}
            {fileData && !mappings.find(m => m.targetField === 'unit_number') && (
              <li>Unit numbers not mapped for possible multi-unit properties</li>
            )}
          </ul>
        </div>
      )}
      
      {validationResults.errors > 0 && (
        <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-sm mb-4">
          <h4 className="font-medium text-red-800 flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Error Details
          </h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Some records are missing required fields (Association Name, Address, Phone, Email, or Total Units)</li>
            {fileData && mappings.some(m => m.targetField === 'association_email') && (
              <li>Some association email addresses are completely missing</li>
            )}
          </ul>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={() => onStepChange('mapping')} disabled={importing}>
          Back to Mapping
        </Button>
        <Button 
          onClick={handleFinalize} 
          disabled={validationResults.errors > 0 || importing}
          variant={validationResults.errors > 0 ? "outline" : "default"}
        >
          {importing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            validationResults.errors > 0 ? "Cannot Import with Errors" : "Finalize Import"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ValidationResults;
