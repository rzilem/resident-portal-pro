
import { useState, useEffect, useCallback } from 'react';
import { htmlTemplateService, HtmlTemplate } from '@/services/htmlTemplateService';
import { useAuth } from '@/hooks/use-auth';

export function useHtmlTemplates(associationId?: string) {
  const [templates, setTemplates] = useState<HtmlTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<HtmlTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTemplates = await htmlTemplateService.getTemplates(associationId);
      setTemplates(fetchedTemplates);
      setError(null);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  }, [associationId]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = useCallback(async (template: Omit<HtmlTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTemplate = await htmlTemplateService.createTemplate({
        ...template,
        created_by: user?.id
      });
      
      if (newTemplate) {
        setTemplates(prev => [...prev, newTemplate]);
      }
      
      return newTemplate;
    } catch (err) {
      console.error('Error creating template:', err);
      throw err;
    }
  }, [user]);

  const updateTemplate = useCallback(async (id: string, updates: Partial<HtmlTemplate>) => {
    try {
      const updatedTemplate = await htmlTemplateService.updateTemplate(id, updates);
      
      if (updatedTemplate) {
        setTemplates(prev => 
          prev.map(template => template.id === id ? updatedTemplate : template)
        );
        
        if (selectedTemplate?.id === id) {
          setSelectedTemplate(updatedTemplate);
        }
      }
      
      return updatedTemplate;
    } catch (err) {
      console.error('Error updating template:', err);
      throw err;
    }
  }, [selectedTemplate]);

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      const success = await htmlTemplateService.deleteTemplate(id);
      
      if (success) {
        setTemplates(prev => prev.filter(template => template.id !== id));
        
        if (selectedTemplate?.id === id) {
          setSelectedTemplate(null);
        }
      }
      
      return success;
    } catch (err) {
      console.error('Error deleting template:', err);
      throw err;
    }
  }, [selectedTemplate]);

  return {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    isLoading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
}
