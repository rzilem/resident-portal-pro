
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

const FormError = ({ message, className, ...props }: FormErrorProps) => {
  if (!message) return null;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 text-destructive text-sm mt-1.5", 
        className
      )}
      {...props}
    >
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};

export { FormError };
