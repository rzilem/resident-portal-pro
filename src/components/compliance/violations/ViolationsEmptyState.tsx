
import React from 'react';

interface ViolationsEmptyStateProps {
  message: string;
}

const ViolationsEmptyState: React.FC<ViolationsEmptyStateProps> = ({ message }) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default ViolationsEmptyState;
