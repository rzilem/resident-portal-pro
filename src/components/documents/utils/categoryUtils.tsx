
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  FolderIcon, 
  FileTextIcon, 
  ImageIcon, 
  FileIcon,
  PieChartIcon,
  BookIcon,
  MapIcon,
  FileCheckIcon,
  ShieldIcon,
  UsersIcon,
  HomeIcon,
  BuildingIcon,
  SettingsIcon
} from 'lucide-react';
import { DocumentAccessLevel, DocumentCategory } from '@/types/documents';

// Common document categories for HOA management
export const commonCategories: DocumentCategory[] = [
  {
    id: 'governing-documents',
    name: 'Governing Documents',
    description: 'CC&Rs, Bylaws, Rules & Regulations',
    accessLevel: 'all',
    icon: 'book',
    color: 'blue'
  },
  {
    id: 'financial',
    name: 'Financial',
    description: 'Budgets, Financial Statements, Audits',
    accessLevel: 'management',
    icon: 'pie-chart',
    color: 'green'
  },
  {
    id: 'meeting-minutes',
    name: 'Meeting Minutes',
    description: 'Board and Annual Meeting Minutes',
    accessLevel: 'board',
    icon: 'file-text',
    color: 'purple'
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Legal Documents and Correspondence',
    accessLevel: 'management',
    icon: 'shield',
    color: 'red'
  },
  {
    id: 'architectural',
    name: 'Architectural',
    description: 'Architectural Guidelines and Applications',
    accessLevel: 'homeowner',
    icon: 'home',
    color: 'orange'
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    description: 'Maintenance Records and Schedules',
    accessLevel: 'management',
    icon: 'settings',
    color: 'yellow'
  },
  {
    id: 'contracts',
    name: 'Contracts',
    description: 'Vendor Contracts and Agreements',
    accessLevel: 'management',
    icon: 'file-check',
    color: 'indigo'
  },
  {
    id: 'insurance',
    name: 'Insurance',
    description: 'Insurance Policies and Claims',
    accessLevel: 'board',
    icon: 'shield',
    color: 'cyan'
  },
  {
    id: 'property-maps',
    name: 'Property Maps',
    description: 'Site Plans and Property Maps',
    accessLevel: 'homeowner',
    icon: 'map',
    color: 'lime'
  },
  {
    id: 'newsletters',
    name: 'Newsletters',
    description: 'Community Newsletters and Announcements',
    accessLevel: 'all',
    icon: 'file-text',
    color: 'pink'
  },
  {
    id: 'photos',
    name: 'Photos',
    description: 'Property and Event Photos',
    accessLevel: 'all',
    icon: 'image',
    color: 'rose'
  },
  {
    id: 'residents',
    name: 'Residents',
    description: 'Resident Documents and Forms',
    accessLevel: 'management',
    icon: 'users',
    color: 'sky'
  },
];

// Get category icon component based on category
export const getCategoryIcon = (category: DocumentCategory | string) => {
  const categoryId = typeof category === 'string' ? category : category.id;
  const iconName = typeof category === 'string' 
    ? commonCategories.find(c => c.id === categoryId)?.icon
    : category.icon;
  
  switch (iconName) {
    case 'book':
      return <BookIcon />;
    case 'pie-chart':
      return <PieChartIcon />;
    case 'file-text':
      return <FileTextIcon />;
    case 'shield':
      return <ShieldIcon />;
    case 'home':
      return <HomeIcon />;
    case 'settings':
      return <SettingsIcon />;
    case 'file-check':
      return <FileCheckIcon />;
    case 'map':
      return <MapIcon />;
    case 'image':
      return <ImageIcon />;
    case 'users':
      return <UsersIcon />;
    case 'building':
      return <BuildingIcon />;
    default:
      return <FolderIcon />;
  }
};

// Get category color class based on category
export const getCategoryColorClass = (category: DocumentCategory | string): string => {
  const categoryId = typeof category === 'string' ? category : category.id;
  const color = typeof category === 'string'
    ? commonCategories.find(c => c.id === categoryId)?.color
    : category.color;
  
  switch (color) {
    case 'blue':
      return 'text-blue-500 bg-blue-50';
    case 'green':
      return 'text-green-500 bg-green-50';
    case 'red':
      return 'text-red-500 bg-red-50';
    case 'yellow':
      return 'text-yellow-600 bg-yellow-50';
    case 'purple':
      return 'text-purple-500 bg-purple-50';
    case 'pink':
      return 'text-pink-500 bg-pink-50';
    case 'indigo':
      return 'text-indigo-500 bg-indigo-50';
    case 'orange':
      return 'text-orange-500 bg-orange-50';
    case 'cyan':
      return 'text-cyan-500 bg-cyan-50';
    case 'lime':
      return 'text-lime-600 bg-lime-50';
    case 'rose':
      return 'text-rose-500 bg-rose-50';
    case 'sky':
      return 'text-sky-500 bg-sky-50';
    default:
      return 'text-gray-500 bg-gray-50';
  }
};

// Render a badge with the access level label
export const renderAccessLevelBadge = (accessLevel: DocumentAccessLevel): JSX.Element => {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
  let label = 'All Users';
  
  switch (accessLevel) {
    case 'admin':
      variant = 'destructive';
      label = 'Admins Only';
      break;
    case 'management':
      variant = 'default';
      label = 'Management';
      break;
    case 'board':
      variant = 'secondary';
      label = 'Board Members';
      break;
    case 'homeowner':
      variant = 'outline';
      label = 'Homeowners';
      break;
    default:
      variant = 'outline';
      label = 'All Users';
  }
  
  return (
    <Badge variant={variant} className="ml-2">
      {label}
    </Badge>
  );
};
