
import { Association, AssociationSettings } from "@/types/association";
import { Json } from "@/integrations/supabase/types";

export interface AssociationQueryResult {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_website: string | null;
  type: string | null;
  founded_date: string | null;
  units: number | null;
  status: string | null;
  association_settings?: {
    settings: Json | null;
  };
}

/**
 * Convert AssociationSettings to Json type for Supabase operations
 */
export const settingsToJson = (settings: AssociationSettings): Json => {
  return JSON.parse(JSON.stringify(settings)) as Json;
};

/**
 * Convert Json to AssociationSettings type for application use
 */
export const jsonToSettings = (jsonData: Json | null): AssociationSettings => {
  if (!jsonData) return createDefaultSettings();
  return jsonData as unknown as AssociationSettings;
};

/**
 * Create default settings for a new association
 */
export const createDefaultSettings = (): AssociationSettings => {
  return {
    fiscalYearStart: '01-01',
    feesFrequency: 'monthly',
    documents: {
      storageLimit: 1000,
      allowedTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png']
    },
    board: {
      termLength: 24,
      maximumMembers: 7
    },
    communications: {
      emailEnabled: true,
      smsEnabled: true,
      announcementsEnabled: true
    },
    modules: {
      maintenance: true,
      violations: true,
      voting: true,
      accounting: true,
      documents: true,
      calendar: true
    },
    timezone: 'America/New_York',
    primaryLanguage: 'en',
    currencySymbol: '$'
  };
};

/**
 * Transform a database association result to the Association type
 */
export const transformToAssociation = (data: AssociationQueryResult): Association => {
  return {
    id: data.id,
    name: data.name,
    address: {
      street: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zipCode: data.zip || '',
      country: data.country || 'USA',
    },
    contactInfo: {
      email: data.contact_email || '',
      phone: data.contact_phone || '',
      website: data.contact_website || '',
    },
    type: (data.type as "hoa" | "condo" | "coop" | "other") || 'hoa',
    foundedDate: data.founded_date || new Date().toISOString().split('T')[0],
    units: data.units || 0,
    status: (data.status as "active" | "inactive") || 'active',
    settings: data.association_settings?.settings 
      ? jsonToSettings(data.association_settings.settings)
      : createDefaultSettings(),
  };
};
