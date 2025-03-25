
/**
 * Resident type definitions
 */

export type PropertyDetails = {
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  leaseStart?: string;
  leaseEnd?: string;
  monthlyAssessment?: string;
  deposit?: string;
  taxDistrict?: string;
  taxId?: string;
}

export type LastPayment = {
  date: string;
  amount: string;
  method: string;
}

export type Transaction = {
  date: string;
  description: string;
  amount: string;
  balance: string;
}

export type Communication = {
  date: string;
  type: string;
  subject: string;
  status: string;
}

export type Note = {
  date: string;
  author: string;
  content: string;
}

export type ActivityLog = {
  timestamp: string;
  activity: string;
  type: 'login' | 'payment' | 'document' | 'message' | 'request' | 'other';
  details?: string;
  sessionId?: string; // Added to support session tracking for mimicking
  device?: string;    // Added to support device information
}

export type Document = {
  name: string;
  type: string;
  date: string;
  size: string;
}

export type ResidentProfile = {
  id: number;
  name: string;
  unit: string;
  property: string;
  email: string;
  phone: string;
  status: string;
  moveInDate: string;
  moveOutDate?: string;
  paymentPreference?: string;
  balance: string;
  lastPayment?: LastPayment;
  accountHistory?: Transaction[];
  communications: Communication[];
  notes: Note[];
  activityLogs?: ActivityLog[];
  documents: Document[];
  propertyDetails: PropertyDetails;
}

export type ResidentProfiles = Record<number, ResidentProfile>;
