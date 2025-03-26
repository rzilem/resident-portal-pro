
import React from 'react';

const AccessLevelsExplanation = () => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Document Access Levels Explained</h3>
      <div className="text-sm space-y-2">
        <p><span className="font-medium">All Users:</span> Accessible to everyone, including the homeowner portal</p>
        <p><span className="font-medium">Homeowners & Above:</span> Accessible to homeowners, board members, and staff</p>
        <p><span className="font-medium">Board Members & Above:</span> Accessible to board members and staff only</p>
        <p><span className="font-medium">Management Staff Only:</span> Accessible to property managers and administrators</p>
        <p><span className="font-medium">Administrators Only:</span> Accessible only to system administrators</p>
      </div>
    </div>
  );
};

export default AccessLevelsExplanation;
