
import { DocumentFile, Tag } from '@/types/documents';

/**
 * Convert tags to normalized string array
 * @param tags Array of tags as strings or Tag objects
 * @returns Array of tag strings
 */
const normalizeTags = (tags: (string | Tag)[]): string[] => {
  return tags.map(tag => {
    if (typeof tag === 'string') return tag.toLowerCase();
    if (typeof tag === 'object' && tag.name) return tag.name.toLowerCase();
    return '';
  }).filter(Boolean);
};

/**
 * Filter documents by tag(s)
 * @param documents Array of documents to filter
 * @param filterTags Array of tags to filter by
 * @param requireAll Whether all tags must be present (AND) or any tag (OR)
 * @returns Filtered array of documents
 */
export const filterDocumentsByTags = (
  documents: DocumentFile[], 
  filterTags: (string | Tag)[], 
  requireAll = false
): DocumentFile[] => {
  if (!filterTags || filterTags.length === 0) {
    return documents;
  }
  
  const normalizedFilterTags = normalizeTags(filterTags);
  
  return documents.filter(doc => {
    if (!doc.tags || doc.tags.length === 0) return false;
    
    const documentTags = normalizeTags(doc.tags as (string | Tag)[]);
    
    if (requireAll) {
      // AND logic - all filter tags must be present
      return normalizedFilterTags.every(filterTag => 
        documentTags.some(docTag => docTag.includes(filterTag))
      );
    } else {
      // OR logic - any filter tag can be present
      return normalizedFilterTags.some(filterTag => 
        documentTags.some(docTag => docTag.includes(filterTag))
      );
    }
  });
};

export default filterDocumentsByTags;
