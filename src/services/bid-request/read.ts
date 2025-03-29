
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BidRequest, BidRequestVendor } from './types';

/**
 * Get all bid requests for the current user
 */
export async function getBidRequests(): Promise<BidRequest[]> {
  try {
    const { data, error } = await supabase
      .from('bid_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bid requests:', error);
      toast.error('Failed to fetch bid requests');
      return [];
    }

    // Convert JSON answers to Record<string, any>
    return (data || []).map(item => ({
      id: item.id,
      project_type: item.project_type,
      status: item.status,
      notes: item.notes,
      due_date: item.due_date,
      created_at: item.created_at,
      updated_at: item.updated_at,
      user_id: item.user_id,
      answers: typeof item.answers === 'string' 
        ? JSON.parse(item.answers) 
        : item.answers
    }));
  } catch (error) {
    console.error('Unexpected error fetching bid requests:', error);
    toast.error('An unexpected error occurred');
    return [];
  }
}

/**
 * Get a single bid request by ID
 */
export async function getBidRequestById(id: string): Promise<BidRequest | null> {
  try {
    const { data, error } = await supabase
      .from('bid_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching bid request:', error);
      toast.error('Failed to fetch bid request');
      return null;
    }

    // Convert JSON answers to Record<string, any>
    return {
      id: data.id,
      project_type: data.project_type,
      status: data.status,
      notes: data.notes,
      due_date: data.due_date,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id,
      answers: typeof data.answers === 'string'
        ? JSON.parse(data.answers)
        : data.answers
    };
  } catch (error) {
    console.error('Unexpected error fetching bid request:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
}

/**
 * Get vendors for a specific bid request
 */
export async function getBidRequestVendors(bidRequestId: string): Promise<BidRequestVendor[]> {
  try {
    const { data, error } = await supabase
      .from('bid_request_vendors')
      .select('*')
      .eq('bid_request_id', bidRequestId);

    if (error) {
      console.error('Error fetching bid request vendors:', error);
      toast.error('Failed to fetch bid vendors');
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      bid_request_id: item.bid_request_id,
      vendor_id: item.vendor_id,
      vendor_name: item.vendor_name,
      status: item.status,
      created_at: item.created_at,
      response_date: item.response_date,
      response_notes: item.response_notes,
      bid_amount: item.bid_amount,
      estimated_completion_date: item.estimated_completion_date
    }));
  } catch (error) {
    console.error('Unexpected error fetching bid request vendors:', error);
    toast.error('An unexpected error occurred');
    return [];
  }
}
