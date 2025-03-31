
import React from 'react';
import { 
  FileText, FileSpreadsheet, FileImage, FileCode, FileArchive 
} from 'lucide-react';

interface FileIconProps {
  fileType: string;
  size?: 'sm' | 'md' | 'lg';
}

const FileIcon: React.FC<FileIconProps> = ({ fileType, size = 'lg' }) => {
  const lowerType = fileType.toLowerCase();
  
  // Determine icon size in pixels
  const sizeClass = size === 'sm' ? 'h-8 w-8' : size === 'md' ? 'h-12 w-12' : 'h-16 w-16';
  
  if (lowerType.includes('pdf')) {
    return <FileText className={`${sizeClass} text-red-500`} />;
  } else if (lowerType.includes('xls') || lowerType.includes('csv') || lowerType.includes('sheet')) {
    return <FileSpreadsheet className={`${sizeClass} text-green-500`} />;
  } else if (lowerType.includes('doc') || lowerType.includes('word')) {
    return <FileText className={`${sizeClass} text-blue-500`} />;
  } else if (lowerType.includes('ppt') || lowerType.includes('presentation')) {
    return <FileCode className={`${sizeClass} text-orange-500`} />;
  } else if (
    lowerType.includes('image') || 
    lowerType.includes('png') || 
    lowerType.includes('jpg') || 
    lowerType.includes('jpeg') || 
    lowerType.includes('gif')
  ) {
    return <FileImage className={`${sizeClass} text-purple-500`} />;
  } else if (lowerType.includes('html') || lowerType.includes('xml') || lowerType.includes('json')) {
    return <FileCode className={`${sizeClass} text-gray-500`} />;
  } else {
    return <FileText className={`${sizeClass} text-gray-500`} />;
  }
};

export default FileIcon;
