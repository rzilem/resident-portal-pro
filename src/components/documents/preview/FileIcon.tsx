
import React from 'react';
import { 
  File, 
  FileText, 
  Image, 
  FileSpreadsheet, 
  FileCode, 
  FilePen, 
  FileArchive,
  FileVideo,
  FileAudio,
  File3d
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileIconProps {
  fileType: string;
  className?: string;
  size?: number;
}

const FileIcon: React.FC<FileIconProps> = ({ 
  fileType, 
  className,
  size = 36
}) => {
  const getIcon = () => {
    const type = fileType?.toLowerCase() || '';
    
    if (type.includes('pdf')) {
      return <FilePen size={size} className="text-red-500" />;
    } else if (type.includes('word') || type.includes('document')) {
      return <FileText size={size} className="text-blue-500" />;
    } else if (type.includes('excel') || type.includes('spreadsheet') || type.includes('csv')) {
      return <FileSpreadsheet size={size} className="text-green-500" />;
    } else if (type.includes('powerpoint') || type.includes('presentation')) {
      return <FileText size={size} className="text-orange-500" />;
    } else if (type.includes('image') || type.includes('png') || type.includes('jpeg') || type.includes('jpg') || type.includes('gif')) {
      return <Image size={size} className="text-purple-500" />;
    } else if (type.includes('text') || type.includes('txt')) {
      return <FileText size={size} className="text-gray-500" />;
    } else if (type.includes('code') || type.includes('json') || type.includes('xml') || type.includes('html')) {
      return <FileCode size={size} className="text-yellow-500" />;
    } else if (type.includes('zip') || type.includes('compressed') || type.includes('archive')) {
      return <FileArchive size={size} className="text-yellow-500" />;
    } else if (type.includes('video')) {
      return <FileVideo size={size} className="text-pink-500" />;
    } else if (type.includes('audio')) {
      return <FileAudio size={size} className="text-indigo-500" />;
    } else if (type.includes('3d') || type.includes('model')) {
      return <File3d size={size} className="text-blue-400" />;
    } else {
      return <File size={size} className="text-gray-500" />;
    }
  };
  
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {getIcon()}
    </div>
  );
};

export default FileIcon;
