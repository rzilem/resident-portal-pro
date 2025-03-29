
import { supabase } from '@/integrations/supabase/client';
import { BidRequestFormData } from '@/pages/resale/wizard/types';
import { toast } from 'sonner';

/**
 * Save a new bid request to the database
 */
export async function createBidRequest(formData: BidRequestFormData): Promise<string | null> {
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
        due_date: formData.dueDate ? formData.dueDate.toISOString() : null,
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
}
