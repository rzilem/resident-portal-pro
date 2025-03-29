
import { LucideIcon } from 'lucide-react';

export interface ProjectType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface Question {
  id: string;
  text: string;
  type: 'radio' | 'text' | 'textarea' | 'number' | 'checkbox';
  options?: string[];
  required?: boolean;
}

export interface ProjectTypeQuestions {
  [key: string]: Question[];
}

export interface Step {
  id: string;
  name: string;
  description: string;
}

export interface BidRequestFormData {
  projectType: string;
  answers: Record<string, any>;
  vendors: string[];
  notes: string;
  dueDate: Date | null;
}

// Adding this to prevent errors in useResaleWizard and other files
export interface FormData {
  // Add properties that are used in the wizard steps
  property?: string;
  owner?: string;
  // Add other properties as needed
}
