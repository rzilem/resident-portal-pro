
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  onComplete: (results: { recordsImported: number, recordsWithWarnings: number }) => void;
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
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('summary');
  
  console.log("Validation Results component loaded with:", validationResults);

  const handleImport = async () => {
    if (!fileData || !validationResults) {
      toast.error("No data to import");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Starting import with", fileData.rows.length, "records");
      
      // Get mapped fields
      const mappedFields = mappings
        .filter(mapping => mapping.targetField !== 'ignore')
        .map(mapping => mapping.targetField);
      
      console.log("Mapped fields:", mappedFields);
      
      // Directly use the original data and let importData handle the mapping
      const result = await importData({
        records: fileData.rows,
        mappings,
        fileName,
        importType
      });
      
      console.log("Import result:", result);
      
      if (result.success) {
        toast.success(
          `Import completed successfully! ${result.recordsImported} records imported.`
        );
        onComplete({
          recordsImported: result.recordsImported,
          recordsWithWarnings: result.recordsWithWarnings
        });
      } else {
        console.error("Import failed:", result.errorMessage);
        toast.error(`Import failed: ${result.errorMessage || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!validationResults) {
    return <div>No validation results available</div>;
  }

  const validPercentage = 
    validationResults.total > 0 ? 
    (validationResults.valid / validationResults.total) * 100 : 0;
  
  const warningPercentage = 
    validationResults.total > 0 ? 
    (validationResults.warnings / validationResults.total) * 100 : 0;
  
  const errorPercentage = 
    validationResults.total > 0 ? 
    (validationResults.errors / validationResults.total) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Validation Results</h3>
          <p className="text-sm text-muted-foreground">
            Review the data validation results before importing
          </p>
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-md space-y-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Total Records:</span>
            <span className="font-bold">{validationResults.total}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-bold">{validationResults.valid}</span>
              </div>
              <span className="text-xs text-muted-foreground">Valid</span>
            </div>
            
            <div>
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">{validationResults.warnings}</span>
              </div>
              <span className="text-xs text-muted-foreground">Warnings</span>
            </div>
            
            <div>
              <div className="flex items-center justify-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="font-bold">{validationResults.errors}</span>
              </div>
              <span className="text-xs text-muted-foreground">Errors</span>
            </div>
          </div>
        </div>
        
        <Progress className="h-2" value={validPercentage} />
        
        <div className="flex gap-2 justify-center text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span>Valid ({Math.round(validPercentage)}%)</span>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            <span>Warnings ({Math.round(warningPercentage)}%)</span>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            <span>Errors ({Math.round(errorPercentage)}%)</span>
          </div>
        </div>
      </div>

      {validationResults.errors > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Issues Found</AlertTitle>
          <AlertDescription>
            {validationResults.errors} records have errors that will prevent importing.
            Please go back to check your mappings or fix the source data.
          </AlertDescription>
        </Alert>
      )}
      
      {validationResults.errors === 0 && validationResults.warnings > 0 && (
        <Alert className="border-yellow-500 bg-yellow-50 text-yellow-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Minor Issues Found</AlertTitle>
          <AlertDescription>
            {validationResults.warnings} records have warnings but can still be imported.
          </AlertDescription>
        </Alert>
      )}
      
      {validationResults.errors === 0 && validationResults.warnings === 0 && (
        <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Data Looks Good</AlertTitle>
          <AlertDescription>
            All {validationResults.valid} records are valid and ready to import.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="data">Data Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4 pt-4">
          <div className="border rounded-lg p-4 bg-background">
            <h4 className="font-medium mb-2">Import Information</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="font-medium">Import Type:</span>
                <span className="capitalize">{importType}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium">Mapped Fields:</span>
                <span>{mappings.filter(m => m.targetField !== 'ignore').length}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium">Valid Records:</span>
                <span>{validationResults.valid + validationResults.warnings}</span>
              </li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4 pt-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    {mappings
                      .filter(mapping => mapping.targetField !== 'ignore')
                      .map((mapping, index) => (
                        <th 
                          key={index}
                          className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          {mapping.targetField}
                        </th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {fileData && fileData.rows.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {mappings
                        .filter(mapping => mapping.targetField !== 'ignore')
                        .map((mapping, cellIndex) => (
                          <td 
                            key={cellIndex}
                            className="px-4 py-2 text-sm"
                          >
                            {String(row[mapping.sourceField] || '')}
                          </td>
                        ))
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {fileData && fileData.rows.length > 5 && (
              <div className="p-2 text-center text-sm text-muted-foreground">
                Showing 5 of {fileData.rows.length} records
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => onStepChange('mapping')}
          disabled={loading}
          type="button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mapping
        </Button>
        
        <Button
          onClick={handleImport}
          disabled={loading || validationResults.errors > 0}
          type="button"
        >
          {loading ? 'Importing...' : 'Import Data'}
        </Button>
      </div>
    </div>
  );
};

export default ValidationResults;
