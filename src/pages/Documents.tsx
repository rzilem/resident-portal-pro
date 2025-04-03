
import React from 'react';
import DocumentManager from '@/components/documents/DocumentManager';

const Documents = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Documents</h1>
      <DocumentManager />
    </div>
  );
};

export default Documents;
