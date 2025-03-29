
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Delete a bid request
 */
export async function deleteBidRequest(id: string): Promise<boolean> {
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
