
import { useState, useEffect, useCallback } from 'react';
import { EmailTemplate } from '@/types/lead';
import { emailTemplateService } from '@/services/emailTemplateService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

export function useLeadEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTemplates = useCallback(async (category?: string) => {
    setIsLoading(true);
    try {
      const fetchedTemplates = await emailTemplateService.getTemplates(category);
      setTemplates(fetchedTemplates);
      setError(null);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const fetchedCategories = await emailTemplateService.getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, [fetchTemplates, fetchCategories]);

  const createTemplate = useCallback(async (template: Omit<EmailTemplate, 'id' | 'createdat' | 'updatedat'>) => {
    try {
      const newTemplate = await emailTemplateService.createTemplate({
        ...template,
        createdby: user?.id
      });
      
      if (newTemplate) {
        setTemplates(prev => [...prev, newTemplate]);
        fetchCategories(); // Refresh categories in case a new one was added
      }
      
      return newTemplate;
    } catch (err) {
      console.error('Error creating template:', err);
      toast.error('Failed to create template');
      throw err;
    }
  }, [user, fetchCategories]);

  const updateTemplate = useCallback(async (id: string, updates: Partial<EmailTemplate>) => {
    try {
      const updatedTemplate = await emailTemplateService.updateTemplate(id, updates);
      
      if (updatedTemplate) {
        setTemplates(prev => 
          prev.map(template => template.id === id ? updatedTemplate : template)
        );
        
        if (selectedTemplate?.id === id) {
          setSelectedTemplate(updatedTemplate);
        }
        
        fetchCategories(); // Refresh categories in case the category was updated
      }
      
      return updatedTemplate;
    } catch (err) {
      console.error('Error updating template:', err);
      toast.error('Failed to update template');
      throw err;
    }
  }, [selectedTemplate, fetchCategories]);

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      const success = await emailTemplateService.deleteTemplate(id);
      
      if (success) {
        setTemplates(prev => prev.filter(template => template.id !== id));
        
        if (selectedTemplate?.id === id) {
          setSelectedTemplate(null);
        }
        
        fetchCategories(); // Refresh categories in case all templates in a category were deleted
      }
      
      return success;
    } catch (err) {
      console.error('Error deleting template:', err);
      toast.error('Failed to delete template');
      throw err;
    }
  }, [selectedTemplate, fetchCategories]);

  const previewTemplate = useCallback((templateContent: string) => {
    return emailTemplateService.previewTemplate(templateContent);
  }, []);

  const renderTemplate = useCallback((templateContent: string, data: any) => {
    return emailTemplateService.renderTemplate(templateContent, data);
  }, []);

  const getAvailableVariables = useCallback(() => {
    return emailTemplateService.getAvailableVariables();
  }, []);

  return {
    templates,
    categories,
    selectedTemplate,
    setSelectedTemplate,
    isLoading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    previewTemplate,
    renderTemplate,
    getAvailableVariables
  };
}
