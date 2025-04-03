
import { DocumentFile } from '@/types/documents';

/**
 * Filter documents by date range
 * @param documents List of documents to filter
 * @param startDate Start date for the range (inclusive)
 * @param endDate End date for the range (inclusive)
 * @param dateField Field to filter on (uploadedDate or lastModified)
 * @returns Filtered list of documents
 */
export const filterDocumentsByDate = (
  documents: DocumentFile[],
  startDate?: Date | string,
  endDate?: Date | string,
  dateField: 'uploadedDate' | 'lastModified' = 'uploadedDate'
): DocumentFile[] => {
  if (!startDate && !endDate) {
    return documents;
  }
  
  // Convert string dates to Date objects if needed
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  return documents.filter(doc => {
    const docDate = new Date(doc[dateField] || doc.uploadedDate);
    
    if (start && end) {
      return docDate >= start && docDate <= end;
    } else if (start) {
      return docDate >= start;
    } else if (end) {
      return docDate <= end;
    }
    
    return true;
  });
};
