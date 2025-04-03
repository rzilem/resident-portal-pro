
import { DocumentFile } from '@/types/documents';

/**
 * Filter documents by search query
 * @param documents Array of documents to filter
 * @param query Search query string
 * @returns Filtered array of documents
 */
export const filterDocumentsBySearch = (documents: DocumentFile[], query: string): DocumentFile[] => {
  if (!query || query.trim() === '') {
    return documents;
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return documents.filter(doc => {
    // Check name and description
    if (doc.name.toLowerCase().includes(normalizedQuery)) return true;
    if (doc.description?.toLowerCase().includes(normalizedQuery)) return true;
    
    // Check tags (can be string[] or Tag[])
    if (doc.tags && doc.tags.length > 0) {
      for (const tag of doc.tags) {
        if (typeof tag === 'string' && tag.toLowerCase().includes(normalizedQuery)) return true;
        if (typeof tag === 'object' && tag.name && tag.name.toLowerCase().includes(normalizedQuery)) return true;
      }
    }
    
    // Check category
    if (doc.category?.toLowerCase().includes(normalizedQuery)) return true;
    
    return false;
  });
};

export default filterDocumentsBySearch;
