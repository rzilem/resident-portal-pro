
import { supabase } from "@/integrations/supabase/client";
import { DocumentFile, DocumentSearchFilters } from "@/types/documents";

/**
 * Get documents based on filters and association ID
 * @param filters Search filters
 * @param associationId Association ID
 * @param userRole User role for access control
 * @returns Promise<DocumentFile[]> List of documents
 */
export const getDocuments = async (
  filters?: DocumentSearchFilters,
  associationId?: string,
  userRole?: string
): Promise<DocumentFile[]> => {
  try {
    console.log(`Fetching documents with filters:`, filters);
    console.log(`Association ID:`, associationId);
    
    let query = supabase
      .from('documents')
      .select('*');
    
    // Apply association filter if provided
    if (associationId) {
      query = query.eq('association_id', associationId);
    }
    
    // Apply category filter if provided
    if (filters?.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories);
    }
    
    // Apply search query if provided
    if (filters?.query) {
      const searchTerm = `%${filters.query}%`;
      query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }
    
    // Apply tags filter if provided
    if (filters?.tags && filters.tags.length > 0) {
      // Using ?& operator to check if the tags array contains ANY of the specified tags
      query = query.contains('tags', filters.tags);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching documents:", error.message);
      return [];
    }
    
    // Map database documents to DocumentFile interface
    const documentFiles: DocumentFile[] = data.map(doc => ({
      id: doc.id,
      name: doc.name,
      description: doc.description || '',
      fileSize: doc.file_size,
      fileType: doc.file_type,
      url: doc.url,
      category: doc.category,
      tags: doc.tags || [],
      uploadedBy: doc.uploaded_by,
      uploadedDate: doc.uploaded_date || new Date().toISOString(),
      lastModified: doc.last_modified || undefined,
      version: doc.version || 1,
      isPublic: doc.is_public || false,
      isArchived: doc.is_archived || false
    }));
    
    console.log(`Found ${documentFiles.length} documents`);
    return documentFiles;
  } catch (error: unknown) {
    console.error("Unexpected error fetching documents:", error);
    return [];
  }
};
