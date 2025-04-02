
import { useState, useCallback } from 'react';
import { Proposal, ProposalSection } from '@/types/lead';
import { proposalService } from '@/services/proposalService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

export function useProposalCreator(initialProposal?: Proposal) {
  const [proposal, setProposal] = useState<Partial<Proposal>>(initialProposal || {
    name: '',
    description: '',
    sections: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const updateProposalDetails = useCallback((updates: Partial<Proposal>) => {
    setProposal(prev => ({ ...prev, ...updates }));
  }, []);

  const addSection = useCallback((section: Omit<ProposalSection, 'id'>) => {
    const newSection: ProposalSection = {
      ...section,
      id: crypto.randomUUID()
    };
    
    setProposal(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }));
  }, []);

  const updateSection = useCallback((sectionId: string, updates: Partial<ProposalSection>) => {
    setProposal(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setProposal(prev => ({
      ...prev,
      sections: (prev.sections || []).filter(section => section.id !== sectionId)
    }));
  }, []);

  const reorderSections = useCallback((sectionIds: string[]) => {
    setProposal(prev => {
      // Create a map of sections by ID for faster lookup
      const sectionsMap = new Map();
      (prev.sections || []).forEach(section => {
        sectionsMap.set(section.id, section);
      });
      
      // Reorder sections based on the provided IDs
      const reorderedSections = sectionIds
        .map(id => sectionsMap.get(id))
        .filter(section => section !== undefined);
      
      return {
        ...prev,
        sections: reorderedSections
      };
    });
  }, []);

  const uploadSectionFile = useCallback(async (sectionId: string, file: File): Promise<string | null> => {
    if (!proposal.id) {
      toast.error('Please save the proposal first before uploading files');
      return null;
    }
    
    try {
      const fileUrl = await proposalService.uploadSectionFile(proposal.id, sectionId, file);
      return fileUrl;
    } catch (err) {
      console.error('Error uploading file:', err);
      toast.error('Failed to upload file');
      return null;
    }
  }, [proposal.id]);

  const saveProposal = useCallback(async (): Promise<Proposal | null> => {
    if (!proposal.name) {
      setError('Proposal name is required');
      toast.error('Proposal name is required');
      return null;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      let savedProposal: Proposal | null = null;
      
      if (proposal.id) {
        // Update existing proposal
        savedProposal = await proposalService.updateProposal(proposal.id, proposal);
      } else {
        // Create new proposal
        savedProposal = await proposalService.createProposal({
          name: proposal.name,
          description: proposal.description || '',
          sections: proposal.sections || [],
          createdBy: user?.id
        });
        
        if (savedProposal) {
          setProposal(savedProposal);
        }
      }
      
      return savedProposal;
    } catch (err) {
      console.error('Error saving proposal:', err);
      setError('Failed to save proposal');
      toast.error('Failed to save proposal');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [proposal, user?.id]);

  const generateShareLink = useCallback(async (expiryDays?: number): Promise<{ url: string; expiresAt?: string } | null> => {
    if (!proposal.id) {
      toast.error('Please save the proposal first before generating a share link');
      return null;
    }
    
    try {
      const shareLink = await proposalService.generateShareLink(proposal.id, expiryDays);
      return shareLink;
    } catch (err) {
      console.error('Error generating share link:', err);
      toast.error('Failed to generate share link');
      return null;
    }
  }, [proposal.id]);

  const saveAsTemplate = useCallback(async (templateName?: string): Promise<boolean> => {
    if (!proposal.id) {
      toast.error('Please save the proposal first before saving as a template');
      return false;
    }
    
    try {
      const template = await proposalService.saveAsTemplate(proposal.id, templateName);
      return !!template;
    } catch (err) {
      console.error('Error saving as template:', err);
      toast.error('Failed to save as template');
      return false;
    }
  }, [proposal.id]);

  const loadProposal = useCallback(async (proposalId: string): Promise<boolean> => {
    try {
      const loadedProposal = await proposalService.getProposalById(proposalId);
      
      if (loadedProposal) {
        setProposal(loadedProposal);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error loading proposal:', err);
      setError('Failed to load proposal');
      toast.error('Failed to load proposal');
      return false;
    }
  }, []);

  return {
    proposal,
    isSaving,
    error,
    updateProposalDetails,
    addSection,
    updateSection,
    removeSection,
    reorderSections,
    uploadSectionFile,
    saveProposal,
    generateShareLink,
    saveAsTemplate,
    loadProposal
  };
}
