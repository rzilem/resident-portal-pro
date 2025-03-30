
import React from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';

export const getFileIcon = (fileType: string): React.ReactElement => {
  if (fileType.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
  if (fileType.includes('word') || fileType.includes('docx')) return <FileText className="h-4 w-4 text-blue-500" />;
  if (fileType.includes('excel') || fileType.includes('xlsx')) return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
  return <FileText className="h-4 w-4 text-gray-500" />;
};
