
export interface MergeTag {
  id: string;
  name: string;
  description: string;
  tag: string;
  example?: string;
  category?: string;
}

export interface MergeTagGroup {
  category: string;
  name: string;
  tags: MergeTag[];
}

export type MergeTagCategory = 'association' | 'property' | 'resident' | 'financial' | 'maintenance' | 'communication' | 'meeting' | 'workflow' | 'board' | 'event' | 'violation' | 'custom';

export interface CustomMergeTagDefinition {
  name: string;
  tag: string;
  description: string;
  category: MergeTagCategory;
  associationId: string;
  defaultValue?: string;
}
