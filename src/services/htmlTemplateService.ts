
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HtmlTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  category: string;
  association_id?: string;
  is_global: boolean;
  tags?: string[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export const htmlTemplateService = {
  async getTemplates(associationId?: string): Promise<HtmlTemplate[]> {
    try {
      let query = supabase
        .from('html_templates')
        .select('*')
        .order('name');

      if (associationId) {
        query = query.or(`association_id.eq.${associationId},is_global.eq.true`);
      } else {
        query = query.eq('is_global', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching HTML templates:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTemplates:', error);
      return [];
    }
  },

  async getTemplateById(id: string): Promise<HtmlTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('html_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching HTML template:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getTemplateById:', error);
      return null;
    }
  },

  async createTemplate(template: Omit<HtmlTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<HtmlTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('html_templates')
        .insert(template)
        .select()
        .single();

      if (error) {
        console.error('Error creating HTML template:', error);
        toast.error('Failed to create template');
        throw error;
      }

      toast.success('Template created successfully');
      return data;
    } catch (error) {
      console.error('Error in createTemplate:', error);
      return null;
    }
  },

  async updateTemplate(id: string, updates: Partial<HtmlTemplate>): Promise<HtmlTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('html_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating HTML template:', error);
        toast.error('Failed to update template');
        throw error;
      }

      toast.success('Template updated successfully');
      return data;
    } catch (error) {
      console.error('Error in updateTemplate:', error);
      return null;
    }
  },

  async deleteTemplate(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('html_templates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting HTML template:', error);
        toast.error('Failed to delete template');
        throw error;
      }

      toast.success('Template deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteTemplate:', error);
      return false;
    }
  }
};
