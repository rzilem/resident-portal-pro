
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
  // Common properties
  property?: string;
  owner?: string;
  
  // Properties used in resaleWizard
  propertyAddress?: string;
  associationName?: string;
  ownerName?: string;
  closingDate?: Date | string;
  
  // Account statement properties
  accountNumber?: string;
  statementDate?: Date | string;
  previousBalance?: number;
  payments?: number;
  newCharges?: number;
  currentBalance?: number;
  transactions?: any[];
  
  // Condo questionnaire properties
  condoName?: string;
  unitNumber?: string;
  managementCompany?: string;
  totalUnits?: number;
  yearBuilt?: string;
  monthlyFee?: number;
  reserveBalance?: number;
  ownerOccupiedPercentage?: number;
  arrearsPercentage?: number;
  insuranceCarrier?: string;
  policyNumber?: string;
  expirationDate?: Date | string;
  
  // Property inspection properties
  inspectionDate?: Date | string;
  inspectionTime?: string;
  inspectionType?: string;
  inspectionNotes?: string;
  
  // Resale certificate properties
  regularAssessment?: number;
  assessmentFrequency?: string;
  specialAssessment?: string;
  transferFee?: number;
  outstandingBalance?: number;
  violations?: string;
  litigation?: string;
  
  // TREC forms properties
  selectedForms?: string[];
}
