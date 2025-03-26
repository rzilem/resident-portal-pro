
import { DocumentAccessLevel } from '@/types/documents';
import { Badge } from '@/components/ui/badge';
import { LockIcon, Shield, Users, UserIcon } from 'lucide-react';

// Get the label for a document access level
export const getAccessLevelLabel = (accessLevel: DocumentAccessLevel): string => {
  switch (accessLevel) {
    case 'all':
      return 'All Users';
    case 'homeowner':
      return 'Homeowners & Above';
    case 'board':
      return 'Board Members & Above';
    case 'management':
      return 'Management Staff Only';
    case 'admin':
      return 'Administrators Only';
    default:
      return 'Unknown';
  }
};

// Get a color for a security level (used for folder icons, badges, etc)
export const getSecurityLevelColor = (accessLevel: DocumentAccessLevel): string => {
  switch (accessLevel) {
    case 'all':
      return 'text-yellow-400';
    case 'homeowner':
      return 'text-green-500';
    case 'board':
      return 'text-blue-500';
    case 'management':
      return 'text-purple-500';
    case 'admin':
      return 'text-red-500';
    default:
      return 'text-gray-400';
  }
};
