
export interface LetterTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const LetterCategoryOptions = [
  { value: 'Compliance', label: 'Compliance' },
  { value: 'Delinquency', label: 'Delinquency' },
  { value: 'Architectural', label: 'Architectural' },
  { value: 'Welcome', label: 'Welcome' },
  { value: 'General', label: 'General' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Meeting', label: 'Meeting' },
  { value: 'Other', label: 'Other' },
];
