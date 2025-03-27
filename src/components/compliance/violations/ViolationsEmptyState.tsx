
import React from 'react';
import { FileQuestion } from 'lucide-react';

interface ViolationsEmptyStateProps {
  message: string;
}

const ViolationsEmptyState: React.FC<ViolationsEmptyStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
      <h3 className="text-lg font-medium mb-2">No Violations Found</h3>
      <p className="text-muted-foreground max-w-md">{message}</p>
    </div>
  );
};

export default ViolationsEmptyState;
