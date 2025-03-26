
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
  icon: React.ComponentType;
}
