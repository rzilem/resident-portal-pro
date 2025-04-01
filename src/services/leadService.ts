
import { supabase } from '@/lib/supabase';
import { Lead, Proposal, EmailTemplate, EmailSequence } from '@/types/lead';

export const leadService = {
  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
    
    return data as Lead[];
  },
  
  async getLead(id: string): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
    
    return data as Lead;
  },
  
  async createLead(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
    
    return data as Lead;
  },
  
  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
    
    return data as Lead;
  },
  
  async deleteLead(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },
  
  async getProposals(): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching proposals:', error);
      throw error;
    }
    
    return data as Proposal[];
  },
  
  async getProposal(id: string): Promise<Proposal> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching proposal:', error);
      throw error;
    }
    
    return data as Proposal;
  },
  
  async createProposal(proposal: Omit<Proposal, 'id' | 'createdAt'>): Promise<Proposal> {
    const { data, error } = await supabase
      .from('proposals')
      .insert([proposal])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
    
    return data as Proposal;
  },
  
  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal> {
    const { data, error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating proposal:', error);
      throw error;
    }
    
    return data as Proposal;
  },
  
  async deleteProposal(id: string): Promise<void> {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting proposal:', error);
      throw error;
    }
  },
  
  async logProposalView(proposalId: string, email: string, ipAddress?: string): Promise<void> {
    const { error } = await supabase
      .from('proposal_views')
      .insert([
        {
          proposalId,
          viewerEmail: email,
          viewerIp: ipAddress
        }
      ]);
    
    if (error) {
      console.error('Error logging proposal view:', error);
      throw error;
    }
    
    // Also increment the view count on the proposal
    await supabase.rpc('increment_proposal_view_count', { proposal_id: proposalId });
  },
  
  async logSectionView(proposalId: string, sectionId: string, email: string, timeSpent: number): Promise<void> {
    const { error } = await supabase
      .from('section_views')
      .insert([
        {
          proposalId,
          sectionId,
          viewerEmail: email,
          timeSpent
        }
      ]);
    
    if (error) {
      console.error('Error logging section view:', error);
      throw error;
    }
  },
  
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }
    
    return data as EmailTemplate[];
  },
  
  async getEmailSequences(): Promise<EmailSequence[]> {
    const { data, error } = await supabase
      .from('email_sequences')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching email sequences:', error);
      throw error;
    }
    
    return data as EmailSequence[];
  }
};
