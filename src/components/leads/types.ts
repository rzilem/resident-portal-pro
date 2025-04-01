
import { LeadStatus } from "@/types/lead";

export interface LeadData {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: LeadStatus;
  lastContactedAt?: string;
  createdAt: string;
  source?: string;
  association_name?: string;
  association_type?: string;
  unit_count?: number;
  city?: string;
  state?: string;
  has_pool?: boolean;
  has_gate?: boolean;
  has_onsite_management?: boolean;
}

export interface LeadTableFilters {
  search: string;
  statusFilter: string;
}
