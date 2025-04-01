
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LeadData, LeadTableFilters } from './types';
import { toast } from 'sonner';

export const useLeadsData = () => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('createdat', { ascending: false });
        
        if (error) throw error;

        // Map the database column names to our frontend model
        const mappedLeads: LeadData[] = data.map(lead => ({
          id: lead.id,
          name: lead.name || 'Unknown',
          email: lead.email,
          company: lead.company,
          phone: lead.phone,
          status: lead.status,
          lastContactedAt: lead.lastcontactedat,
          createdAt: lead.createdat,
          source: lead.source,
          association_name: lead.association_name,
          association_type: lead.association_type,
          unit_count: lead.unit_count,
          city: lead.city,
          state: lead.state,
          has_pool: lead.has_pool,
          has_gate: lead.has_gate,
          has_onsite_management: lead.has_onsite_management
        }));

        setLeads(mappedLeads);
        setError(null);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching leads'));
        toast.error('Failed to load leads');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filterLeads = (leads: LeadData[], filters: LeadTableFilters) => {
    return leads.filter(lead => {
      const matchesSearch = !filters.search || 
        (lead.name?.toLowerCase().includes(filters.search.toLowerCase()) || false) ||
        (lead.email?.toLowerCase().includes(filters.search.toLowerCase()) || false) ||
        (lead.company?.toLowerCase().includes(filters.search.toLowerCase()) || false) ||
        (lead.association_name?.toLowerCase().includes(filters.search.toLowerCase()) || false);
      
      const matchesStatus = filters.statusFilter === 'all' || lead.status === filters.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  return {
    leads,
    isLoading,
    error,
    filterLeads
  };
};
