
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ViolationRow } from '@/types/compliance';
import { formatDistanceToNow } from 'date-fns';

interface Violation {
  id: string;
  property: string;
  violation_type: string;
  reported_date: string;
  status: string;
}

interface UseViolationsResult {
  violations: Violation[];
  loading: boolean;
  error: string | null;
}

export const useViolations = (associationId?: string): UseViolationsResult => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!associationId) {
      setLoading(false);
      return;
    }

    const fetchViolations = async () => {
      try {
        setLoading(true);
        
        // Fetch violations for the selected association
        const { data, error } = await supabase
          .from('violations')
          .select(`
            id,
            property_id,
            violation_type,
            reported_date,
            status,
            properties(address)
          `)
          .eq('association_id', associationId)
          .order('reported_date', { ascending: false });

        if (error) throw error;

        // Transform data for the table
        const formattedViolations = data?.map(item => ({
          id: item.id,
          property: item.properties?.address || 'Unknown Property',
          violation_type: item.violation_type || 'Unspecified',
          reported_date: item.reported_date,
          status: item.status || 'open'
        })) || [];

        setViolations(formattedViolations);
      } catch (err) {
        console.error('Error fetching violations:', err);
        setError('Failed to load violations');
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, [associationId]);

  return { violations, loading, error };
};
