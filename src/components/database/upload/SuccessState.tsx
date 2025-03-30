
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, FileCheck, RotateCcw, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SuccessStateProps {
  onReset: () => void;
  onClose: () => void;
  recordCount?: number;
  importType?: string;
}

const SuccessState: React.FC<SuccessStateProps> = ({ 
  onReset, 
  onClose,
  recordCount = 1,
  importType = 'association'
}) => {
  // Determine the destination based on import type
  const getDestinationUrl = () => {
    switch (importType) {
      case 'association':
        return '/associations';
      case 'property':
        return '/properties';
      case 'resident':
        return '/residents';
      default:
        return '/dashboard';
    }
  };
  
  // Get the destination label based on import type
  const getDestinationLabel = () => {
    switch (importType) {
      case 'association':
        return 'View Associations';
      case 'property':
        return 'View Properties';
      case 'resident':
        return 'View Residents';
      default:
        return 'View Dashboard';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Upload Successful!</h3>
        <p className="text-muted-foreground">
          Your data has been processed and imported into the system.
        </p>
      </div>
      
      <div className="w-full max-w-xs bg-muted/40 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Records Processed</span>
          <span className="font-semibold">{recordCount}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium">Status</span>
          <span className="flex items-center text-green-600 font-medium">
            <FileCheck className="h-4 w-4 mr-1" />
            Complete
          </span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          variant="outline" 
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Upload Another File</span>
        </Button>
        
        <Button 
          as={Link}
          to={getDestinationUrl()}
          className="flex items-center gap-2"
          variant="outline"
        >
          <ExternalLink className="h-4 w-4" />
          <span>{getDestinationLabel()}</span>
        </Button>
        
        <Button 
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          <span>Close</span>
        </Button>
      </div>
    </div>
  );
};

export default SuccessState;
