
import React from 'react';
import { DocumentCategory } from '@/types/documents';
import { 
  FileText, 
  FileSpreadsheet, 
  Receipt, 
  Gavel, 
  Calendar, 
  Wrench,
  FileQuestion,
  Building,
  User,
  MessageSquare,
  ShieldAlert,
  Landmark
} from 'lucide-react';

/**
 * Get a list of document categories with their display properties
 */
export const getDocumentCategories = (): DocumentCategory[] => {
  return [
    {
      id: 'general',
      name: 'General Documents',
      description: 'General association documents',
      icon: FileText,
      color: 'bg-gray-100 text-gray-600'
    },
    {
      id: 'financial',
      name: 'Financial Documents',
      description: 'Budgets, financial statements, and reports',
      icon: Receipt,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'legal',
      name: 'Legal Documents',
      description: 'Bylaws, CC&Rs, rules and regulations',
      icon: Gavel,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'meeting',
      name: 'Meeting Minutes',
      description: 'Board meeting minutes and annual meeting notes',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      description: 'Maintenance plans and reports',
      icon: Wrench,
      color: 'bg-amber-100 text-amber-600'
    },
    {
      id: 'insurance',
      name: 'Insurance',
      description: 'Insurance policies and claims',
      icon: ShieldAlert,
      color: 'bg-sky-100 text-sky-600'
    },
    {
      id: 'architectural',
      name: 'Architectural',
      description: 'Architectural guidelines and applications',
      icon: Building,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 'resident',
      name: 'Resident Documents',
      description: 'Resident-specific information',
      icon: User,
      color: 'bg-rose-100 text-rose-600'
    },
    {
      id: 'communications',
      name: 'Communications',
      description: 'Newsletters and community announcements',
      icon: MessageSquare,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      id: 'taxes',
      name: 'Tax Documents',
      description: 'Tax returns and related documents',
      icon: Landmark,
      color: 'bg-slate-100 text-slate-600'
    },
    {
      id: 'contracts',
      name: 'Contracts',
      description: 'Vendor contracts and agreements',
      icon: FileSpreadsheet,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'other',
      name: 'Other',
      description: 'Miscellaneous documents',
      icon: FileQuestion,
      color: 'bg-neutral-100 text-neutral-600'
    }
  ];
};

/**
 * Get a category object by ID
 */
export const getCategoryById = (categoryId: string): DocumentCategory | undefined => {
  return getDocumentCategories().find(category => category.id === categoryId);
};

/**
 * Get the icon component for a category
 */
export const getCategoryIcon = (categoryId: string): React.ReactNode => {
  const category = getCategoryById(categoryId);
  if (!category || !category.icon) {
    return <FileText />;
  }
  const IconComponent = category.icon;
  return <IconComponent />;
};

/**
 * Get color class for a category
 */
export const getCategoryColorClass = (categoryId: string): string => {
  const category = getCategoryById(categoryId);
  if (!category || !category.color) {
    return 'bg-gray-100 text-gray-600';
  }
  return category.color;
};

/**
 * Get the folder icon color for a specific folder/category
 */
export const getFolderIconColor = (categoryId: string): string => {
  const category = getCategoryById(categoryId);
  if (!category) {
    return 'text-gray-400';
  }

  switch (categoryId) {
    case 'financial':
      return 'text-green-500';
    case 'legal':
      return 'text-blue-500';
    case 'meeting':
      return 'text-purple-500';
    case 'maintenance':
      return 'text-amber-500';
    case 'insurance':
      return 'text-sky-500';
    case 'architectural':
      return 'text-indigo-500';
    case 'resident':
      return 'text-rose-500';
    case 'communications':
      return 'text-emerald-500';
    case 'taxes':
      return 'text-slate-500';
    case 'contracts':
      return 'text-orange-500';
    default:
      return 'text-gray-400';
  }
};
