
import React from 'react';

const DocumentTableLoading: React.FC = () => {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-14 bg-muted rounded-md"></div>
      ))}
    </div>
  );
};

export default DocumentTableLoading;
