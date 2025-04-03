
import { Badge } from '@/components/ui/badge';
import { DocumentAccessLevel } from '@/types/documents';
import { 
  FileText, 
  File, 
  Folder, 
  FileSpreadsheet, 
  Book, 
  Receipt, 
  Banknote, 
  ScrollText, 
  FileQuestion, 
  FileCheck,
  BarChart,
  Gavel
} from 'lucide-react';
import React from 'react';

/**
 * Get folder icon color by access level
 * @param accessLevel Access level to get color for
 * @returns React component for colored folder icon
 */
export const getFolderIconColorByAccessLevel = (accessLevel?: DocumentAccessLevel) => {
  switch (accessLevel) {
    case 'admin':
      return <Folder className="h-4 w-4 text-red-500" />;
    case 'management':
      return <Folder className="h-4 w-4 text-purple-500" />;
    case 'board':
      return <Folder className="h-4 w-4 text-blue-500" />;
    case 'homeowner':
      return <Folder className="h-4 w-4 text-green-500" />;
    case 'all':
      return <Folder className="h-4 w-4 text-yellow-400" />;
    default:
      return <Folder className="h-4 w-4 text-gray-500" />;
  }
};

/**
 * Render an access level badge with appropriate styling
 * @param accessLevel Access level to render
 * @returns JSX Element
 */
export const renderAccessLevelBadge = (accessLevel?: DocumentAccessLevel) => {
  let variant = 'outline';
  let className = '';
  let label = 'Everyone';
  
  switch (accessLevel) {
    case 'admin':
      className = 'bg-red-100 text-red-800 border-red-300';
      label = 'Admin Only';
      break;
    case 'management':
      className = 'bg-purple-100 text-purple-800 border-purple-300';
      label = 'Management';
      break;
    case 'board':
      className = 'bg-blue-100 text-blue-800 border-blue-300';
      label = 'Board Members';
      break;
    case 'homeowner':
      className = 'bg-green-100 text-green-800 border-green-300';
      label = 'Homeowners';
      break;
    case 'all':
      className = 'bg-yellow-100 text-yellow-800 border-yellow-300';
      label = 'Everyone';
      break;
  }
  
  return (
    <Badge variant={variant as any} className={className}>
      {label}
    </Badge>
  );
};

/**
 * Get appropriate icon component for document category
 */
export const getCategoryIcon = (category: string) => {
  // Default mapping based on category ID
  switch (category) {
    case 'financial':
      return <Banknote className="h-4 w-4" />;
    case 'legal':
      return <Gavel className="h-4 w-4" />;
    case 'meeting':
      return <ScrollText className="h-4 w-4" />;
    case 'maintenance':
      return <FileCheck className="h-4 w-4" />;
    case 'reports':
      return <BarChart className="h-4 w-4" />;
    case 'general':
      return <File className="h-4 w-4" />;
    default:
      return <Folder className="h-4 w-4" />;
  }
};

/**
 * Get appropriate color for a category's folder icon
 */
export const getFolderIconColor = (category: string): string => {
  // Default mapping
  switch(category) {
    case 'financial':
      return 'text-green-500';
    case 'legal':
      return 'text-blue-500';
    case 'meeting':
      return 'text-purple-500';
    case 'maintenance':
      return 'text-orange-500';
    case 'reports':
      return 'text-indigo-500';
    default:
      return 'text-gray-500';
  }
};
