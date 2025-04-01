
// src/types/property.ts
export interface Property {
  id: string;
  name?: string;
  location?: string;
  units: number;
  status: string;
  onboardingDate?: string;
  annualFees: number;
  assessmentFrequency?: string;
  hasPool?: boolean;
  hasGate?: boolean;
  hasPedestrianGate?: boolean;
  county?: string;
  city?: string;
  offsiteAddresses?: number;
  leases?: number;
  serviceType?: string;
  associationId: string;
  address: string;  // Changed to required (no question mark)
}
