
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface SuccessStateProps {
  onReset: () => void;
  onClose: () => void;
}

const SuccessState = ({ onReset, onClose }: SuccessStateProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-muted rounded-lg p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="font-medium text-lg">Upload Complete!</h3>
        <p className="text-muted-foreground mt-1">
          Your data has been successfully imported.
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onReset}>
          Upload Another
        </Button>
        <Button onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
};

export default SuccessState;
