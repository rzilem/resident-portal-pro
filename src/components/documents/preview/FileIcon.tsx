
import React from 'react';
import { FileText, FileImage, FilePdf, FileSpreadsheet, FileCode } from 'lucide-react';

interface FileIconProps {
  fileType: string;
  className?: string;
}

const FileIcon: React.FC<FileIconProps> = ({ fileType, className = "h-10 w-10" }) => {
  const type = fileType.toLowerCase();
  
  if (type.includes('pdf')) {
    return <FilePdf className={`${className} text-red-500`} />;
  } else if (
    type.includes('image') || 
    type.includes('jpg') || 
    type.includes('jpeg') || 
    type.includes('png') || 
    type.includes('gif') ||
    type.includes('svg')
  ) {
    return <FileImage className={`${className} text-blue-500`} />;
  } else if (
    type.includes('excel') || 
    type.includes('spreadsheet') || 
    type.includes('csv') ||
    type.includes('xlsx') ||
    type.includes('xls')
  ) {
    return <FileSpreadsheet className={`${className} text-green-600`} />;
  } else if (
    type.includes('code') || 
    type.includes('json') || 
    type.includes('xml') || 
    type.includes('html') || 
    type.includes('css') || 
    type.includes('javascript')
  ) {
    return <FileCode className={`${className} text-yellow-500`} />;
  } else {
    return <FileText className={`${className} text-gray-500`} />;
  }
};

export default FileIcon;
