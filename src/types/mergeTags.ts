
export interface MergeTag {
  id: string;
  name: string;
  description: string;
  tag: string;
  example?: string;
}

export interface MergeTagGroup {
  category: string;
  name: string;
  tags: MergeTag[];
}
