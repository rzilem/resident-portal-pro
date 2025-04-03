
import { DocumentFile } from '@/types/documents';

// Filter documents by category
export const filterDocumentsByCategory = (
  documents: DocumentFile[],
  category: string
): DocumentFile[] => {
  if (!category || category === 'all') return documents;
  
  return documents.filter(doc => doc.category === category);
};
