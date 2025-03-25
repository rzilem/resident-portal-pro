
/**
 * Merge tag system for dynamic content in templates
 */

export type MergeTagCategory = 
  | 'association'
  | 'property'
  | 'resident'
  | 'financial'
  | 'maintenance'
  | 'communication'
  | 'meeting'
  | 'workflow'
  | 'board'
  | 'event'
  | 'violation'
  | 'custom';

export interface MergeTag {
  id: string;
  name: string;
  description: string;
  category: MergeTagCategory;
  tag: string; // The actual template tag used, e.g., {{association.name}}
  example?: string; // Example value for preview
  isCustom?: boolean;
  associationId?: string; // For custom association-specific tags
  createdAt?: string;
  updatedAt?: string;
}

export interface MergeTagGroup {
  category: MergeTagCategory;
  name: string;
  description: string;
  tags: MergeTag[];
}

export interface CustomMergeTagDefinition {
  name: string;
  tag: string;
  description: string;
  category: MergeTagCategory;
  associationId: string;
  defaultValue?: string;
}
