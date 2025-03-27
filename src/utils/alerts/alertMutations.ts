
import { Alert } from '@/types/alert';
import { supabase } from '@/integrations/supabase/client';

export const updateAlertStatus = async (alertId: string, newStatus: Alert['status']) => {
  try {
    const { data, error } = await supabase
      .from('violations')
      .update({ 
        status: newStatus,
        resolved_date: newStatus === 'resolved' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', alertId)
      .select();

    if (error) {
      console.error('Error updating alert status:', error);
      throw new Error('Failed to update alert status');
    }

    return data;
  } catch (error) {
    console.error('Error in updateAlertStatus:', error);
    throw error;
  }
};

export const createViolation = async (violationData: {
  association_id: string;
  property_id: string;
  violation_type: string;
  description?: string;
  severity?: string;
  due_date?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('violations')
      .insert({
        association_id: violationData.association_id,
        property_id: violationData.property_id,
        violation_type: violationData.violation_type,
        description: violationData.description,
        severity: violationData.severity || 'medium',
        due_date: violationData.due_date,
        status: 'open',
        reported_date: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Error creating violation:', error);
      throw new Error('Failed to create violation');
    }

    return data;
  } catch (error) {
    console.error('Error in createViolation:', error);
    throw error;
  }
};
