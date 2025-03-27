
/**
 * Utilities for managing storage policies
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Create a storage policy for the documents bucket
 * @param {string} bucketName - Bucket name
 * @param {string} policyName - Policy name
 * @param {string} definition - Policy definition
 * @param {string} operation - Policy operation (SELECT, INSERT, UPDATE, DELETE)
 * @returns {Promise<void>}
 */
export const createStoragePolicy = async (
  bucketName: string, 
  policyName: string, 
  definition: string, 
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
): Promise<void> => {
  try {
    // Define the policy parameters interface
    interface StoragePolicyParams {
      bucket_name: string;
      policy_name: string;
      definition: string;
      operation: string;
    }
    
    // Call RPC with properly typed parameters
    await supabase.rpc<null, StoragePolicyParams>('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: policyName,
      definition: definition,
      operation: operation
    });
    
    console.log(`Created storage policy ${policyName} for ${operation} operation`);
  } catch (error) {
    console.error(`Error creating storage policy ${policyName}:`, error);
    throw error;
  }
};
