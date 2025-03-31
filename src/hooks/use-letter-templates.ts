
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LetterTemplate } from '@/types/letter-templates';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useLetterTemplates = () => {
  const [templates, setTemplates] = useState<LetterTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample data to start with
  const sampleTemplates: LetterTemplate[] = [
    {
      id: 'sample-1',
      name: 'First Violation Notice',
      description: 'Initial notice for community violations',
      category: 'Compliance',
      content: '<p>Dear {{resident.first_name}} {{resident.last_name}},</p><p>This letter serves as notification that a violation of the community rules has been observed at your property located at {{property.address}}.</p><p><strong>Violation: {{violation.description}}</strong></p><p>Please take the necessary steps to correct this issue by {{violation.due_date}}. If you believe this notice was sent in error or have questions, please contact the management office.</p><p>Thank you for your prompt attention to this matter.</p><p>Sincerely,<br>{{association.name}} Management</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-2',
      name: 'Past Due Assessment Notice',
      description: 'Notice for homeowners with past due assessments',
      category: 'Delinquency',
      content: '<p>Dear {{resident.first_name}} {{resident.last_name}},</p><p>Our records indicate that your account has a past due balance of <strong>${{account.past_due_amount}}</strong> for your property located at {{property.address}}.</p><p>Please remit payment promptly to avoid additional late fees or legal action. If you have already sent your payment, please disregard this notice.</p><p>If you have any questions or concerns, please contact our accounting department.</p><p>Sincerely,<br>{{association.name}} Management</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-3',
      name: 'ARC Request Approval',
      description: 'Notification of approval for architectural review requests',
      category: 'Architectural',
      content: '<p>Dear {{resident.first_name}} {{resident.last_name}},</p><p>We are pleased to inform you that your Architectural Review Committee request for <strong>{{arc.request_description}}</strong> at your property located at {{property.address}} has been <strong>approved</strong>.</p><p>Please note that all work must be completed within 90 days and in accordance with the submitted plans and specifications.</p><p>Thank you for your cooperation in maintaining the standards of our community.</p><p>Sincerely,<br>{{association.name}} Architectural Review Committee</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Fetch letter templates
  useEffect(() => {
    const fetchLetterTemplates = async () => {
      setIsLoading(true);
      try {
        // Check if we have a Supabase client
        if (supabase) {
          // Try to fetch from Supabase
          const { data, error } = await supabase
            .from('letter_templates')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error('Error fetching letter templates:', error);
            // Fallback to sample data
            setTemplates(sampleTemplates);
          } else if (data.length === 0) {
            // If no templates exist yet, use sample data
            setTemplates(sampleTemplates);
          } else {
            // Map Supabase data to our LetterTemplate type
            const mappedData: LetterTemplate[] = data.map(item => ({
              id: item.id,
              name: item.name,
              description: item.description || '',
              category: item.category,
              content: item.content,
              createdAt: item.created_at,
              updatedAt: item.updated_at
            }));
            setTemplates(mappedData);
          }
        } else {
          // Use sample data if no Supabase
          setTemplates(sampleTemplates);
        }
      } catch (error) {
        console.error('Error in fetchLetterTemplates:', error);
        // Fallback to sample data
        setTemplates(sampleTemplates);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLetterTemplates();
  }, []);
  
  // Create a new template
  const createTemplate = async (template: LetterTemplate): Promise<LetterTemplate> => {
    const newTemplate = {
      ...template,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      if (supabase) {
        // Insert to Supabase
        const { error } = await supabase
          .from('letter_templates')
          .insert({
            id: newTemplate.id,
            name: newTemplate.name,
            description: newTemplate.description,
            category: newTemplate.category,
            content: newTemplate.content,
            created_at: newTemplate.createdAt,
            updated_at: newTemplate.updatedAt
          });
          
        if (error) {
          console.error('Error creating letter template in Supabase:', error);
          toast.error('Failed to save template to database');
        }
      }
      
      // Update local state
      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (error) {
      console.error('Error in createTemplate:', error);
      toast.error('Failed to create template');
      throw error;
    }
  };
  
  // Update an existing template
  const updateTemplate = async (template: LetterTemplate): Promise<LetterTemplate> => {
    const updatedTemplate = {
      ...template,
      updatedAt: new Date().toISOString()
    };
    
    try {
      if (supabase) {
        // Update in Supabase
        const { error } = await supabase
          .from('letter_templates')
          .update({
            name: updatedTemplate.name,
            description: updatedTemplate.description,
            category: updatedTemplate.category,
            content: updatedTemplate.content,
            updated_at: updatedTemplate.updatedAt
          })
          .eq('id', updatedTemplate.id);
          
        if (error) {
          console.error('Error updating letter template in Supabase:', error);
          toast.error('Failed to update template in database');
        }
      }
      
      // Update local state
      setTemplates(prev => 
        prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t)
      );
      return updatedTemplate;
    } catch (error) {
      console.error('Error in updateTemplate:', error);
      toast.error('Failed to update template');
      throw error;
    }
  };
  
  // Delete a template
  const deleteTemplate = async (id: string): Promise<void> => {
    try {
      if (supabase) {
        // Delete from Supabase
        const { error } = await supabase
          .from('letter_templates')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Error deleting letter template from Supabase:', error);
          toast.error('Failed to delete template from database');
        }
      }
      
      // Update local state
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error in deleteTemplate:', error);
      toast.error('Failed to delete template');
      throw error;
    }
  };
  
  // Get a template by ID
  const getTemplateById = (id: string): LetterTemplate | undefined => {
    return templates.find(t => t.id === id);
  };
  
  // Get templates by category
  const getTemplatesByCategory = (category: string): LetterTemplate[] => {
    return templates.filter(t => t.category === category);
  };
  
  return {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById,
    getTemplatesByCategory
  };
};
