
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SuccessStateProps {
  onReset: () => void;
  onClose: () => void;
  message?: string;
  details?: string;
}

const SuccessState: React.FC<SuccessStateProps> = ({ 
  onReset, 
  onClose,
  message = "Data imported successfully",
  details = "Your data has been processed and added to the system"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
      <div className="rounded-full bg-green-100 p-3">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-green-700">
          {message}
        </h3>
        <p className="text-muted-foreground">
          {details}
        </p>
      </div>
      
      <div className="flex space-x-4">
        <Button onClick={onReset} variant="outline">
          Import More Data
        </Button>
        <Button onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
};

export default SuccessState;
