
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  submitting: boolean;
  disableNext?: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  isFirstStep,
  isLastStep,
  onBack,
  onNext,
  onSubmit,
  submitting,
  disableNext
}) => {
  return (
    <div className="flex justify-between">
      {!isFirstStep && (
        <Button 
          onClick={onBack} 
          variant="outline"
        >
          Back
        </Button>
      )}
      
      {!isLastStep ? (
        <Button 
          onClick={onNext}
          className="ml-auto"
          disabled={disableNext}
        >
          Continue
        </Button>
      ) : (
        <Button 
          onClick={onSubmit}
          className="ml-auto"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </Button>
      )}
    </div>
  );
};

export default WizardNavigation;
