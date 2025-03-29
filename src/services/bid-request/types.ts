
export interface BidRequest {
  id: string;
  project_type: string;
  status: string;
  property_id?: string;
  title?: string;
  description?: string;
  notes?: string;
  budget?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  answers?: Record<string, any>;
}

export interface BidRequestVendor {
  id: string;
  bid_request_id: string;
  vendor_id: string;
  vendor_name?: string;
  price?: number;
  bid_amount?: number;
  vendor_notes?: string;
  response_notes?: string;
  documents?: string[];
  status: string;
  created_at: string;
  updated_at?: string;
  response_date?: string;
  estimated_completion_date?: string;
}
