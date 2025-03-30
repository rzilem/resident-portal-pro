
/**
 * Entry point for mapping utilities
 */
export { generateAutoMappings } from './autoMappingGenerator';
export { findBestFieldMatch, findMissingRequiredFields } from './fieldMatchers';
export { validateMappings } from './validation';
export type { ColumnMapping, FieldOption, ValidationResult } from './types';
