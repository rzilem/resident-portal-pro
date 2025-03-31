import { DocumentFile } from '@/types/documents';

/**
 * Sanitize a document URL to ensure it's properly formatted
 * @param url The URL to sanitize
 * @returns A properly formatted URL
 */
export const sanitizeDocumentUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Replace spaces with %20
    url = url.replace(/ /g, '%20');
    
    // Check if the URL is already encoded
    const decoded = decodeURIComponent(url);
    if (decoded !== url) {
      return url;
    }
    
    // Validate URL
    new URL(url);
    return url;
  } catch (error) {
    console.error('Invalid URL:', url, error);
    return '';
  }
};

/**
 * Check if a file type should use Office Online Viewer
 * @param fileType The file type/mime type
 * @returns Boolean indicating if Office viewer should be used
 */
export const canUseOfficeViewer = (fileType: string): boolean => {
  const type = fileType.toLowerCase();
  
  return (
    type.includes('word') ||
    type.includes('excel') ||
    type.includes('spreadsheet') ||
    type.includes('powerpoint') ||
    type.includes('presentation') ||
    type.includes('msword') ||
    type.includes('officedocument') ||
    type.match(/\.(docx?|xlsx?|pptx?|csv)$/i) !== null
  );
};

/**
 * Get the appropriate icon and color for a file type
 * @param fileType The file type/mime type
 * @returns Object with icon name and color
 */
export const getFileTypeInfo = (fileType: string): { icon: string; color: string } => {
  const type = fileType.toLowerCase();
  
  if (type.includes('pdf')) {
    return { icon: 'file-pdf', color: 'text-red-500' };
  } else if (type.includes('image') || type.match(/\.(jpe?g|png|gif|svg|webp)$/i)) {
    return { icon: 'image', color: 'text-blue-500' };
  } else if (canUseOfficeViewer(type)) {
    if (type.includes('word') || type.includes('document')) {
      return { icon: 'file-text', color: 'text-blue-700' };
    } else if (type.includes('excel') || type.includes('sheet')) {
      return { icon: 'table', color: 'text-green-600' };
    } else if (type.includes('powerpoint') || type.includes('presentation')) {
      return { icon: 'presentation', color: 'text-orange-500' };
    }
  }
  
  // Default
  return { icon: 'file', color: 'text-gray-500' };
};

/**
 * Format date for display
 * @param dateString The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format file size for display
 * @param bytes The file size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get document metadata from Supabase from the document ID
 * @param documentId The document ID
 * @returns Promise resolving to document data
 */
export const getDocumentById = async (documentId: string): Promise<DocumentFile | null> => {
  if (!documentId) return null;
  
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (error) {
      console.error('Error fetching document:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Convert database response to DocumentFile type
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      fileSize: data.file_size,
      fileType: data.file_type,
      url: data.url,
      category: data.category || 'uncategorized',
      tags: data.tags || [],
      uploadedBy: data.uploaded_by || '',
      uploadedDate: data.uploaded_date || new Date().toISOString(),
      lastModified: data.last_modified || new Date().toISOString(),
      version: data.version || 1,
      previousVersions: [],
      expirationDate: undefined,
      isPublic: data.is_public || false,
      isArchived: data.is_archived || false,
      properties: [],
      associations: data.association_id ? [data.association_id] : [],
      metadata: {}
    } as DocumentFile;
  } catch (error) {
    console.error('Exception fetching document:', error);
    return null;
  }
};

/**
 * Check if a document is previewable
 * @param fileType The file type/mime type
 * @returns Boolean indicating if the file can be previewed
 */
export const isPreviewable = (fileType: string): boolean => {
  const type = fileType.toLowerCase();
  
  return (
    type.includes('pdf') ||
    type.includes('image') ||
    type.match(/\.(jpe?g|png|gif|svg|webp)$/i) !== null ||
    canUseOfficeViewer(type) ||
    type.includes('text') ||
    type.includes('html')
  );
};

/**
 * Get document categories from the database
 * @returns Promise resolving to array of document categories
 */
export const getDocumentCategories = async () => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching document categories:', error);
      return [];
    }
    
    return data.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || '',
      accessLevel: category.access_level as any,
      sortOrder: category.sort_order || 0
    }));
  } catch (error) {
    console.error('Exception fetching document categories:', error);
    return [];
  }
};

/**
 * Ensure that the documents bucket exists in Supabase storage
 * @returns Promise resolving to boolean indicating success
 */
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // First check if the bucket already exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError.message);
      return false;
    }
    
    const documentsBucket = buckets.find(bucket => bucket.name === 'documents');
    
    if (documentsBucket) {
      console.log('Documents bucket already exists');
      return true;
    }
    
    // If we reach here, we need to create the bucket
    console.log('Creating documents bucket...');
    
    const { data, error } = await supabase.storage.createBucket('documents', {
      public: true,
      fileSizeLimit: 50 * 1024 * 1024 // 50MB limit
    });
    
    if (error) {
      console.error('Error creating documents bucket:', error.message);
      return false;
    }
    
    console.log('Documents bucket created successfully');
    return true;
  } catch (error) {
    console.error('Exception ensuring bucket exists:', error);
    return false;
  }
};
