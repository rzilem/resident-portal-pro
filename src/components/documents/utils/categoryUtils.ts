
import React from 'react';
import { ShieldIcon, LockIcon, Users2Icon, UserCircleIcon } from 'lucide-react';
import { DocumentAccessLevel } from '@/types/documents';

// Function to get the appropriate security level icon
export const getAccessLevelIcon = (accessLevel?: DocumentAccessLevel) => {
  switch (accessLevel) {
    case 'admin':
      return <LockIcon className="h-3 w-3" />;
    case 'management':
      return <UserCircleIcon className="h-3 w-3" />;
    case 'board':
      return <Users2Icon className="h-3 w-3" />;
    case 'homeowner':
      return <ShieldIcon className="h-3 w-3" />;
    default:
      return null;
  }
};

// Function to get the human-readable label for an access level
export const getAccessLevelLabel = (accessLevel?: DocumentAccessLevel) => {
  switch (accessLevel) {
    case 'admin':
      return 'Administrators Only';
    case 'management':
      return 'Management Staff Only';
    case 'board':
      return 'Board Members & Above';
    case 'homeowner':
      return 'Homeowners & Above';
    case 'all':
    default:
      return 'All Users';
  }
};

// Function to get the CSS class for the security level
export const getSecurityLevelColor = (accessLevel?: DocumentAccessLevel) => {
  switch (accessLevel) {
    case 'admin':
      return 'text-red-600 border-red-200 bg-red-50';
    case 'management':
      return 'text-amber-600 border-amber-200 bg-amber-50';
    case 'board':
      return 'text-blue-600 border-blue-200 bg-blue-50';
    case 'homeowner':
      return 'text-green-600 border-green-200 bg-green-50';
    default:
      return 'text-muted-foreground';
  }
};

// Function to get folder icon color based on access level
export const getFolderIconColor = (accessLevel?: DocumentAccessLevel) => {
  switch (accessLevel) {
    case 'admin':
      return 'text-red-500';
    case 'management':
      return 'text-amber-500';
    case 'board':
      return 'text-blue-500';
    case 'homeowner':
      return 'text-green-500';
    default:
      return 'text-yellow-400';
  }
};
