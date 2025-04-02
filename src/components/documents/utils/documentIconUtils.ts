
import { FileText, FileImage, FilePdf, FileCode, FileSpreadsheet, File, FilePresentation } from 'lucide-react';

export const getDocumentIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Image files
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
    return <FileImage className="h-5 w-5 text-blue-500" />;
  }
  
  // PDF files
  if (extension === 'pdf') {
    return <FilePdf className="h-5 w-5 text-red-500" />;
  }
  
  // Office document files
  if (['doc', 'docx', 'rtf'].includes(extension)) {
    return <FileText className="h-5 w-5 text-blue-600" />;
  }
  
  // Spreadsheet files
  if (['xls', 'xlsx', 'csv'].includes(extension)) {
    return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
  }
  
  // Presentation files
  if (['ppt', 'pptx'].includes(extension)) {
    return <FilePresentation className="h-5 w-5 text-orange-500" />;
  }
  
  // Code or programming files
  if (['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'json', 'xml', 'md'].includes(extension)) {
    return <FileCode className="h-5 w-5 text-purple-500" />;
  }
  
  // Text files
  if (['txt', 'log'].includes(extension)) {
    return <FileText className="h-5 w-5 text-gray-600" />;
  }
  
  // Default file icon for unknown types
  return <File className="h-5 w-5 text-gray-500" />;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (e) {
    return 'Invalid date';
  }
};
