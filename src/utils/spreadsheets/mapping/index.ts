
/**
 * Entry point for mapping utilities
 */
export { generateAutoMappings } from '../spreadsheets/mapping';
export { findBestFieldMatch, findMissingRequiredFields } from './fieldMatchers';
export { validateMappings } from './validation';
export type { ColumnMapping, ValidationResult, FieldOption } from './types';
