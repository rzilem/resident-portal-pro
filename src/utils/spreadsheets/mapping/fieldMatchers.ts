
import { ColumnMapping } from './types';

/**
 * Find best match for a field in target fields
 */
export const findBestFieldMatch = (sourceField: string, targetFields: string[]): string => {
  const lowerSourceField = sourceField.toLowerCase();
  
  // Direct matches
  const directMatch = targetFields.find(
    field => field.toLowerCase() === lowerSourceField
  );
  
  if (directMatch) return directMatch;
  
  // Partial matches (source contains target or target contains source)
  for (const targetField of targetFields) {
    if (lowerSourceField.includes(targetField.toLowerCase()) || 
        targetField.toLowerCase().includes(lowerSourceField)) {
      return targetField;
    }
  }
  
  // Word similarity matches
  const sourceWords = lowerSourceField.split(/[_\s-]+/);
  
  for (const targetField of targetFields) {
    const targetWords = targetField.toLowerCase().split(/[_\s-]+/);
    const hasCommonWords = sourceWords.some(word => 
      targetWords.some(targetWord => targetWord.includes(word) || word.includes(targetWord))
    );
    
    if (hasCommonWords) return targetField;
  }
  
  return 'ignore';
};

/**
 * Find missing required fields
 */
export const findMissingRequiredFields = (
  mappings: ColumnMapping[], 
  requiredFields: string[]
): string[] => {
  const mappedFields = mappings.map(m => m.targetField);
  return requiredFields.filter(field => !mappedFields.includes(field));
};
