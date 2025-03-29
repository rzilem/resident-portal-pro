
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Update the status of a bid request
 */
export async function updateBidRequestStatus(id: string, status: string): Promise<boolean> {
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
}
