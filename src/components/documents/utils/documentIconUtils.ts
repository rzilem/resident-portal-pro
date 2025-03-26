
import { FileText, FileSpreadsheet, FileImage, FileArchive, FileAudio, FileVideo } from 'lucide-react';
import React from 'react';

// Format date for display
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get document icon based on file extension
export const getDocumentIcon = (fileName: string): JSX.Element => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') {
    return React.createElement(FileText, { className: "h-4 w-4 text-red-500" });
  } else if (['doc', 'docx'].includes(extension || '')) {
    return React.createElement(FileText, { className: "h-4 w-4 text-blue-500" });
  } else if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
    return React.createElement(FileSpreadsheet, { className: "h-4 w-4 text-green-500" });
  } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
    return React.createElement(FileImage, { className: "h-4 w-4 text-purple-500" });
  } else if (['mp3', 'wav', 'ogg'].includes(extension || '')) {
    return React.createElement(FileAudio, { className: "h-4 w-4 text-yellow-500" });
  } else if (['mp4', 'webm', 'mov'].includes(extension || '')) {
    return React.createElement(FileVideo, { className: "h-4 w-4 text-pink-500" });
  } else if (['zip', 'rar', '7z'].includes(extension || '')) {
    return React.createElement(FileArchive, { className: "h-4 w-4 text-orange-500" });
  }
  
  return React.createElement(FileText, { className: "h-4 w-4 text-gray-500" });
};
