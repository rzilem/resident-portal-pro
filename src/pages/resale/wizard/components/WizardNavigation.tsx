
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  isLoading,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={currentStep === 0 || isLoading}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      <Button onClick={onNext} disabled={isLoading}>
        {isLoading ? (
          <>
            <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : currentStep === totalSteps - 1 ? (
          <>Finish</>
        ) : (
          <>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};
