
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
      ...item,
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
      ...data,
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

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching bid request vendors:', error);
    toast.error('An unexpected error occurred');
    return [];
  }
}
