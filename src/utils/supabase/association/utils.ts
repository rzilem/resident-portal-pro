
import { supabase } from "@/integrations/supabase/client";
import { Association } from "@/types/association";
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from "sonner";
import { AssociationQueryResult, transformToAssociation } from "./types";

/**
 * Standard error handler for association operations
 * @param {unknown} error - The error object
 * @param {string} operation - Description of the operation that failed
 */
export const handleError = (error: unknown, operation: string): void => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error trying to ${operation}:`, message);
  toast.error(`Failed to ${operation}`);
};

/**
 * Validate a file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 */
export const validateFile = (
  file: File, 
  options: { 
    maxSizeMB?: number; 
    allowedTypes?: string[] 
  }
): void => {
  const { maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'] } = options;
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds maximum allowed (${maxSizeMB}MB)`);
  }
};

/**
 * Validate association data before creating/updating
 * @param {Partial<Association>} association - The association data to validate
 */
export const validateAssociation = (association: Partial<Association>): void => {
  if (!association.name || association.name.trim() === '') {
    throw new Error('Association name is required');
  }
  
  if (association.address) {
    if (!association.address.street || association.address.street.trim() === '') {
      throw new Error('Association street address is required');
    }
    if (!association.address.city || association.address.city.trim() === '') {
      throw new Error('Association city is required');
    }
    if (!association.address.state || association.address.state.trim() === '') {
      throw new Error('Association state is required');
    }
  }
};

/**
 * Fetch an association with its settings by ID
 * @param {string} id - The association ID
 * @returns {Promise<AssociationQueryResult>} - The association data
 */
export const getAssociationWithSettings = async (id: string): Promise<AssociationQueryResult> => {
  const { data, error } = await supabase
    .from('associations')
    .select(`
      *,
      association_settings(settings)
    `)
    .eq('id', id)
    .single() as { data: AssociationQueryResult | null; error: PostgrestError | null };
  
  if (error) throw error;
  if (!data) throw new Error(`Association with ID ${id} not found`);
  
  return data;
};

/**
 * Fetch all associations with their settings
 * @returns {Promise<AssociationQueryResult[]>} - Array of associations with settings
 */
export const fetchAssociationsWithSettings = async (): Promise<AssociationQueryResult[]> => {
  const { data, error } = await supabase
    .from('associations')
    .select(`
      *,
      association_settings(settings)
    `)
    .order('name') as { data: AssociationQueryResult[] | null; error: PostgrestError | null };
  
  if (error) throw error;
  if (!data) return [];
  
  return data;
};
