
import { supabase } from '@/integrations/supabase/client';
import { DocumentFile, DocumentCategory, DocumentSearchFilters } from '@/types/documents';

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Check and create documents bucket if it doesn't exist
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.log('Documents bucket not found, creating it...');
      // Create the documents bucket
      const { error } = await supabase.storage.createBucket('documents', {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (error) {
        console.error('Error creating documents bucket:', error);
        return false;
      }
      
      console.log('Documents bucket created successfully');
    } else {
      console.log('Documents bucket already exists');
    }
    
    return true;
  } catch (error) {
    console.error('Error checking/creating documents bucket:', error);
    return false;
  }
};

export const getDocuments = async (
  filters: DocumentSearchFilters = {}, 
  associationId?: string,
  userRole?: string
): Promise<DocumentFile[]> => {
  try {
    console.log('Fetching documents with filters:', { filters, associationId, userRole });
    
    // Start query builder
    let query = supabase
      .from('documents')
      .select('*');
    
    // Apply association filter if provided
    if (associationId) {
      console.log(`Filtering by association ID: ${associationId}`);
      query = query.eq('association_id', associationId);
    }
    
    // Apply search query if provided
    if (filters.query && filters.query.trim() !== '') {
      const searchTerm = `%${filters.query.toLowerCase()}%`;
      query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }
    
    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories);
    }
    
    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      // For array columns, we need to check if any of the tags are in the array
      for (const tag of filters.tags) {
        query = query.contains('tags', [tag]);
      }
    }
    
    // Apply date range filter
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        query = query.gte('uploaded_date', filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        query = query.lte('uploaded_date', filters.dateRange.end);
      }
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} documents`);
    
    // Transform the Supabase data to match our DocumentFile interface
    const documents: DocumentFile[] = (data || []).map(doc => ({
      id: doc.id,
      name: doc.name,
      description: doc.description || undefined,
      fileSize: doc.file_size,
      fileType: doc.file_type,
      url: doc.url,
      category: doc.category,
      tags: doc.tags || [],
      uploadedBy: doc.uploaded_by,
      uploadedDate: doc.uploaded_date,
      lastModified: doc.last_modified || undefined,
      version: doc.version,
      previousVersions: [], // We'll implement version history later
      expirationDate: undefined,
      isPublic: doc.is_public,
      isArchived: doc.is_archived,
      properties: [],
      associations: [doc.association_id],
      metadata: {}
    }));
    
    return documents;
  } catch (error) {
    console.error('Error in getDocuments:', error);
    return [];
  }
};

export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  // For now, return mock categories
  // Later this could be fetched from a database
  return [
    { id: 'financial', name: 'Financial Documents', description: 'Budget, financial statements, etc.', accessLevel: 'board' },
    { id: 'legal', name: 'Legal Documents', description: 'Contracts, bylaws, etc.', accessLevel: 'board' },
    { id: 'meetings', name: 'Meeting Minutes', description: 'Board and association meeting minutes', accessLevel: 'homeowner' },
    { id: 'rules', name: 'Rules & Regulations', description: 'HOA rules and guidelines', accessLevel: 'all' },
    { id: 'maintenance', name: 'Maintenance', description: 'Maintenance schedules and records', accessLevel: 'homeowner' },
    { id: 'general', name: 'General', description: 'General association documents', accessLevel: 'all' },
    { id: 'uncategorized', name: 'Uncategorized', description: 'Documents not yet categorized', accessLevel: 'all' },
  ];
};

export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    // First get the document to get the URL
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('url')
      .eq('id', documentId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching document for deletion:', fetchError);
      throw fetchError;
    }
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.url]);
    
    if (storageError) {
      console.error('Error deleting document from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
    
    if (dbError) {
      console.error('Error deleting document from database:', dbError);
      throw dbError;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteDocument:', error);
    return false;
  }
};

export const downloadDocument = async (document: DocumentFile): Promise<string> => {
  try {
    // Get download URL
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(document.url, 60); // 60 seconds expiry
    
    if (error) {
      console.error('Error creating signed URL:', error);
      throw error;
    }
    
    if (!data || !data.signedUrl) {
      throw new Error('Failed to generate download URL');
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error in downloadDocument:', error);
    throw error;
  }
};
