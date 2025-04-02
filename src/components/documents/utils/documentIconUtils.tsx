
import React from 'react';
import { 
  FileText, File, FileCode, 
  FileSpreadsheet, Image, 
  FileDigit, Presentation // Changed from FilePdf and FilePresentation
} from "lucide-react";

// Helper function to determine icon based on file name or type
export const getDocumentIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Image files
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
    return <Image className="h-5 w-5 text-purple-500" />;
  }
  
  // PDF files
  if (extension === 'pdf') {
    return <FileDigit className="h-5 w-5 text-red-500" />; // Changed from FilePdf
  }
  
  // Office document files
  if (['doc', 'docx', 'rtf'].includes(extension)) {
    return <FileText className="h-5 w-5 text-blue-600" />;
  }
  
  // Spreadsheet files
  if (['xls', 'xlsx', 'csv'].includes(extension)) {
    return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
  }
  
  // Presentation files
  if (['ppt', 'pptx'].includes(extension)) {
    return <Presentation className="h-5 w-5 text-orange-500" />; // Changed from FilePresentation
  }
  
  // Code or programming files
  if (['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'json', 'xml', 'md'].includes(extension)) {
    return <FileCode className="h-5 w-5 text-yellow-500" />;
  }
  
  // Text files
  if (['txt', 'log'].includes(extension)) {
    return <FileText className="h-5 w-5 text-gray-600" />;
  }
  
  // Default file icon for unknown types
  return <File className="h-5 w-5 text-gray-500" />;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return 'Invalid date';
  }
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
