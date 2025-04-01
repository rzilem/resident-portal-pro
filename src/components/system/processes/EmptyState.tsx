
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipButton } from '@/components/ui/tooltip-button';

interface EmptyStateProps {
  onCreateNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Plus className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No scheduled processes</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Create your first scheduled process to automate recurring tasks in your system.
      </p>
      <TooltipButton
        tooltipText="Create your first scheduled process"
        onClick={onCreateNew}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Process
      </TooltipButton>
    </div>
  );
};

export default EmptyState;
