
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
};

export default LoadingState;
