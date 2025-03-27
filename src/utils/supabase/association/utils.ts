
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Association } from "@/types/association";
import { PostgrestError } from '@supabase/supabase-js';
import { AssociationQueryResult, transformToAssociation } from "./types";

/**
 * Generic error handler for association operations
 * @param error - The error that occurred
 * @param context - The context where the error occurred (for logging)
 * @returns The error message
 */
export const handleError = (error: unknown, context: string): string => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error in ${context}: ${message}`);
  toast.error(`Failed to ${context.toLowerCase()}`);
  return message;
};

/**
 * Validate file before upload
 * @param file - The file to validate
 * @param options - Validation options
 * @throws {Error} If validation fails
 */
export const validateFile = (
  file: File, 
  options?: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  }
): void => {
  const maxSize = (options?.maxSizeMB || 5) * 1024 * 1024; // Default 5MB
  const allowedTypes = options?.allowedTypes || ['image/jpeg', 'image/png', 'image/gif'];
  
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${options?.maxSizeMB || 5}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
};

/**
 * Common query to fetch associations with their settings
 * @returns Promise with associations data
 */
export const fetchAssociationsWithSettings = async (): Promise<AssociationQueryResult[]> => {
  const { data, error } = await supabase
    .from('associations')
    .select(`
      *,
      association_settings(settings)
    `)
    .order('name');
  
  if (error) {
    throw error;
  }
  
  return data as AssociationQueryResult[];
};

/**
 * Get a single association with settings by ID
 * @param id - The association ID
 * @returns Promise with association data
 */
export const getAssociationWithSettings = async (id: string): Promise<AssociationQueryResult> => {
  const { data, error } = await supabase
    .from('associations')
    .select(`
      *,
      association_settings(settings)
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    throw error;
  }
  
  if (!data) {
    throw new Error(`Association with ID ${id} not found`);
  }
  
  return data as AssociationQueryResult;
};

/**
 * Validate association input
 * @param association - The association data to validate
 * @throws {Error} If validation fails
 */
export const validateAssociation = (association: Partial<Association>): void => {
  if (!association.name || association.name.trim() === '') {
    throw new Error('Association name is required');
  }
  
  if (association.units !== undefined && (isNaN(association.units) || association.units < 0)) {
    throw new Error('Units must be a positive number');
  }
};
