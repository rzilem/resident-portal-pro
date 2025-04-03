
import { DocumentCategory, DocumentFile } from '@/types/documents';
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
      color: 'text-green-600'
    },
    {
      id: 'legal',
      name: 'Legal',
      description: 'Legal documents, contracts, and agreements',
      icon: Gavel,
      color: 'text-blue-600'
    },
    {
      id: 'meeting',
      name: 'Meeting Minutes',
      description: 'Board meeting minutes and notes',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      description: 'Maintenance reports and schedules',
      icon: FileUp,
      color: 'text-orange-600'
    },
    {
      id: 'reports',
      name: 'Reports',
      description: 'Various reports and analytics',
      icon: BarChart,
      color: 'text-indigo-600'
    },
    {
      id: 'general',
      name: 'General',
      description: 'General documents and files',
      icon: File,
      color: 'text-gray-600'
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
