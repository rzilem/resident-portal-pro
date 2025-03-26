
export interface ViolationTemplate {
  id: string;
  group: string;
  item: string;
  description: string;
  associationId: string;
  isUsed: boolean;
  articleNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ViolationGroup {
  id: string;
  name: string;
  associationId: string;
}

export type ViolationTemplateFilter = {
  group?: string;
  item?: string;
  description?: string;
  showUnused?: boolean;
};
