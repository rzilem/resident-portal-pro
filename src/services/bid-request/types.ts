
import { BidRequestFormData } from '@/pages/resale/wizard/types';

export interface BidRequest {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  project_type: string;
  notes: string | null;
  due_date: string | null;
  status: string;
  answers: Record<string, any>;
}

export interface BidRequestVendor {
  id: string;
  created_at: string;
  bid_request_id: string;
  vendor_id: string;
  status: string;
  response_date: string | null;
  bid_amount: number | null;
  response_notes: string | null;
  estimated_completion_date: string | null;
}
