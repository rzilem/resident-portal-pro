import { Step } from './types';
import { VendorTag } from '@/types/vendor';

export interface FormData {
  // Property Details
  propertyAddress: string;
  propertyType: string;
  ownerName: string;
  associationName: string;
  closingDate: string;
  
  // Certificate Details
  regularAssessment: string;
  assessmentFrequency: string;
  specialAssessment: string;
  transferFee: string;
  outstandingBalance: string;
  violations: string;
  litigation: string;
  
  // Questionnaire Details
  condoName: string;
  unitNumber: string;
  managementCompany: string;
  totalUnits: string;
  yearBuilt: string;
  monthlyFee: string;
  reserveBalance: string;
  ownerOccupiedPercentage: string;
  arrearsPercentage: string;
  insuranceCarrier: string;
  policyNumber: string;
  expirationDate: string;
  
  // Inspection Details
  inspectionDate?: string;
  inspectionTime?: string;
  inspectionType?: string;
  inspectionNotes?: string;
  
  // Account Statement
  accountNumber: string;
  statementDate: string;
  previousBalance: string;
  payments: string;
  newCharges: string;
  currentBalance: string;
  transactions: string[][];
  
  // TREC Forms
  selectedForms: string[];
}

export interface Step {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface BidRequestFormData {
  projectType: string;
  answers: Record<string, any>;
  vendors: string[];
  notes?: string;
  dueDate?: Date | null;
}

export interface ProjectType {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

export interface Question {
  id: string;
  question: string;
  type: 'radio' | 'checkbox' | 'text' | 'select' | 'number';
  options?: string[];
  required?: boolean;
}

export interface ProjectTypeQuestions {
  [key: string]: Question[];
}
