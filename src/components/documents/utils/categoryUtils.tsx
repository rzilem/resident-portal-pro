
import React from 'react';
import { 
  LockIcon, 
  Users, 
  ShieldCheck, 
  Building, 
  User
} from 'lucide-react';
import { DocumentAccessLevel } from '@/types/documents';
import { Badge } from '@/components/ui/badge';

export const getAccessLevelIcon = (accessLevel: DocumentAccessLevel) => {
  switch (accessLevel) {
    case 'admin':
      return <LockIcon className="h-4 w-4" />;
    case 'management':
      return <Building className="h-4 w-4" />;
    case 'board':
      return <ShieldCheck className="h-4 w-4" />;
    case 'homeowner':
      return <User className="h-4 w-4" />;
    case 'all':
    default:
      return <Users className="h-4 w-4" />;
  }
};

export const getAccessLevelBadge = (accessLevel: DocumentAccessLevel) => {
  switch (accessLevel) {
    case 'admin':
      return (
        <Badge variant="destructive" className="ml-1 flex items-center gap-1">
          <LockIcon className="h-3 w-3" /> Admin
        </Badge>
      );
    case 'management':
      return (
        <Badge variant="secondary" className="ml-1 flex items-center gap-1">
          <Building className="h-3 w-3" /> Management
        </Badge>
      );
    case 'board':
      return (
        <Badge variant="outline" className="ml-1 flex items-center gap-1 border-amber-500 text-amber-700">
          <ShieldCheck className="h-3 w-3" /> Board
        </Badge>
      );
    case 'homeowner':
      return (
        <Badge variant="outline" className="ml-1 flex items-center gap-1">
          <User className="h-3 w-3" /> Homeowners
        </Badge>
      );
    case 'all':
    default:
      return (
        <Badge variant="outline" className="ml-1 flex items-center gap-1 border-green-500 text-green-700">
          <Users className="h-3 w-3" /> Public
        </Badge>
      );
  }
};

// Add the missing functions needed by CategoryItem.tsx
export const getAccessLevelLabel = (accessLevel: DocumentAccessLevel): string => {
  switch (accessLevel) {
    case 'admin':
      return 'Admin Only';
    case 'management':
      return 'Management';
    case 'board':
      return 'Board Members';
    case 'homeowner':
      return 'Homeowners';
    case 'all':
    default:
      return 'Public';
  }
};

export const getSecurityLevelColor = (accessLevel: DocumentAccessLevel): string => {
  switch (accessLevel) {
    case 'admin':
      return 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800';
    case 'management':
      return 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
    case 'board':
      return 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
    case 'homeowner':
      return 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
    case 'all':
    default:
      return 'bg-green-50 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
  }
};

export const getFolderIconColor = (accessLevel: DocumentAccessLevel): string => {
  switch (accessLevel) {
    case 'admin':
      return 'text-red-500';
    case 'management':
      return 'text-purple-500';
    case 'board':
      return 'text-amber-500';
    case 'homeowner':
      return 'text-blue-500';
    case 'all':
    default:
      return 'text-green-500';
  }
};
