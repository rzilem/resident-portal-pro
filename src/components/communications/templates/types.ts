
export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  communities?: string[]; // Array of community IDs or 'all'
}

export interface MessageTemplatesProps {
  onSelectTemplate: (template: MessageTemplate) => void;
  templates: MessageTemplate[];
  onCreateTemplate: (template: MessageTemplate) => void;
  onUpdateTemplate: (template: MessageTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export interface Community {
  id: string;
  name: string;
}

export const SAMPLE_COMMUNITIES: Community[] = [
  { id: 'all', name: 'All Communities' },
  { id: 'comm1', name: 'Riverside HOA' },
  { id: 'comm2', name: 'Oakwood Condos' },
  { id: 'comm3', name: 'Mountain View Estates' },
  { id: 'comm4', name: 'Harbor Point' },
];

export const CategoryOptions = [
  { value: 'Welcome', label: 'Welcome' },
  { value: 'Meetings', label: 'Meetings' },
  { value: 'Financial', label: 'Financial' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Violations', label: 'Violations' },
  { value: 'Events', label: 'Events' },
  { value: 'General', label: 'General' },
];
