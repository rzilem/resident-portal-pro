
import { supabase } from '@/integrations/supabase/client';
import { BidRequestFormData } from '@/pages/resale/wizard/types';
import { toast } from 'sonner';

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

export const bidRequestService = {
  /**
   * Save a new bid request to the database
   */
  async createBidRequest(formData: BidRequestFormData): Promise<string | null> {
    try {
      // Get the currently authenticated user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('You must be logged in to create a bid request');
        return null;
      }

      // Create the bid request
      const { data: bidRequest, error } = await supabase
        .from('bid_requests')
        .insert({
          user_id: session.user.id,
          project_type: formData.projectType,
          notes: formData.notes || null,
          due_date: formData.dueDate || null,
          answers: formData.answers
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating bid request:', error);
        toast.error('Failed to create bid request');
        return null;
      }

      // Add selected vendors
      if (formData.vendors.length > 0) {
        const vendorInserts = formData.vendors.map(vendorId => ({
          bid_request_id: bidRequest.id,
          vendor_id: vendorId
        }));

        const { error: vendorError } = await supabase
          .from('bid_request_vendors')
          .insert(vendorInserts);

        if (vendorError) {
          console.error('Error adding vendors to bid request:', vendorError);
          toast.warning('Bid request created, but failed to add all vendors');
        }
      }

      toast.success('Bid request created successfully');
      return bidRequest.id;
    } catch (error) {
      console.error('Unexpected error creating bid request:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  },

  /**
   * Get all bid requests for the current user
   */
  async getBidRequests(): Promise<BidRequest[]> {
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

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching bid requests:', error);
      toast.error('An unexpected error occurred');
      return [];
    }
  },

  /**
   * Get a single bid request by ID
   */
  async getBidRequestById(id: string): Promise<BidRequest | null> {
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

      return data;
    } catch (error) {
      console.error('Unexpected error fetching bid request:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  },

  /**
   * Get vendors for a specific bid request
   */
  async getBidRequestVendors(bidRequestId: string): Promise<BidRequestVendor[]> {
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
  },

  /**
   * Update the status of a bid request
   */
  async updateBidRequestStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bid_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating bid request status:', error);
        toast.error('Failed to update status');
        return false;
      }

      toast.success('Status updated successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error updating bid request status:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  },

  /**
   * Delete a bid request
   */
  async deleteBidRequest(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bid_requests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting bid request:', error);
        toast.error('Failed to delete bid request');
        return false;
      }

      toast.success('Bid request deleted successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error deleting bid request:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }
};
