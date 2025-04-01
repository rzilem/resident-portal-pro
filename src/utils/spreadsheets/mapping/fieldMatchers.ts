
import { ColumnMapping } from './types';

/**
 * Find the best match between source fields and target fields
 */
export const findBestFieldMatch = (sourceField: string, targetFields: string[]): string => {
  const lowerSource = sourceField.toLowerCase();
  
  // Exact match
  const exactMatch = targetFields.find(tf => tf.toLowerCase() === lowerSource);
  if (exactMatch) return exactMatch;
  
  // Contains match
  const containsMatch = targetFields.find(tf => lowerSource.includes(tf.toLowerCase()));
  if (containsMatch) return containsMatch;
  
  // Default
  return 'ignore';
};

/**
 * Find required fields that are missing from the mappings
 */
export const findMissingRequiredFields = (
  mappings: ColumnMapping[], 
  requiredFields: string[]
): string[] => {
  const mappedFields = mappings.map(m => m.targetField);
  return requiredFields.filter(f => !mappedFields.includes(f));
};
