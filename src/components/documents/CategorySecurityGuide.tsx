
import React from 'react';
import { InfoIcon, FolderIcon } from 'lucide-react';

const CategorySecurityGuide = () => {
  return (
    <div className="bg-muted/30 rounded-md p-3 text-xs">
      <div className="font-medium mb-2 flex items-center gap-1">
        <InfoIcon className="h-3.5 w-3.5" />
        <span>Access Levels</span>
      </div>
      <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
        <div className="flex items-center gap-1.5">
          <FolderIcon className="h-4 w-4 text-yellow-400" />
          <span>All Users</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FolderIcon className="h-4 w-4 text-green-500" />
          <span>Homeowners</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FolderIcon className="h-4 w-4 text-blue-500" />
          <span>Board Members</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FolderIcon className="h-4 w-4 text-purple-500" />
          <span>Management</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FolderIcon className="h-4 w-4 text-red-500" />
          <span>Administrators</span>
        </div>
      </div>
    </div>
  );
};

export default CategorySecurityGuide;
