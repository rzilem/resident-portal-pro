
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  const progressPercentage = (currentStep / (totalSteps - 1)) * 100;
  
  return (
    <div className="space-y-2">
      <Progress value={progressPercentage} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progressPercentage)}% Complete</span>
      </div>
    </div>
  );
};
