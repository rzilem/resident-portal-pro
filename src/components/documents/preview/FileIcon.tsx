
import React from 'react';
import { 
  FileText, 
  FilePdf, 
  FileImage, 
  FileSpreadsheet, 
  FileArchive,
  FileCode,
  File,
  Calendar,
  Presentation
} from 'lucide-react';

export interface FileIconProps {
  fileType: string;
  className?: string;
}

const FileIcon: React.FC<FileIconProps> = ({ fileType, className = "h-6 w-6" }) => {
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
    type.includes('xlsx') || 
    type.includes('xls') || 
    type.includes('csv')
  ) {
    return <FileSpreadsheet className={`${className} text-green-600`} />;
  } else if (
    type.includes('zip') || 
    type.includes('archive') || 
    type.includes('rar') || 
    type.includes('tar') || 
    type.includes('gz')
  ) {
    return <FileArchive className={`${className} text-amber-600`} />;
  } else if (
    type.includes('html') || 
    type.includes('css') || 
    type.includes('js') || 
    type.includes('json') || 
    type.includes('xml')
  ) {
    return <FileCode className={`${className} text-purple-600`} />;
  } else if (
    type.includes('word') || 
    type.includes('doc') || 
    type.includes('docx') || 
    type.includes('text')
  ) {
    return <FileText className={`${className} text-blue-700`} />;
  } else if (
    type.includes('powerpoint') || 
    type.includes('presentation') || 
    type.includes('ppt') || 
    type.includes('pptx')
  ) {
    return <Presentation className={`${className} text-orange-500`} />;
  } else if (
    type.includes('ical') || 
    type.includes('calendar') || 
    type.includes('ics')
  ) {
    return <Calendar className={`${className} text-teal-600`} />;
  }
  
  // Default
  return <File className={`${className} text-gray-500`} />;
};

export default FileIcon;
