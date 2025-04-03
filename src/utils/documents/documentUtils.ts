
import { DocumentFile } from '@/types/documents';

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Get file information based on file type
export const getFileTypeInfo = (fileType: string, fileName: string) => {
  const extensionMatch = fileName.match(/\.([^.]+)$/);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : '';
  
  // Determine icon and color based on file type or extension
  const getIconAndColor = () => {
    if (fileType.includes('pdf') || extension === 'pdf') {
      return { icon: 'pdf', color: 'text-red-500' };
    } else if (fileType.includes('word') || ['doc', 'docx'].includes(extension)) {
      return { icon: 'word', color: 'text-blue-500' };
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet') || ['xls', 'xlsx', 'csv'].includes(extension)) {
      return { icon: 'excel', color: 'text-green-500' };
    } else if (fileType.includes('powerpoint') || fileType.includes('presentation') || ['ppt', 'pptx'].includes(extension)) {
      return { icon: 'powerpoint', color: 'text-orange-500' };
    } else if (fileType.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
      return { icon: 'image', color: 'text-purple-500' };
    } else if (fileType.includes('text') || ['txt', 'md', 'rtf'].includes(extension)) {
      return { icon: 'text', color: 'text-gray-500' };
    } else if (fileType.includes('zip') || fileType.includes('compressed') || ['zip', 'rar', '7z', 'tar'].includes(extension)) {
      return { icon: 'archive', color: 'text-yellow-500' };
    } else {
      return { icon: 'file', color: 'text-gray-500' };
    }
  };
  
  const { icon, color } = getIconAndColor();
  
  return {
    icon,
    color,
    extension: extension || 'unknown'
  };
};

// Check if document is previewable in browser
export const isPreviewable = (document: DocumentFile): boolean => {
  const { fileType, name } = document;
  
  // Images
  if (
    fileType?.includes('image') || 
    name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)
  ) {
    return true;
  }
  
  // PDFs
  if (
    fileType?.includes('pdf') || 
    name.match(/\.pdf$/i)
  ) {
    return true;
  }
  
  // Text files
  if (
    fileType?.includes('text') || 
    name.match(/\.(txt|md|json|yaml|yml|xml|html|htm|css|js|ts|jsx|tsx)$/i)
  ) {
    return true;
  }
  
  return false;
};

// Check if document can use Office online viewer
export const canUseOfficeViewer = (document: DocumentFile): boolean => {
  const { fileType, name } = document;
  
  return (
    fileType?.includes('word') ||
    fileType?.includes('excel') ||
    fileType?.includes('powerpoint') ||
    fileType?.includes('spreadsheet') ||
    fileType?.includes('presentation') ||
    name.match(/\.(doc|docx|ppt|pptx|xls|xlsx)$/i) !== null
  );
};

// Document categories
export const getDocumentCategories = () => [
  { value: 'general', label: 'General' },
  { value: 'financial', label: 'Financial' },
  { value: 'legal', label: 'Legal' },
  { value: 'meeting-minutes', label: 'Meeting Minutes' },
  { value: 'bylaws', label: 'Bylaws & Regulations' },
  { value: 'projects', label: 'Projects' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'communications', label: 'Communications' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'contracts', label: 'Contracts' },
  { value: 'vendor', label: 'Vendor Information' },
  { value: 'resident', label: 'Resident Information' },
  { value: 'templates', label: 'Templates' },
  { value: 'architectural', label: 'Architectural' },
  { value: 'other', label: 'Other' }
];

// Sanitize document URL for security
export const sanitizeDocumentUrl = (url: string | null): string => {
  if (!url) return '';
  // Ensure URL is properly formatted
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
};

// Get document by ID 
export const getDocumentById = (
  documents: DocumentFile[], 
  id: string
): DocumentFile | undefined => {
  return documents.find(doc => doc.id === id);
};

// Filter documents by search term
export const filterDocumentsBySearch = (
  documents: DocumentFile[],
  searchTerm: string
): DocumentFile[] => {
  if (!searchTerm) return documents;
  
  const normalizedSearch = searchTerm.toLowerCase();
  
  return documents.filter(doc => 
    doc.name.toLowerCase().includes(normalizedSearch) ||
    (doc.description && doc.description.toLowerCase().includes(normalizedSearch)) ||
    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(normalizedSearch)))
  );
};

// Filter documents by category
export const filterDocumentsByCategory = (
  documents: DocumentFile[],
  category: string
): DocumentFile[] => {
  if (!category || category === 'all') return documents;
  
  return documents.filter(doc => doc.category === category);
};
