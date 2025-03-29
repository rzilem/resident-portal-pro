
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormSuccessProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

const FormSuccess = ({ message, className, ...props }: FormSuccessProps) => {
  if (!message) return null;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 text-green-600 text-sm mt-1.5", 
        className
      )}
      {...props}
    >
      <CheckCircle2 className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};

export { FormSuccess };
