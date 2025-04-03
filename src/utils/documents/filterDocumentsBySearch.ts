
import { DocumentFile } from '@/types/documents';

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
