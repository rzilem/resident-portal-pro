
import React from 'react';
import { 
  FileText, File, FileCode, 
  FileSpreadsheet, Image
} from "lucide-react";

// Helper function to determine icon based on file name or type
export const getDocumentIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch(extension) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <Image className="h-5 w-5 text-purple-500" />;
    case 'html':
    case 'css':
    case 'js':
    case 'ts':
    case 'json':
      return <FileCode className="h-5 w-5 text-yellow-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

// Format date for display
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
