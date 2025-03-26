
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, CircleDashed } from 'lucide-react';
import { STEPS } from '../constants';

interface WizardProgressProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (index: number) => void;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  const getStepStatus = (index: number) => {
    if (completedSteps.includes(index)) {
      return 'completed';
    }
    if (index === currentStep) {
      return 'current';
    }
    if (index <= Math.max(...completedSteps, -1) + 1) {
      return 'available';
    }
    return 'locked';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Progress</CardTitle>
        <CardDescription>
          {completedSteps.length}/{STEPS.length} steps completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {STEPS.map((step, index) => {
            const status = getStepStatus(index);
            const StepIcon = step.icon;
            
            return (
              <Button
                key={step.id}
                variant={status === 'current' ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => onStepClick(index)}
                disabled={status === 'locked'}
              >
                <div className="flex items-center w-full">
                  {status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  ) : status === 'current' ? (
                    <CircleDashed className="h-5 w-5 mr-2 text-primary" />
                  ) : (
                    <StepIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                  )}
                  <span>{step.label}</span>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${(completedSteps.length / STEPS.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {Math.round((completedSteps.length / STEPS.length) * 100)}% Complete
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

