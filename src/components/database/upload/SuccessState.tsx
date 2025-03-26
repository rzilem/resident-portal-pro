
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SuccessStateProps {
  onReset: () => void;
  onClose?: () => void;
}

const SuccessState: React.FC<SuccessStateProps> = ({ onReset, onClose = () => {} }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-6">
      <div className="rounded-full bg-green-100 p-4 text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle className="h-12 w-12" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Upload Successful!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your data has been successfully processed and uploaded to the system.
        </p>
      </div>
      
      <div className="flex gap-4">
        <Button onClick={onReset} variant="outline">
          Upload More Files
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default SuccessState;
