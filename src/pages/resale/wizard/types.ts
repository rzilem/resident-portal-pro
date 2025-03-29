
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

// Add this interface for type safety when accessing PROJECT_QUESTIONS
export interface ProjectTypeQuestions {
  [projectTypeId: string]: Question[];
}

// Add FormData interface for the resale wizard steps
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
  inspectionDate: string;
  inspectionTime: string;
  inspectionType: string;
  inspectionNotes: string;
  
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

// Add Step interface for wizard steps
export interface Step {
  id: string;
  name: string;
  description: string;
}
