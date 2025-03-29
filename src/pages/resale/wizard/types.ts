
import { LucideIcon } from 'lucide-react';

export interface ProjectType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface ImageOption {
  label: string;
  value: string;
  image: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'radio' | 'text' | 'textarea' | 'number' | 'checkbox' | 'date';
  options?: string[] | ImageOption[];
  required?: boolean;
  conditionalShow?: (answers: Record<string, any>) => boolean;
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

// Updated FormData interface to use string types for all numeric fields
export interface FormData {
  // Common properties
  property?: string;
  owner?: string;
  
  // Properties used in resaleWizard
  propertyAddress?: string;
  associationName?: string;
  ownerName?: string;
  closingDate?: string;
  propertyType?: string;
  
  // Account statement properties
  accountNumber?: string;
  statementDate?: string;
  previousBalance?: string;
  payments?: string;
  newCharges?: string;
  currentBalance?: string;
  transactions?: any[][];
  
  // Condo questionnaire properties
  condoName?: string;
  unitNumber?: string;
  managementCompany?: string;
  totalUnits?: string;
  yearBuilt?: string;
  monthlyFee?: string;
  reserveBalance?: string;
  ownerOccupiedPercentage?: string;
  arrearsPercentage?: string;
  insuranceCarrier?: string;
  policyNumber?: string;
  expirationDate?: string;
  
  // Property inspection properties
  inspectionDate?: string;
  inspectionTime?: string;
  inspectionType?: string;
  inspectionNotes?: string;
  
  // Resale certificate properties
  regularAssessment?: string;
  assessmentFrequency?: string;
  specialAssessment?: string;
  transferFee?: string;
  outstandingBalance?: string;
  violations?: string;
  litigation?: string;
  
  // TREC forms properties
  selectedForms?: string[];
}
