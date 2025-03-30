
import React from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';

/**
 * Returns an icon component based on file type
 */
export const getFileIcon = (fileType: string): React.ReactElement => {
  if (fileType.includes('pdf')) {
    return <FileText className="h-4 w-4 text-red-500" />;
  }
  if (fileType.includes('word') || fileType.includes('docx')) {
    return <FileText className="h-4 w-4 text-blue-500" />;
  }
  if (fileType.includes('excel') || fileType.includes('xlsx')) {
    return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
  }
  return <FileText className="h-4 w-4 text-gray-500" />;
};

/**
 * Returns an icon component based on document name
 * Alternative to getFileIcon that works with file names
 */
export const getDocumentIcon = (fileName: string): React.ReactElement => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (extension === 'pdf') {
    return <FileText className="h-4 w-4 text-red-500" />;
  }
  if (extension === 'doc' || extension === 'docx') {
    return <FileText className="h-4 w-4 text-blue-500" />;
  }
  if (extension === 'xls' || extension === 'xlsx') {
    return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
  }
  return <FileText className="h-4 w-4 text-gray-500" />;
};

/**
 * Format a date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format file size from bytes to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

