import { LucideIcon } from 'lucide-react';

export interface ProjectType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  imagePath?: string;
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

export interface FormData {
  property?: string;
  owner?: string;
  
  propertyAddress?: string;
  associationName?: string;
  ownerName?: string;
  closingDate?: string;
  propertyType?: string;
  
  accountNumber?: string;
  statementDate?: string;
  previousBalance?: string;
  payments?: string;
  newCharges?: string;
  currentBalance?: string;
  transactions?: any[][];
  
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
  
  inspectionDate?: string;
  inspectionTime?: string;
  inspectionType?: string;
  inspectionNotes?: string;
  
  regularAssessment?: string;
  assessmentFrequency?: string;
  specialAssessment?: string;
  transferFee?: string;
  outstandingBalance?: string;
  violations?: string;
  litigation?: string;
  
  selectedForms?: string[];
}
