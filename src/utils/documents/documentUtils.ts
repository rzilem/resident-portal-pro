
import { DocumentCategory, DocumentFile, DocumentAccessLevel } from '@/types/documents';
import { BarChart, FileText, FileCode, Calculator, FileSpreadsheet, Book, Receipt, Gavel, File, FileUp } from 'lucide-react';

/**
 * Format a date string to a human-readable format
 * @param dateString ISO date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return 'Invalid date';
  }
};

/**
 * Format file size to human-readable format
 * @param bytes File size in bytes
 * @returns Formatted string
 */
export const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null) return 'Unknown size';
  
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get information about a file type
 * @param fileType MIME type of the file
 * @returns Object with file type information
 */
export const getFileTypeInfo = (fileType: string) => {
  const type = fileType.toLowerCase();
  
  if (type.includes('pdf')) {
    return { icon: FileText, color: 'text-red-500', name: 'PDF' };
  } else if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) {
    return { icon: FileSpreadsheet, color: 'text-green-600', name: 'Spreadsheet' };
  } else if (type.includes('word') || type.includes('document')) {
    return { icon: FileText, color: 'text-blue-500', name: 'Document' };
  } else if (type.includes('image')) {
    return { icon: FileUp, color: 'text-purple-500', name: 'Image' };
  } else if (type.includes('audio')) {
    return { icon: File, color: 'text-yellow-500', name: 'Audio' };
  } else if (type.includes('video')) {
    return { icon: File, color: 'text-pink-500', name: 'Video' };
  } else if (type.includes('code') || type.includes('json') || type.includes('xml')) {
    return { icon: FileCode, color: 'text-gray-700', name: 'Code' };
  }
  
  return { icon: File, color: 'text-gray-500', name: 'File' };
};

/**
 * Get list of document categories
 * @returns Array of document categories
 */
export const getDocumentCategories = (): DocumentCategory[] => {
  return [
    {
      id: 'financial',
      name: 'Financial',
      description: 'Financial reports, budgets, and statements',
      icon: Calculator,
      color: 'text-green-600',
      accessLevel: 'management'
    },
    {
      id: 'legal',
      name: 'Legal',
      description: 'Legal documents, contracts, and agreements',
      icon: Gavel,
      color: 'text-blue-600',
      accessLevel: 'management'
    },
    {
      id: 'meeting',
      name: 'Meeting Minutes',
      description: 'Board meeting minutes and notes',
      icon: FileText,
      color: 'text-purple-600',
      accessLevel: 'board'
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      description: 'Maintenance reports and schedules',
      icon: FileUp,
      color: 'text-orange-600',
      accessLevel: 'board'
    },
    {
      id: 'reports',
      name: 'Reports',
      description: 'Various reports and analytics',
      icon: BarChart,
      color: 'text-indigo-600',
      accessLevel: 'management'
    },
    {
      id: 'general',
      name: 'General',
      description: 'General documents and files',
      icon: File,
      color: 'text-gray-600',
      accessLevel: 'all'
    }
  ];
};

/**
 * Get a specific document category by ID
 * @param categoryId ID of the category to retrieve
 * @returns The document category or undefined if not found
 */
export const getDocumentCategoryById = (categoryId?: string): DocumentCategory | undefined => {
  if (!categoryId) return undefined;
  return getDocumentCategories().find(category => category.id === categoryId);
};

/**
 * Format the document category with proper value and label properties
 * for use with selection components
 * @param categories List of document categories
 * @returns Formatted categories for dropdown selection
 */
export const formatCategoriesForSelection = (categories: DocumentCategory[]): DocumentCategory[] => {
  return categories.map(category => ({
    ...category,
    value: category.id,
    label: category.name
  }));
};

/**
 * Convert document access level to a string representation
 * @param level Access level
 * @returns Readable string
 */
export const accessLevelToString = (level?: DocumentAccessLevel): string => {
  switch (level) {
    case 'admin': return 'Admin Only';
    case 'management': return 'Management';
    case 'board': return 'Board Members';
    case 'homeowner': return 'Homeowners';
    case 'all': return 'Everyone';
    default: return 'Everyone';
  }
};

/**
 * Get appropriate CSS class for an access level
 * @param level Access level
 * @returns CSS class name
 */
export const getAccessLevelClass = (level?: DocumentAccessLevel): string => {
  switch (level) {
    case 'admin': return 'bg-red-100 text-red-800 border-red-300';
    case 'management': return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'board': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'homeowner': return 'bg-green-100 text-green-800 border-green-300';
    case 'all': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};
