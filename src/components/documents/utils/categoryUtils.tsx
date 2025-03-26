
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
