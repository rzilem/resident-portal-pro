
import { Alert } from '@/types/alert';
import { supabase } from '@/integrations/supabase/client';
import { mockAlerts } from '@/data/mockAlerts';

export const fetchViolations = async (associationId?: string) => {
  try {
    let query = supabase
      .from('violations')
      .select(`
        id,
        violation_type,
        description,
        status,
        severity,
        reported_date,
        resolved_date,
        property_id,
        association_id
      `)
      .order('reported_date', { ascending: false });

    if (associationId) {
      query = query.eq('association_id', associationId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching violations:', error);
      throw new Error('Failed to fetch violations');
    }

    // Convert to Alert type
    return data.map((violation): Alert => ({
      id: violation.id,
      title: violation.violation_type,
      description: violation.description || '',
      category: 'compliance',
      severity: (violation.severity as Alert['severity']) || 'medium',
      status: (violation.status as Alert['status']) || 'new',
      createdAt: violation.reported_date,
      resolvedAt: violation.resolved_date,
      propertyId: violation.property_id,
      associationId: violation.association_id
    }));
  } catch (error) {
    console.error('Error in fetchViolations:', error);
    return [];
  }
};

export const fetchAlertById = async (alertId: string): Promise<Alert | null> => {
  try {
    // Example function to fetch a specific alert
    // In a real app, we would fetch from the database
    const { data, error } = await supabase
      .from('violations')
      .select()
      .eq('id', alertId)
      .single();

    if (error || !data) {
      console.error('Error fetching alert:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.violation_type,
      description: data.description || '',
      category: 'compliance',
      severity: (data.severity as Alert['severity']) || 'medium',
      status: (data.status as Alert['status']) || 'new',
      createdAt: data.reported_date,
      resolvedAt: data.resolved_date,
      propertyId: data.property_id,
      associationId: data.association_id
    };
  } catch (error) {
    console.error('Error in fetchAlertById:', error);
    return null;
  }
};

// Add the missing function for AIAnalysisCard.tsx
export const getAlertsForAssociation = async (associationId: string): Promise<Alert[]> => {
  try {
    if (!associationId) return [];
    
    // For now, use mock data filtered by associationId
    // In a real app, we would fetch from the database
    return mockAlerts.filter(alert => 
      alert.associationId === associationId || 
      alert.scope === 'global'
    );
  } catch (error) {
    console.error('Error getting alerts for association:', error);
    return [];
  }
};

// Add the missing function for CIInsightsWidget.tsx
export const getRecentAlerts = (associationId?: string | null): Alert[] => {
  if (!associationId) {
    // Return global alerts if no association is selected
    return mockAlerts.filter(alert => alert.isRecent && (alert.scope === 'global'));
  }
  
  // Return alerts for the specific association and global alerts
  return mockAlerts.filter(alert => 
    alert.isRecent && (
      alert.associationId === associationId || 
      alert.scope === 'global'
    )
  );
};
