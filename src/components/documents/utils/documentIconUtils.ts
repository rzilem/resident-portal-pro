
import { FileIcon, FileSpreadsheetIcon, FileTextIcon, FileZipIcon, FileImageIcon, FileVideoIcon, FileAudioIcon, FilePresentationIcon } from 'lucide-react';
import React from 'react';

export const getDocumentIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'pdf':
      return <FileTextIcon className="h-4 w-4 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileTextIcon className="h-4 w-4 text-blue-500" />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheetIcon className="h-4 w-4 text-green-500" />;
    case 'ppt':
    case 'pptx':
      return <FilePresentationIcon className="h-4 w-4 text-orange-500" />;
    case 'zip':
    case 'rar':
    case '7z':
      return <FileZipIcon className="h-4 w-4 text-purple-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
      return <FileImageIcon className="h-4 w-4 text-pink-500" />;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
      return <FileVideoIcon className="h-4 w-4 text-indigo-500" />;
    case 'mp3':
    case 'wav':
    case 'ogg':
      return <FileAudioIcon className="h-4 w-4 text-yellow-500" />;
    default:
      return <FileIcon className="h-4 w-4 text-gray-500" />;
  }
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};
