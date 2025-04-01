
/**
 * Functions for matching spreadsheet fields to system fields
 */
import { FieldOption } from './types';

/**
 * Find the best match for a source field from available field options
 * @param sourceField The source field name from the spreadsheet
 * @param availableTargets Array of available target field options
 * @returns Best matching target field or empty string if no good match
 */
export const findBestFieldMatch = (
  sourceField: string, 
  availableTargets: FieldOption[]
): string => {
  const normalizedSource = sourceField.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Look for exact matches first
  for (const target of availableTargets) {
    const normalizedTarget = target.label.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedSource === normalizedTarget) {
      return target.value;
    }
  }
  
  // Look for partial matches
  for (const target of availableTargets) {
    const normalizedTarget = target.label.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedSource.includes(normalizedTarget) || normalizedTarget.includes(normalizedSource)) {
      return target.value;
    }
  }
  
  return '';
};

/**
 * Validate that all required fields are mapped
 * @param mappings Array of current column mappings
 * @param requiredFields Array of required target field names
 * @returns Array of missing field names, empty if all required fields are mapped
 */
export const findMissingRequiredFields = (
  mappings: { sourceField: string; targetField: string }[], 
  requiredFields: string[]
): string[] => {
  const mapped = mappings.map(m => m.targetField);
  return requiredFields.filter(field => !mapped.includes(field));
};
