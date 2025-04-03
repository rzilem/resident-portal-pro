
import { DocumentFile } from '@/types/documents';

/**
 * Filter documents by category
 * @param documents Array of documents to filter
 * @param category Category to filter by
 * @returns Filtered array of documents
 */
export const filterDocumentsByCategory = (
  documents: DocumentFile[], 
  category?: string
): DocumentFile[] => {
  if (!category || category === 'all') {
    return documents;
  }
  
  return documents.filter(doc => 
    doc.category?.toLowerCase() === category.toLowerCase()
  );
};

export default filterDocumentsByCategory;
