
import { useState, useEffect } from 'react';
import { LeadData, LeadTableFilters } from './types';

// This is a mock implementation; in a real app, you'd fetch from an API
export const useLeadsData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Mock leads data with expanded fields
  const leads: LeadData[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      company: 'Acme Inc.',
      phone: '(555) 123-4567',
      status: 'new',
      createdAt: '2023-08-01T09:30:00Z',
      lastContactedAt: null,
      source: 'Email Workflow',
      association_name: 'Riverdale HOA',
      association_type: 'HOA',
      unit_count: 75,
      city: 'Austin',
      state: 'TX',
      has_pool: true,
      has_gate: false,
      has_onsite_management: false
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@techinnovate.com',
      company: 'Tech Innovate',
      phone: '(555) 987-6543',
      status: 'contacted',
      createdAt: '2023-07-25T14:45:00Z',
      lastContactedAt: '2023-07-26T10:15:00Z',
      source: 'Website',
      association_name: 'Lakeside Condos',
      association_type: 'Condo',
      unit_count: 120,
      city: 'Denver',
      state: 'CO',
      has_pool: true,
      has_gate: true,
      has_onsite_management: true
    },
    {
      id: '3',
      name: 'Michael Davis',
      email: 'michael@startupfuture.co',
      company: 'Startup Future',
      phone: '(555) 567-8901',
      status: 'qualified',
      createdAt: '2023-07-15T11:20:00Z',
      lastContactedAt: '2023-07-28T13:30:00Z',
      source: 'Referral',
      association_name: 'Highland Community',
      association_type: 'Community',
      unit_count: 220,
      city: 'Seattle',
      state: 'WA',
      has_pool: false,
      has_gate: false,
      has_onsite_management: false
    },
    {
      id: '4',
      name: 'Linda Martinez',
      email: 'linda.m@globalcorp.com',
      company: 'Global Corp',
      phone: '(555) 234-5678',
      status: 'proposal',
      createdAt: '2023-07-10T16:00:00Z',
      lastContactedAt: '2023-07-30T09:45:00Z',
      source: 'Email Workflow',
      association_name: 'Oceanview Villas',
      association_type: 'HOA',
      unit_count: 85,
      city: 'Miami',
      state: 'FL',
      has_pool: true,
      has_gate: true,
      has_onsite_management: false
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'robert@enterprisetech.net',
      company: 'Enterprise Tech',
      phone: '(555) 345-6789',
      status: 'negotiation',
      createdAt: '2023-07-05T08:15:00Z',
      lastContactedAt: '2023-07-29T15:20:00Z',
      source: 'LinkedIn',
      association_name: 'Mountain View Estates',
      association_type: 'Community',
      unit_count: 150,
      city: 'Portland',
      state: 'OR',
      has_pool: false,
      has_gate: true,
      has_onsite_management: true
    },
  ];

  const filterLeads = (leads: LeadData[], filters: LeadTableFilters) => {
    return leads.filter(lead => {
      const matchesSearch = 
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
