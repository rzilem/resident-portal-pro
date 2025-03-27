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

// Updated tag types to include vendor-specific types
export type TagType = 'board' | 'committee' | 'delinquent' | 'custom' | 'property' | 'amenity' | 'service' | 'reliability' | 'pricing';

export type Tag = {
  id: string;
  type: TagType;
  label: string;
  color?: string; // CSS color or class
  createdAt: string;
}

// New types for violations and ARC requests
export type Violation = {
  id: string;
  date: string;
  type: string;
  description: string;
  status: 'Open' | 'Closed' | 'In Progress';
  dueDate?: string;
}

export type ArcApplication = {
  id: string;
  submittedDate: string;
  projectType: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Denied' | 'More Info Needed';
  reviewDate?: string;
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
  // New tags field
  tags?: Tag[];
  // New fields for violations and ARC applications
  violations?: Violation[];
  arcApplications?: ArcApplication[];
  // Last contact information
  lastContact?: {
    called?: string;
    visitedOffice?: string;
    email?: string;
  };
  // Add associationId property
  associationId?: string;
}

export type ResidentProfiles = Record<number, ResidentProfile>;
