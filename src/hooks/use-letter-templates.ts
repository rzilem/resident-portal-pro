
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { LetterTemplate } from '@/types/letter-templates';
import { useAuth } from '@/hooks/use-auth';
import { v4 as uuidv4 } from 'uuid';

// Sample templates for fallback
const sampleTemplates: LetterTemplate[] = [
  {
    id: '1',
    name: 'Welcome Letter',
    description: 'A warm welcome to new residents',
    category: 'Welcome',
    content: '<p>Dear {{resident.name}},</p><p>Welcome to our community! We are delighted to have you as a new resident...</p>',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Late Payment Notice',
    description: 'First notice for late assessment payment',
    category: 'Delinquency',
    content: '<p>Dear {{resident.name}},</p><p>Our records indicate that your account has an outstanding balance of {{financial.balanceDue}}...</p>',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Violation Notice',
    description: 'Notice of CC&R violation',
    category: 'Compliance',
    content: '<p>Dear {{resident.name}},</p><p>During a recent inspection, it was noted that the property at {{property.address}} is in violation of community guidelines...</p>',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Architectural Review Approval',
    description: 'Notification of approval for submitted architectural request',
    category: 'Architectural',
    content: '<p>Dear {{resident.name}},</p><p>We are pleased to inform you that your architectural review request for {{property.address}} has been approved by the committee...</p>',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Annual Meeting Notice',
    description: 'Notification of upcoming annual meeting',
    category: 'Meeting',
    content: '<p>Dear {{resident.name}},</p><p>The Annual Meeting of the {{association.name}} will be held on {{date.meeting}} at 7:00 PM...</p>',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useLetterTemplates = () => {
  const [templates, setTemplates] = useState<LetterTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Fetch templates from Supabase
  const fetchTemplates = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('letter_templates')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedTemplates: LetterTemplate[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          category: item.category,
          content: item.content,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
        
        setTemplates(formattedTemplates);
      } else {
        // Fallback to sample templates if no data
        console.log('No letter templates found in database, using sample templates');
        setTemplates(sampleTemplates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
      // Fallback to sample templates on error
      setTemplates(sampleTemplates);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new template
  const createTemplate = async (template: Omit<LetterTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('You must be logged in to create templates');
      return null;
    }
    
    try {
      const newTemplate = {
        name: template.name,
        description: template.description,
        category: template.category,
        content: template.content,
        created_by: user.id
      };
      
      const { data, error } = await supabase
        .from('letter_templates')
        .insert(newTemplate)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      const createdTemplate: LetterTemplate = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        category: data.category,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setTemplates(prev => [...prev, createdTemplate]);
      return createdTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
      return null;
    }
  };

  // Update an existing template
  const updateTemplate = async (id: string, updates: Partial<Omit<LetterTemplate, 'id' | 'createdAt' | 'updatedAt'>>) => {
    if (!user) {
      toast.error('You must be logged in to update templates');
      return null;
    }
    
    try {
      // Convert to snake_case for database
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.content) dbUpdates.content = updates.content;
      
      const { data, error } = await supabase
        .from('letter_templates')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      const updatedTemplate: LetterTemplate = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        category: data.category,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
      return updatedTemplate;
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
      return null;
    }
  };

  // Delete a template
  const deleteTemplate = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete templates');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('letter_templates')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast.success('Template deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
      return false;
    }
  };

  // Load templates on initial render
  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates: fetchTemplates
  };
};
