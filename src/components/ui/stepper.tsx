
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepProps {
  label: string;
  completed?: boolean;
  active?: boolean;
  children?: React.ReactNode;
}

interface StepperProps {
  currentStep: number;
  children: React.ReactNode;
}

export const Step: React.FC<StepProps> = ({ 
  label, 
  completed = false, 
  active = false,
  children 
}) => {
  return (
    <div className="flex-1">
      <div className="flex items-center">
        <div className={cn(
          "rounded-full h-8 w-8 flex items-center justify-center transition-colors",
          completed ? "bg-primary text-primary-foreground" : 
            active ? "bg-primary/20 text-primary border-2 border-primary" : 
            "bg-muted text-muted-foreground"
        )}>
          {completed ? <Check className="h-4 w-4" /> : active ? null : null}
        </div>
        <div className={cn(
          "h-1 flex-1",
          completed ? "bg-primary" : "bg-muted"
        )}></div>
      </div>
      <div className="mt-2 text-center text-sm">
        <span className={cn(
          "font-medium",
          active || completed ? "text-primary" : "text-muted-foreground"
        )}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
};

export const Stepper: React.FC<StepperProps> = ({ currentStep, children }) => {
  // Ensure children is an array
  const childrenArray = React.Children.toArray(children);
  
  // Create a new array with the child elements and without the last connecting line
  const modifiedChildren = childrenArray.map((child, index) => {
    if (React.isValidElement(child)) {
      // For the last step, don't show the connecting line
      if (index === childrenArray.length - 1) {
        return React.cloneElement(child as React.ReactElement, {
          ...child.props,
          isLastStep: true
        });
      }
      return child;
    }
    return child;
  });

  return (
    <div className="w-full flex">
      {modifiedChildren.map((child, index) => {
        if (!React.isValidElement(child)) return null;
        
        // Calculate if the step is completed or active
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        
        // Remove the connector from the last step
        const isLastStep = index === modifiedChildren.length - 1;
        
        return (
          <div key={index} className="flex-1 relative">
            {React.cloneElement(child as React.ReactElement, {
              completed: isCompleted,
              active: isActive,
            })}
            
            {!isLastStep && (
              <div className={cn(
                "absolute top-4 left-8 right-0 h-1",
                isCompleted ? "bg-primary" : "bg-muted"
              )}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};
