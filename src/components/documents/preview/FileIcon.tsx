
import React from 'react';
import { 
  FileText, 
  Image, 
  File, 
  FileSpreadsheet,
  FileType,
  FileArchive,
  FileAudio,
  FileVideo,
  FileCode,
  FileCog
} from 'lucide-react';

interface FileIconProps {
  fileType: string;
  size?: number;
  className?: string;
}

const FileIcon: React.FC<FileIconProps> = ({ 
  fileType, 
  size = 24,
  className = ''
}) => {
  // Get file extension if it's not a MIME type
  const extension = fileType.includes('/') 
    ? fileType.split('/')[1] 
    : fileType.split('.').pop()?.toLowerCase();
  
  // Helper function to detect type category
  const isType = (exts: string[]): boolean => {
    if (!extension) return false;
    return exts.some(ext => extension.includes(ext));
  };
  
  // Return appropriate icon based on file type
  if (fileType.startsWith('image/') || isType(['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'])) {
    return <Image size={size} className={className} />;
  }
  
  if (fileType === 'application/pdf' || extension === 'pdf') {
    return <FileText size={size} className={className} />;
  }
  
  if (isType(['doc', 'docx', 'txt', 'rtf', 'odt'])) {
    return <FileText size={size} className={className} />;
  }
  
  if (isType(['xls', 'xlsx', 'csv', 'ods'])) {
    return <FileSpreadsheet size={size} className={className} />;
  }
  
  if (isType(['ppt', 'pptx', 'odp'])) {
    return <FileType size={size} className={className} />;
  }
  
  if (isType(['zip', 'rar', '7z', 'tar', 'gz'])) {
    return <FileArchive size={size} className={className} />;
  }
  
  if (fileType.startsWith('audio/') || isType(['mp3', 'wav', 'ogg', 'flac'])) {
    return <FileAudio size={size} className={className} />;
  }
  
  if (fileType.startsWith('video/') || isType(['mp4', 'avi', 'mov', 'webm'])) {
    return <FileVideo size={size} className={className} />;
  }
  
  if (isType(['html', 'css', 'js', 'json', 'xml', 'php', 'py', 'java', 'c', 'cpp', 'h'])) {
    return <FileCode size={size} className={className} />;
  }
  
  if (isType(['exe', 'dll', 'app', 'msi'])) {
    return <FileCog size={size} className={className} />;
  }
  
  // Default file icon
  return <File size={size} className={className} />;
};

export default FileIcon;
