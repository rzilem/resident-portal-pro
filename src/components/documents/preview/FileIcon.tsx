
import React from 'react';
import { FileText, FileImage, FileCode, FileSpreadsheet, File, Presentation } from 'lucide-react';

interface FileIconProps {
  fileType: string;
  className?: string;
}

const FileIcon: React.FC<FileIconProps> = ({ fileType, className = "h-10 w-10 text-muted-foreground" }) => {
  // Normalize file type
  const normalizedType = fileType ? fileType.toLowerCase() : '';
  
  // Determine icon based on file type or extension
  if (
    normalizedType.includes('image') || 
    normalizedType.includes('jpg') || 
    normalizedType.includes('jpeg') || 
    normalizedType.includes('png') || 
    normalizedType.includes('gif') || 
    normalizedType.includes('svg') || 
    normalizedType.includes('webp')
  ) {
    return <FileImage className={className} />;
  }
  
  if (normalizedType.includes('pdf')) {
    return <FileText className={`${className} text-red-500`} />; // Use FileText for PDF
  }
  
  if (
    normalizedType.includes('excel') || 
    normalizedType.includes('spreadsheet') || 
    normalizedType.includes('csv')
  ) {
    return <FileSpreadsheet className={className} />;
  }
  
  if (
    normalizedType.includes('powerpoint') || 
    normalizedType.includes('presentation')
  ) {
    return <Presentation className={className} />; // Changed from FilePresentation
  }
  
  if (
    normalizedType.includes('code') || 
    normalizedType.includes('json') || 
    normalizedType.includes('xml') || 
    normalizedType.includes('html') || 
    normalizedType.includes('css') || 
    normalizedType.includes('javascript')
  ) {
    return <FileCode className={className} />;
  }
  
  if (
    normalizedType.includes('text') || 
    normalizedType.includes('doc') || 
    normalizedType.includes('word')
  ) {
    return <FileText className={className} />;
  }
  
  return <File className={className} />;
};

export default FileIcon;
