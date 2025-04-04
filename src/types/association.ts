
/**
 * Association type definitions for the application
 */

import { Tag } from "@/types/resident";

export interface Association {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  type: 'hoa' | 'condo' | 'coop' | 'other';
  foundedDate: string;
  units: number;
  managementCompanyId?: string;
  status: 'active' | 'inactive';
  settings?: AssociationSettings;
  communicationTemplates?: CommunicationTemplate[];
  customMergeTags?: CustomMergeTag[];
  tags?: Tag[]; // Association tags
}

export interface CustomMergeTag {
  id: string;
  name: string;
  tag: string;
  description: string;
  category: string;
  defaultValue?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'announcement' | 'letter';
  category: 'general' | 'maintenance' | 'financial' | 'violations' | 'meetings' | 'other';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isDefault?: boolean;
}

export interface AssociationSettings {
  fiscalYearStart: string; // MM-DD format
  feesFrequency: 'monthly' | 'quarterly' | 'annually';
  documents: {
    storageLimit: number; // in MB
    allowedTypes: string[];
  };
  board: {
    termLength: number; // in months
    maximumMembers: number;
  };
  communications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    announcementsEnabled: boolean;
    defaultEmailSender?: string;
    defaultEmailReplyTo?: string;
    emailFooter?: string;
    emailHeader?: string;
    requireApprovalForMassEmails?: boolean;
    approvalWorkflow?: 'simple' | 'committee' | 'board' | 'manager';
    restrictedRecipientGroups?: string[];
    allowVendorCommunication?: boolean;
  };
  modules: {
    maintenance: boolean;
    violations: boolean;
    voting: boolean;
    accounting: boolean;
    documents: boolean;
    calendar: boolean;
  };
  // Basic settings
  timezone?: string;
  primaryLanguage?: string;
  code?: string;
  cityStateZip?: string;
  country?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  
  // Financial settings
  currency?: string;
  currencySymbol?: string;
  dueDay?: string;
  allowOnlinePayments?: boolean;
  allowAutopay?: boolean;
  chargeConvenienceFee?: boolean;
  convenienceFee?: string;
  enableLateFees?: boolean;
  lateFeeType?: 'fixed' | 'percentage';
  lateFeeAmount?: string;
  lateFeeGraceDays?: string;
  compoundLateFees?: boolean;
  
  // Document settings
  requireGoverningDocs?: boolean;
  enableDocEsign?: boolean;
  docRetentionPeriod?: string;
  requireBylaws?: boolean;
  requireCCAndR?: boolean;
  requireArticles?: boolean;
  requireRules?: boolean;
  requireBudget?: boolean;
  
  // Communication settings
  emailFromName?: string;
  emailFromAddress?: string;
  emailReplyTo?: string;
  includeLogoInEmails?: boolean;
  sendPaymentReminders?: boolean;
  paymentReminderDays?: string;
  sendLateNotices?: boolean;
  sendViolationNotices?: boolean;
  sendMeetingNotices?: boolean;
  meetingNoticeDays?: string;
  
  // Meeting settings
  annualMeetingMonth?: string;
  boardMeetingFrequency?: string;
  allowVirtualMeetings?: boolean;
  recordMeetings?: boolean;
  enableElectronicVoting?: boolean;
  allowProxyVoting?: boolean;
  quorumPercentage?: string;
  requireVoterRegistration?: boolean;
  
  // Notification settings
  notificationMethod?: string;
  allowResidentsToOptOut?: boolean;
  sendWeeklyDigest?: boolean;
  notifyNewDocuments?: boolean;
  notifyAnnouncements?: boolean;
  notifyMaintenance?: boolean;
  notifyPayments?: boolean;
  notifyViolations?: boolean;
  notifyBoardDecisions?: boolean;
  
  // Property-specific settings (for custom columns)
  county?: string;
  taxId?: string;
  hasPool?: boolean;
  hasGate?: boolean;
  hasPedestrianGate?: boolean;
  hasElevator?: boolean;
  hasAmenityCenter?: boolean;
  annualFees?: string;
  manager?: string;
  residents?: string;
  offsiteAddresses?: string;
  leases?: string;
  serviceType?: string;
  
  // Add isDefault property
  isDefault?: boolean;
}
