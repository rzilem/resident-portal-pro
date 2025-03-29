
export interface BidRequestFormData {
  projectType: string;
  answers: Record<string, any>;
  vendors: string[];
  notes?: string;
  dueDate: Date | null;
}

export interface ProjectType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'date' | 'number';
  options?: string[];
  required?: boolean;
}
