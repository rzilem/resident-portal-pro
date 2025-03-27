
// Core CRUD Operations
export * from './createAssociation';
export * from './getAssociations';
export * from './updateAssociation';

// Status and Lifecycle Operations
export * from './statusOperations';

// Media Operations
export * from './mediaOperations';

// Types and Utilities
export * from './types';
export * from './utils';

// Re-export migrations for explicit import
import { runMigrations } from '../migrations';
export { runMigrations };
