
import { supabase } from '@/lib/supabase';
import { Proposal, ProposalSection } from '@/types/lead';
import { toast } from 'sonner';
import { getFileUrl } from '@/utils/supabase/storage/getUrl';

export interface ProposalTemplate {
  id: string;
  name: string;
  description?: string;
  sections: ProposalSection[];
  createdAt: string;
  createdBy?: string;
}

export const proposalService = {
  /**
   * Get all proposals
   * @returns Promise with the proposals
   */
  async getProposals(): Promise<Proposal[]> {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('createdat', { ascending: false });
      
      if (error) {
        console.error('Error fetching proposals:', error);
        throw error;
      }
      
      return data as Proposal[];
    } catch (error) {
      console.error('Error in getProposals:', error);
      return [];
    }
  },
  
  /**
   * Get a single proposal by ID
   * @param id The ID of the proposal
   * @returns Promise with the proposal or null
   */
  async getProposalById(id: string): Promise<Proposal | null> {
    try {
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
    } catch (error) {
      console.error('Error in getProposalById:', error);
      return null;
    }
  },
  
  /**
   * Create a new proposal
   * @param proposal The proposal to create
   * @returns Promise with the created proposal or null
   */
  async createProposal(proposal: Omit<Proposal, 'id' | 'createdat' | 'updatedat' | 'viewcount' | 'lastviewedat'>): Promise<Proposal | null> {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .insert([{
          ...proposal,
          viewcount: 0
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating proposal:', error);
        toast.error('Failed to create proposal');
        throw error;
      }
      
      toast.success('Proposal created successfully');
      return data as Proposal;
    } catch (error) {
      console.error('Error in createProposal:', error);
      return null;
    }
  },
  
  /**
   * Update an existing proposal
   * @param id The ID of the proposal to update
   * @param updates The proposal updates
   * @returns Promise with the updated proposal or null
   */
  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | null> {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .update({
          ...updates,
          updatedat: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating proposal:', error);
        toast.error('Failed to update proposal');
        throw error;
      }
      
      toast.success('Proposal updated successfully');
      return data as Proposal;
    } catch (error) {
      console.error('Error in updateProposal:', error);
      return null;
    }
  },
  
  /**
   * Delete a proposal
   * @param id The ID of the proposal to delete
   * @returns Promise with success status
   */
  async deleteProposal(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting proposal:', error);
        toast.error('Failed to delete proposal');
        throw error;
      }
      
      toast.success('Proposal deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteProposal:', error);
      return false;
    }
  },
  
  /**
   * Add a section to a proposal
   * @param proposalId The ID of the proposal
   * @param section The section to add
   * @returns Promise with the updated proposal or null
   */
  async addSection(proposalId: string, section: Omit<ProposalSection, 'id'>): Promise<Proposal | null> {
    try {
      // Get the current proposal
      const { data: proposal, error: fetchError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching proposal:', fetchError);
        throw fetchError;
      }
      
      // Create new section with ID
      const newSection: ProposalSection = {
        ...section,
        id: crypto.randomUUID()
      };
      
      // Add the section to the sections array
      const updatedSections = [
        ...proposal.sections,
        newSection
      ];
      
      // Update the proposal
      const { data, error } = await supabase
        .from('proposals')
        .update({
          sections: updatedSections,
          updatedat: new Date().toISOString()
        })
        .eq('id', proposalId)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding section:', error);
        toast.error('Failed to add section');
        throw error;
      }
      
      toast.success('Section added successfully');
      return data as Proposal;
    } catch (error) {
      console.error('Error in addSection:', error);
      return null;
    }
  },
  
  /**
   * Update a section in a proposal
   * @param proposalId The ID of the proposal
   * @param sectionId The ID of the section to update
   * @param updates The section updates
   * @returns Promise with the updated proposal or null
   */
  async updateSection(proposalId: string, sectionId: string, updates: Partial<ProposalSection>): Promise<Proposal | null> {
    try {
      // Get the current proposal
      const { data: proposal, error: fetchError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching proposal:', fetchError);
        throw fetchError;
      }
      
      // Find and update the section
      const updatedSections = proposal.sections.map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      );
      
      // Update the proposal
      const { data, error } = await supabase
        .from('proposals')
        .update({
          sections: updatedSections,
          updatedat: new Date().toISOString()
        })
        .eq('id', proposalId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating section:', error);
        toast.error('Failed to update section');
        throw error;
      }
      
      toast.success('Section updated successfully');
      return data as Proposal;
    } catch (error) {
      console.error('Error in updateSection:', error);
      return null;
    }
  },
  
  /**
   * Remove a section from a proposal
   * @param proposalId The ID of the proposal
   * @param sectionId The ID of the section to remove
   * @returns Promise with the updated proposal or null
   */
  async removeSection(proposalId: string, sectionId: string): Promise<Proposal | null> {
    try {
      // Get the current proposal
      const { data: proposal, error: fetchError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching proposal:', fetchError);
        throw fetchError;
      }
      
      // Filter out the section to remove
      const updatedSections = proposal.sections.filter(section => section.id !== sectionId);
      
      // Update the proposal
      const { data, error } = await supabase
        .from('proposals')
        .update({
          sections: updatedSections,
          updatedat: new Date().toISOString()
        })
        .eq('id', proposalId)
        .select()
        .single();
      
      if (error) {
        console.error('Error removing section:', error);
        toast.error('Failed to remove section');
        throw error;
      }
      
      toast.success('Section removed successfully');
      return data as Proposal;
    } catch (error) {
      console.error('Error in removeSection:', error);
      return null;
    }
  },
  
  /**
   * Reorder sections in a proposal
   * @param proposalId The ID of the proposal
   * @param sectionIds Ordered array of section IDs
   * @returns Promise with the updated proposal or null
   */
  async reorderSections(proposalId: string, sectionIds: string[]): Promise<Proposal | null> {
    try {
      // Get the current proposal
      const { data: proposal, error: fetchError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching proposal:', fetchError);
        throw fetchError;
      }
      
      // Create a map of sections by ID for faster lookup
      const sectionsMap = new Map();
      proposal.sections.forEach(section => {
        sectionsMap.set(section.id, section);
      });
      
      // Reorder sections based on the provided IDs
      const reorderedSections = sectionIds
        .map(id => sectionsMap.get(id))
        .filter(section => section !== undefined);
      
      // Update the proposal
      const { data, error } = await supabase
        .from('proposals')
        .update({
          sections: reorderedSections,
          updatedat: new Date().toISOString()
        })
        .eq('id', proposalId)
        .select()
        .single();
      
      if (error) {
        console.error('Error reordering sections:', error);
        toast.error('Failed to reorder sections');
        throw error;
      }
      
      toast.success('Sections reordered successfully');
      return data as Proposal;
    } catch (error) {
      console.error('Error in reorderSections:', error);
      return null;
    }
  },
  
  /**
   * Upload a file for a proposal section (image, PDF, etc.)
   * @param proposalId The ID of the proposal
   * @param sectionId The ID of the section
   * @param file The file to upload
   * @returns Promise with the file URL or null
   */
  async uploadSectionFile(proposalId: string, sectionId: string, file: File): Promise<string | null> {
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = `proposals/${proposalId}/${sectionId}/${fileName}`;
      
      // Upload the file to storage
      const { error: uploadError } = await supabase.storage
        .from('proposal_assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error('Failed to upload file');
        throw uploadError;
      }
      
      // Get the file URL
      const fileUrl = getFileUrl('proposal_assets', filePath);
      
      toast.success('File uploaded successfully');
      return fileUrl;
    } catch (error) {
      console.error('Error in uploadSectionFile:', error);
      return null;
    }
  },
  
  /**
   * Generate a shareable link for a proposal
   * @param proposalId The ID of the proposal
   * @param expiryDays Optional number of days until link expires
   * @returns Promise with the share link or null
   */
  async generateShareLink(proposalId: string, expiryDays?: number): Promise<{ url: string; expiresAt?: string } | null> {
    try {
      // Create a share record with optional expiration
      const expiresAt = expiryDays
        ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined;
      
      const { data, error } = await supabase
        .from('proposal_shares')
        .insert([{
          proposal_id: proposalId,
          share_key: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          expires_at: expiresAt
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error generating share link:', error);
        toast.error('Failed to generate share link');
        throw error;
      }
      
      // Construct the share URL
      const shareUrl = `${window.location.origin}/proposals/view/${data.share_key}`;
      
      return {
        url: shareUrl,
        expiresAt: expiresAt
      };
    } catch (error) {
      console.error('Error in generateShareLink:', error);
      return null;
    }
  },
  
  /**
   * Save a proposal as a template
   * @param proposalId The ID of the proposal to save as template
   * @param templateName Optional name for the template
   * @returns Promise with the created template or null
   */
  async saveAsTemplate(proposalId: string, templateName?: string): Promise<ProposalTemplate | null> {
    try {
      // Get the proposal to save as template
      const { data: proposal, error: fetchError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching proposal:', fetchError);
        throw fetchError;
      }
      
      // Create the template
      const { data, error } = await supabase
        .from('proposal_templates')
        .insert([{
          name: templateName || `${proposal.name} Template`,
          description: proposal.description,
          sections: proposal.sections,
          created_at: new Date().toISOString(),
          created_by: proposal.createdby
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error saving template:', error);
        toast.error('Failed to save as template');
        throw error;
      }
      
      toast.success('Saved as template successfully');
      return data as unknown as ProposalTemplate;
    } catch (error) {
      console.error('Error in saveAsTemplate:', error);
      return null;
    }
  },
  
  /**
   * Create a proposal from a template
   * @param templateId The ID of the template
   * @param proposalName Name for the new proposal
   * @returns Promise with the created proposal or null
   */
  async createFromTemplate(templateId: string, proposalName: string): Promise<Proposal | null> {
    try {
      // Get the template
      const { data: template, error: fetchError } = await supabase
        .from('proposal_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching template:', fetchError);
        throw fetchError;
      }
      
      // Create a new proposal from the template
      const { data, error } = await supabase
        .from('proposals')
        .insert([{
          name: proposalName,
          description: template.description,
          sections: template.sections,
          viewcount: 0,
          createdby: template.created_by
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating from template:', error);
        toast.error('Failed to create from template');
        throw error;
      }
      
      toast.success('Proposal created from template successfully');
      return data as Proposal;
    } catch (error) {
      console.error('Error in createFromTemplate:', error);
      return null;
    }
  }
};
