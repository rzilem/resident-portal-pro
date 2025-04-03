
import { Badge } from '@/components/ui/badge';
import { DocumentCategory, DocumentAccessLevel } from '@/types/documents';
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

/**
 * Get appropriate icon component for document category
 * @param category Category to get icon for
 * @returns React component for the icon
 */
export const getCategoryIcon = (category: DocumentCategory) => {
  if (category.icon) {
    return category.icon;
  }
  
  // Default mapping based on category ID
  switch (category.id) {
    case 'financial':
      return Banknote;
    case 'legal':
      return Gavel;
    case 'meeting':
      return ScrollText;
    case 'maintenance':
      return FileCheck;
    case 'reports':
      return BarChart;
    case 'general':
      return File;
    default:
      return Folder;
  }
};

/**
 * Get appropriate color for a category's folder icon
 * @param category Category to get color for
 * @returns Tailwind CSS color class
 */
export const getFolderIconColor = (category: DocumentCategory): string => {
  if (category.color) {
    return category.color;
  }
  
  // Default mapping
  switch(category.id) {
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

/**
 * Get folder icon color by access level
 * @param accessLevel Access level to get color for
 * @returns Tailwind CSS color class
 */
export const getFolderIconColorByAccessLevel = (accessLevel?: DocumentAccessLevel): string => {
  switch (accessLevel) {
    case 'admin':
      return 'text-red-500';
    case 'management':
      return 'text-purple-500';
    case 'board':
      return 'text-blue-500';
    case 'homeowner':
      return 'text-green-500';
    case 'all':
      return 'text-yellow-400';
    default:
      return 'text-gray-500';
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
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};
