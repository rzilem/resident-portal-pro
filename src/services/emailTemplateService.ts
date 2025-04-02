
import { supabase } from '@/lib/supabase';
import { EmailTemplate } from '@/types/lead';
import { toast } from 'sonner';

interface TemplateVariable {
  name: string;
  description: string;
  defaultValue?: string;
}

export interface TemplateData {
  leadName?: string;
  leadEmail?: string;
  leadCompany?: string;
  currentDate?: string;
  senderName?: string;
  senderEmail?: string;
  senderCompany?: string;
  [key: string]: any;
}

export const emailTemplateService = {
  /**
   * Get all email templates
   * @param category Optional category to filter by
   * @returns Promise with the email templates
   */
  async getTemplates(category?: string): Promise<EmailTemplate[]> {
    try {
      let query = supabase
        .from('email_templates')
        .select('*')
        .order('name');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching email templates:', error);
        throw error;
      }
      
      return data as EmailTemplate[];
    } catch (error) {
      console.error('Error in getTemplates:', error);
      return [];
    }
  },
  
  /**
   * Get a single email template by ID
   * @param id The ID of the template
   * @returns Promise with the email template or null
   */
  async getTemplateById(id: string): Promise<EmailTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching email template:', error);
        throw error;
      }
      
      return data as EmailTemplate;
    } catch (error) {
      console.error('Error in getTemplateById:', error);
      return null;
    }
  },
  
  /**
   * Create a new email template
   * @param template The template to create
   * @returns Promise with the created template or null
   */
  async createTemplate(template: Omit<EmailTemplate, 'id' | 'createdat' | 'updatedat'>): Promise<EmailTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .insert([template])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating email template:', error);
        toast.error('Failed to create template');
        throw error;
      }
      
      toast.success('Template created successfully');
      return data as EmailTemplate;
    } catch (error) {
      console.error('Error in createTemplate:', error);
      return null;
    }
  },
  
  /**
   * Update an existing email template
   * @param id The ID of the template to update
   * @param updates The template updates
   * @returns Promise with the updated template or null
   */
  async updateTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating email template:', error);
        toast.error('Failed to update template');
        throw error;
      }
      
      toast.success('Template updated successfully');
      return data as EmailTemplate;
    } catch (error) {
      console.error('Error in updateTemplate:', error);
      return null;
    }
  },
  
  /**
   * Delete an email template
   * @param id The ID of the template to delete
   * @returns Promise with success status
   */
  async deleteTemplate(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting email template:', error);
        toast.error('Failed to delete template');
        throw error;
      }
      
      toast.success('Template deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteTemplate:', error);
      return false;
    }
  },
  
  /**
   * Get the list of available template variables
   * @returns Array of template variables with descriptions
   */
  getAvailableVariables(): TemplateVariable[] {
    return [
      { name: 'lead.name', description: 'The lead\'s name', defaultValue: 'John Doe' },
      { name: 'lead.email', description: 'The lead\'s email address', defaultValue: 'john@example.com' },
      { name: 'lead.company', description: 'The lead\'s company name', defaultValue: 'Acme Corp' },
      { name: 'lead.phone', description: 'The lead\'s phone number', defaultValue: '(555) 123-4567' },
      { name: 'sender.name', description: 'Your name', defaultValue: 'Jane Smith' },
      { name: 'sender.email', description: 'Your email address', defaultValue: 'jane@yourcompany.com' },
      { name: 'sender.company', description: 'Your company name', defaultValue: 'Your Company' },
      { name: 'sender.phone', description: 'Your phone number', defaultValue: '(555) 987-6543' },
      { name: 'date', description: 'Current date', defaultValue: new Date().toLocaleDateString() },
      { name: 'time', description: 'Current time', defaultValue: new Date().toLocaleTimeString() }
    ];
  },
  
  /**
   * Render a template with data
   * @param templateContent HTML or text content with variable placeholders
   * @param data Object containing values for variables
   * @returns Rendered template with variables replaced
   */
  renderTemplate(templateContent: string, data: TemplateData): string {
    // Prepare standard data
    const standardData = {
      currentDate: new Date().toLocaleDateString(),
      ...data
    };
    
    // Replace all variables in format {{variable}}
    return templateContent.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
      const path = variable.trim().split('.');
      
      // Traverse the data object following the path
      let value = standardData;
      for (const key of path) {
        if (value === undefined || value === null) {
          return match; // Keep original if path is invalid
        }
        value = value[key];
      }
      
      // Return empty string if value is undefined or null
      return value !== undefined && value !== null ? value : '';
    });
  },
  
  /**
   * Get all categories used in templates
   * @returns Promise with array of unique categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('category')
        .order('category');
      
      if (error) {
        console.error('Error fetching template categories:', error);
        throw error;
      }
      
      // Extract unique categories
      const categories = data
        .map(item => item.category)
        .filter((value, index, self) => self.indexOf(value) === index);
      
      return categories;
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  },
  
  /**
   * Preview a template with sample data
   * @param templateContent The template content to preview
   * @returns Rendered template with sample data
   */
  previewTemplate(templateContent: string): string {
    const sampleData: TemplateData = {
      leadName: 'John Doe',
      leadEmail: 'john@example.com',
      leadCompany: 'Acme Corp',
      currentDate: new Date().toLocaleDateString(),
      senderName: 'Jane Smith',
      senderEmail: 'jane@yourcompany.com',
      senderCompany: 'Your Company'
    };
    
    return this.renderTemplate(templateContent, sampleData);
  }
};
