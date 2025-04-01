
import { supabase } from '@/integrations/supabase/client';
import { BidRequestFormData } from '@/pages/resale/wizard/types';
import { v4 as uuidv4 } from 'uuid';
import { associateImageWithBidRequest } from '@/utils/supabase/uploadProjectImage';

/**
 * Creates a new bid request in the database
 * @param formData The bid request form data
 * @returns The ID of the created bid request
 */
export const createBidRequest = async (formData: BidRequestFormData): Promise<string> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Format due date if it exists
    let dueDate = null;
    if (formData.dueDate) {
      dueDate = new Date(formData.dueDate).toISOString().split('T')[0];
    }
    
    // Create the bid request
    const { data: bidRequest, error } = await supabase
      .from('bid_requests')
      .insert({
        project_type: formData.projectType,
        answers: formData.answers,
        notes: formData.notes,
        due_date: dueDate,
        user_id: userId,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating bid request:', error);
      throw error;
    }
    
    // Create vendor assignments
    if (formData.vendors && formData.vendors.length > 0) {
      const vendorRecords = formData.vendors.map(vendorId => ({
        id: uuidv4(),
        bid_request_id: bidRequest.id,
        vendor_id: vendorId,
        status: 'pending',
        created_at: new Date().toISOString()
      }));
      
      const { error: vendorError } = await supabase
        .from('bid_request_vendors')
        .insert(vendorRecords);
      
      if (vendorError) {
        console.error('Error creating vendor assignments:', vendorError);
        // Continue anyway
      }
    }
    
    return bidRequest.id;
  } catch (error) {
    console.error('Error in createBidRequest:', error);
    throw error;
  }
};
