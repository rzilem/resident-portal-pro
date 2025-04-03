
import { DocumentFile } from '@/types/documents';

/**
 * Filter documents by tags
 * @param documents List of documents to filter
 * @param tags Tags to filter by (can be a single tag or array of tags)
 * @param matchAll If true, document must match all tags; if false, match any tag
 * @returns Filtered list of documents
 */
export const filterDocumentsByTags = (
  documents: DocumentFile[],
  tags: string | string[],
  matchAll: boolean = false
): DocumentFile[] => {
  if (!tags || (Array.isArray(tags) && tags.length === 0)) {
    return documents;
  }
  
  const tagArray = Array.isArray(tags) ? tags : [tags];
  const normalizedTags = tagArray.map(tag => tag.toLowerCase());
  
  return documents.filter(doc => {
    if (!doc.tags || doc.tags.length === 0) {
      return false;
    }
    
    const docTags = doc.tags.map(tag => tag.toLowerCase());
    
    if (matchAll) {
      // Must match all specified tags
      return normalizedTags.every(tag => docTags.includes(tag));
    } else {
      // Match any of the specified tags
      return normalizedTags.some(tag => docTags.includes(tag));
    }
  });
};
