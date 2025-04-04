
import React from 'react';
import { DocumentAccessLevel } from '@/types/documents';
import { Badge } from '@/components/ui/badge';
import { LockIcon, Shield, Users, UserIcon, FolderIcon } from 'lucide-react';
import { getSecurityLevelColor } from './categoryUtils';

// Get a colored folder icon for a document access level
export const getFolderIconColor = (accessLevel: DocumentAccessLevel): JSX.Element => {
  const colorClass = getSecurityLevelColor(accessLevel);
  return <FolderIcon className={`h-4 w-4 ${colorClass}`} />;
};

// Get a badge component for a document access level
export const getAccessLevelBadge = (accessLevel: DocumentAccessLevel): JSX.Element => {
  switch (accessLevel) {
    case 'all':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">All Users</Badge>;
    case 'homeowner':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Homeowners</Badge>;
    case 'board':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Board Members</Badge>;
    case 'management':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Management</Badge>;
    case 'admin':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Administrators</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Render a badge for document access level with icon
export const renderAccessLevelBadge = (accessLevel: DocumentAccessLevel): JSX.Element => {
  switch (accessLevel) {
    case 'admin':
      return <Badge variant="destructive" className="flex items-center gap-1"><LockIcon className="h-3 w-3" /> Admin Only</Badge>;
    case 'management':
      return <Badge variant="secondary" className="flex items-center gap-1"><UserIcon className="h-3 w-3" /> Management</Badge>;
    case 'board':
      return <Badge variant="default" className="flex items-center gap-1"><Shield className="h-3 w-3" /> Board</Badge>;
    case 'homeowner':
      return <Badge variant="outline" className="flex items-center gap-1"><Users className="h-3 w-3" /> Homeowner</Badge>;
    case 'all':
      return <Badge variant="outline" className="flex items-center gap-1">All Users</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};
