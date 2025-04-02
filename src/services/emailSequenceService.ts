
import { supabase } from '@/lib/supabase';
import { EmailSequence, EmailSequenceStep, Lead } from '@/types/lead';
import { emailService } from './emailService';
import { emailTemplateService } from './emailTemplateService';
import { toast } from 'sonner';

export const emailSequenceService = {
  /**
   * Get all email sequences
   * @returns Promise with the email sequences
   */
  async getSequences(): Promise<EmailSequence[]> {
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching email sequences:', error);
        throw error;
      }
      
      return data as EmailSequence[];
    } catch (error) {
      console.error('Error in getSequences:', error);
      return [];
    }
  },
  
  /**
   * Get a single email sequence by ID
   * @param id The ID of the sequence
   * @returns Promise with the email sequence or null
   */
  async getSequenceById(id: string): Promise<EmailSequence | null> {
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching email sequence:', error);
        throw error;
      }
      
      return data as EmailSequence;
    } catch (error) {
      console.error('Error in getSequenceById:', error);
      return null;
    }
  },
  
  /**
   * Create a new email sequence
   * @param sequence The sequence to create
   * @returns Promise with the created sequence or null
   */
  async createSequence(sequence: Omit<EmailSequence, 'id' | 'createdat' | 'updatedat'>): Promise<EmailSequence | null> {
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .insert([sequence])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating email sequence:', error);
        toast.error('Failed to create sequence');
        throw error;
      }
      
      toast.success('Sequence created successfully');
      return data as EmailSequence;
    } catch (error) {
      console.error('Error in createSequence:', error);
      return null;
    }
  },
  
  /**
   * Update an existing email sequence
   * @param id The ID of the sequence to update
   * @param updates The sequence updates
   * @returns Promise with the updated sequence or null
   */
  async updateSequence(id: string, updates: Partial<EmailSequence>): Promise<EmailSequence | null> {
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating email sequence:', error);
        toast.error('Failed to update sequence');
        throw error;
      }
      
      toast.success('Sequence updated successfully');
      return data as EmailSequence;
    } catch (error) {
      console.error('Error in updateSequence:', error);
      return null;
    }
  },
  
  /**
   * Delete an email sequence
   * @param id The ID of the sequence to delete
   * @returns Promise with success status
   */
  async deleteSequence(id: string): Promise<boolean> {
    try {
      // First, check if there are any active enrollments
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('lead_sequence_enrollments')
        .select('id')
        .eq('sequence_id', id)
        .eq('status', 'active');
      
      if (enrollmentError) {
        console.error('Error checking sequence enrollments:', enrollmentError);
        toast.error('Failed to delete sequence');
        throw enrollmentError;
      }
      
      if (enrollments && enrollments.length > 0) {
        toast.error('Cannot delete sequence with active enrollments');
        return false;
      }
      
      // Delete the sequence
      const { error } = await supabase
        .from('email_sequences')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting email sequence:', error);
        toast.error('Failed to delete sequence');
        throw error;
      }
      
      toast.success('Sequence deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteSequence:', error);
      return false;
    }
  },
  
  /**
   * Enroll a lead in an email sequence
   * @param leadId The ID of the lead
   * @param sequenceId The ID of the sequence
   * @returns Promise with enrollment status
   */
  async enrollLeadInSequence(leadId: string, sequenceId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if lead exists
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (leadError) {
        console.error('Error fetching lead:', leadError);
        return { success: false, error: leadError.message };
      }
      
      // Check if sequence exists
      const { data: sequence, error: sequenceError } = await supabase
        .from('email_sequences')
        .select('*')
        .eq('id', sequenceId)
        .single();
      
      if (sequenceError) {
        console.error('Error fetching sequence:', sequenceError);
        return { success: false, error: sequenceError.message };
      }
      
      // Check if lead is already enrolled in this sequence
      const { data: existingEnrollment, error: enrollmentError } = await supabase
        .from('lead_sequence_enrollments')
        .select('*')
        .eq('lead_id', leadId)
        .eq('sequence_id', sequenceId)
        .eq('status', 'active');
      
      if (enrollmentError) {
        console.error('Error checking existing enrollment:', enrollmentError);
        return { success: false, error: enrollmentError.message };
      }
      
      if (existingEnrollment && existingEnrollment.length > 0) {
        return { success: false, error: 'Lead is already enrolled in this sequence' };
      }
      
      // Create the enrollment
      const { error: insertError } = await supabase
        .from('lead_sequence_enrollments')
        .insert([{
          lead_id: leadId,
          sequence_id: sequenceId,
          status: 'active',
          current_step: 0,
          enrolled_at: new Date().toISOString(),
          next_email_date: calculateNextEmailDate(sequence.steps[0])
        }]);
      
      if (insertError) {
        console.error('Error enrolling lead in sequence:', insertError);
        return { success: false, error: insertError.message };
      }
      
      // Schedule the first email
      await this.scheduleNextEmail(leadId, sequenceId, 0);
      
      return { success: true };
    } catch (error) {
      console.error('Error in enrollLeadInSequence:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Schedule the next email in a sequence
   * @param leadId The ID of the lead
   * @param sequenceId The ID of the sequence
   * @param stepIndex The index of the current step
   * @returns Promise with scheduling status
   */
  async scheduleNextEmail(leadId: string, sequenceId: string, stepIndex: number): Promise<{ success: boolean; error?: string }> {
    try {
      // Get the sequence
      const { data: sequence, error: sequenceError } = await supabase
        .from('email_sequences')
        .select('*')
        .eq('id', sequenceId)
        .single();
      
      if (sequenceError) {
        console.error('Error fetching sequence:', sequenceError);
        return { success: false, error: sequenceError.message };
      }
      
      // Check if we've reached the end of the sequence
      if (stepIndex >= sequence.steps.length) {
        // Mark the enrollment as completed
        const { error: updateError } = await supabase
          .from('lead_sequence_enrollments')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('lead_id', leadId)
          .eq('sequence_id', sequenceId);
        
        if (updateError) {
          console.error('Error updating enrollment status:', updateError);
          return { success: false, error: updateError.message };
        }
        
        return { success: true };
      }
      
      // Get the current step
      const step = sequence.steps[stepIndex];
      
      // Get the email template
      const { data: template, error: templateError } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', step.templateId)
        .single();
      
      if (templateError) {
        console.error('Error fetching template:', templateError);
        return { success: false, error: templateError.message };
      }
      
      // Get the lead
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (leadError) {
        console.error('Error fetching lead:', leadError);
        return { success: false, error: leadError.message };
      }
      
      // Prepare the email data
      const templateData = {
        leadName: lead.name,
        leadEmail: lead.email,
        leadCompany: lead.company,
        currentDate: new Date().toLocaleDateString()
      };
      
      const renderedSubject = emailTemplateService.renderTemplate(template.subject, templateData);
      const renderedBody = emailTemplateService.renderTemplate(template.body, templateData);
      
      // Schedule the email
      const nextEmailDate = calculateNextEmailDate(step);
      
      // Create scheduled communication
      const { error: scheduleError } = await supabase
        .from('communications')
        .insert([{
          subject: renderedSubject,
          content: renderedBody,
          message_type: 'email',
          format: 'html',
          status: 'scheduled',
          scheduled_for: nextEmailDate.toISOString(),
          user_id: sequence.createdby
        }]);
      
      if (scheduleError) {
        console.error('Error scheduling email:', scheduleError);
        return { success: false, error: scheduleError.message };
      }
      
      // Update the enrollment with the next step
      const { error: updateError } = await supabase
        .from('lead_sequence_enrollments')
        .update({ 
          current_step: stepIndex + 1,
          next_email_date: calculateNextEmailDate(sequence.steps[stepIndex + 1] || null)
        })
        .eq('lead_id', leadId)
        .eq('sequence_id', sequenceId);
      
      if (updateError) {
        console.error('Error updating enrollment:', updateError);
        return { success: false, error: updateError.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error in scheduleNextEmail:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Pause an active sequence enrollment
   * @param leadId The ID of the lead
   * @param sequenceId The ID of the sequence
   * @returns Promise with pause status
   */
  async pauseSequence(leadId: string, sequenceId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('lead_sequence_enrollments')
        .update({ status: 'paused' })
        .eq('lead_id', leadId)
        .eq('sequence_id', sequenceId)
        .eq('status', 'active');
      
      if (error) {
        console.error('Error pausing sequence:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error in pauseSequence:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Resume a paused sequence enrollment
   * @param leadId The ID of the lead
   * @param sequenceId The ID of the sequence
   * @returns Promise with resume status
   */
  async resumeSequence(leadId: string, sequenceId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('lead_sequence_enrollments')
        .update({ 
          status: 'active',
          next_email_date: new Date().toISOString() // Send next email immediately
        })
        .eq('lead_id', leadId)
        .eq('sequence_id', sequenceId)
        .eq('status', 'paused');
      
      if (error) {
        console.error('Error resuming sequence:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error in resumeSequence:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get all sequences a lead is enrolled in
   * @param leadId The ID of the lead
   * @returns Promise with the lead's sequences
   */
  async getLeadSequences(leadId: string): Promise<{
    enrollments: any[];
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('lead_sequence_enrollments')
        .select(`
          *,
          sequence:sequence_id(
            id,
            name,
            description,
            steps
          )
        `)
        .eq('lead_id', leadId);
      
      if (error) {
        console.error('Error fetching lead sequences:', error);
        return { enrollments: [], error: error.message };
      }
      
      return { enrollments: data || [] };
    } catch (error) {
      console.error('Error in getLeadSequences:', error);
      return { enrollments: [], error: error.message };
    }
  }
};

// Helper function to calculate the next email date based on delay
function calculateNextEmailDate(step: EmailSequenceStep | null): Date {
  if (!step) {
    return new Date(); // Default to now if no step
  }
  
  const now = new Date();
  
  switch (step.delayUnit) {
    case 'minutes':
      return new Date(now.getTime() + step.delay * 60 * 1000);
    case 'hours':
      return new Date(now.getTime() + step.delay * 60 * 60 * 1000);
    case 'days':
      return new Date(now.getTime() + step.delay * 24 * 60 * 60 * 1000);
    case 'weeks':
      return new Date(now.getTime() + step.delay * 7 * 24 * 60 * 60 * 1000);
    default:
      return now;
  }
}
