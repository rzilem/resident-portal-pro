
export interface MergeTag {
  id: string;
  tag: string;
  description: string;
  name?: string;
  category?: string;
  example?: string;
}

export interface MergeTagGroup {
  category: string;
  name: string;
  tags: MergeTag[];
}

export interface CustomMergeTagDefinition {
  name: string;
  description: string;
  tag: string;
  defaultValue?: string;
  category: string;
  associationId?: string;
}

export type MergeTagCategory = 
  | 'resident'
  | 'property'
  | 'association'
  | 'compliance'
  | 'financial'
  | 'date'
  | 'maintenance'
  | 'communication'
  | 'meeting'
  | 'workflow'
  | 'board'
  | 'event'
  | 'violation'
  | 'custom';

