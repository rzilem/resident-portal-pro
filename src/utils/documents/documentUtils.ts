
import { supabase } from '@/integrations/supabase/client';
import { DocumentCategory, DocumentFile } from '@/types/documents';
import { toast } from 'sonner';

/**
 * Format file size in a human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null) return 'Unknown size';
  
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date in a human-readable format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown date';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Get information about a file type
 * @param fileType MIME type string
 * @returns Object with file type information
 */
export const getFileTypeInfo = (fileType: string) => {
  if (!fileType) return { icon: 'file', color: 'gray', label: 'Unknown' };
  
  const lowerType = fileType.toLowerCase();
  
  if (lowerType.includes('pdf')) {
    return { icon: 'file-text', color: 'red', label: 'PDF' };
  } else if (lowerType.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].some(ext => lowerType.includes(ext))) {
    return { icon: 'image', color: 'blue', label: 'Image' };
  } else if (lowerType.includes('word') || lowerType.includes('doc')) {
    return { icon: 'file-text', color: 'blue', label: 'Word' };
  } else if (lowerType.includes('excel') || lowerType.includes('sheet') || lowerType.includes('csv') || lowerType.includes('xls')) {
    return { icon: 'file-spreadsheet', color: 'green', label: 'Spreadsheet' };
  } else if (lowerType.includes('powerpoint') || lowerType.includes('presentation') || lowerType.includes('ppt')) {
    return { icon: 'file', color: 'orange', label: 'Presentation' };
  } else if (lowerType.includes('text') || lowerType.includes('txt')) {
    return { icon: 'file-text', color: 'gray', label: 'Text' };
  } else if (lowerType.includes('zip') || lowerType.includes('archive') || lowerType.includes('compressed')) {
    return { icon: 'archive', color: 'yellow', label: 'Archive' };
  } else {
    return { icon: 'file', color: 'gray', label: fileType.split('/')[1] || 'File' };
  }
};

/**
 * Format categories for dropdown selection
 * @param categories Array of document categories
 * @returns Array formatted for selection components
 */
export const formatCategoriesForSelection = (categories: DocumentCategory[]) => {
  return categories.map(category => ({
    value: category.id,
    label: category.name
  }));
};

/**
 * Get document categories from the database
 * @returns Promise resolving to document categories
 */
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching document categories:', error);
      return [
        { id: 'financial', name: 'Financial Documents', accessLevel: 'board' },
        { id: 'legal', name: 'Legal Documents', accessLevel: 'management' },
        { id: 'meeting', name: 'Meeting Minutes', accessLevel: 'homeowner' },
        { id: 'maintenance', name: 'Maintenance', accessLevel: 'all' },
        { id: 'reports', name: 'Reports', accessLevel: 'board' },
        { id: 'general', name: 'General', accessLevel: 'all' }
      ];
    }
    
    if (data && data.length > 0) {
      return data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        accessLevel: category.access_level
      }));
    }
    
    // Default categories if none found in database
    return [
      { id: 'financial', name: 'Financial Documents', accessLevel: 'board' },
      { id: 'legal', name: 'Legal Documents', accessLevel: 'management' },
      { id: 'meeting', name: 'Meeting Minutes', accessLevel: 'homeowner' },
      { id: 'maintenance', name: 'Maintenance', accessLevel: 'all' },
      { id: 'reports', name: 'Reports', accessLevel: 'board' },
      { id: 'general', name: 'General', accessLevel: 'all' }
    ];
  } catch (error) {
    console.error('Error in getDocumentCategories:', error);
    // Fallback to default categories
    return [
      { id: 'financial', name: 'Financial Documents', accessLevel: 'board' },
      { id: 'legal', name: 'Legal Documents', accessLevel: 'management' },
      { id: 'meeting', name: 'Meeting Minutes', accessLevel: 'homeowner' },
      { id: 'maintenance', name: 'Maintenance', accessLevel: 'all' },
      { id: 'reports', name: 'Reports', accessLevel: 'board' },
      { id: 'general', name: 'General', accessLevel: 'all' }
    ];
  }
};

/**
 * Update document categories in the database
 * @param categories Array of document categories to sync
 * @returns Promise resolving to success status
 */
export const syncCategoriesToSupabase = async (categories: DocumentCategory[]): Promise<boolean> => {
  try {
    // Prepare data for Supabase format
    const formattedCategories = categories.map((cat, index) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      access_level: cat.accessLevel || 'all',
      sort_order: index
    }));
    
    // Upsert the categories (update if exists, insert if not)
    const { error } = await supabase
      .from('document_categories')
      .upsert(formattedCategories);
    
    if (error) {
      console.error('Error upserting document categories:', error);
      toast.error(`Failed to update document categories: ${error.message}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in syncCategoriesToSupabase:', error);
    toast.error('An unexpected error occurred while updating document categories');
    return false;
  }
};

/**
 * Convert string tag to Tag object if needed
 * @param tag Tag string or object
 * @returns Normalized Tag object
 */
export const normalizeTag = (tag: string | { id: string; name: string }) => {
  if (typeof tag === 'string') {
    return { id: tag, name: tag };
  }
  return tag;
};
