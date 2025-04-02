
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/lead';
import { emailService } from './emailService';

export type LeadStatusChange = {
  id: string;
  lead_id: string;
  previous_status: string;
  new_status: string;
  changed_by?: string;
  changed_at: string;
  notes?: string;
};

export type LeadInteraction = {
  id: string;
  lead_id: string;
  interaction_type: string;
  metadata: any;
  created_at: string;
  created_by?: string;
};

export const leadStatusService = {
  /**
   * Update a lead's status
   * @param leadId The ID of the lead
   * @param newStatus The new status to set
   * @param notes Optional notes about the status change
   * @param userId Optional ID of the user making the change
   * @returns Promise with the status change result
   */
  async updateLeadStatus(
    leadId: string, 
    newStatus: string, 
    notes?: string, 
    userId?: string
  ): Promise<{ success: boolean; lead?: Lead; error?: string }> {
    try {
      // Get the current lead status
      const { data: lead, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (fetchError) {
        console.error("Error fetching lead:", fetchError);
        return { success: false, error: fetchError.message };
      }
      
      if (!lead) {
        return { success: false, error: "Lead not found" };
      }
      
      // Record the status change
      const { error: historyError } = await supabase
        .from('lead_status_history')
        .insert([{
          lead_id: leadId,
          previous_status: lead.status,
          new_status: newStatus,
          changed_by: userId,
          changed_at: new Date().toISOString(),
          notes: notes
        }]);
      
      if (historyError) {
        console.error("Error recording status history:", historyError);
        return { success: false, error: historyError.message };
      }
      
      // Update the lead status
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({ 
          status: newStatus,
          updatedat: new Date().toISOString()
        })
        .eq('id', leadId)
        .select()
        .single();
      
      if (updateError) {
        console.error("Error updating lead status:", updateError);
        return { success: false, error: updateError.message };
      }
      
      // Log the interaction
      await this.logInteraction(leadId, 'status_change', {
        previous_status: lead.status,
        new_status: newStatus,
        notes: notes,
        changed_by: userId
      }, userId);
      
      // Handle automatic actions based on status change
      await this.processStatusChangeActions(lead, newStatus, userId);
      
      return { success: true, lead: updatedLead };
    } catch (error) {
      console.error("Error in updateLeadStatus:", error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Process automatic actions based on lead status changes
   * @param lead The lead being updated
   * @param newStatus The new status
   * @param userId Optional ID of the user making the change
   */
  async processStatusChangeActions(
    lead: Lead, 
    newStatus: string, 
    userId?: string
  ): Promise<void> {
    try {
      // Define status-specific actions
      switch (newStatus) {
        case 'qualified':
          // Send internal notification to sales team
          if (lead.email) {
            await emailService.sendEmail({
              to: 'sales@yourdomain.com',
              subject: `New Qualified Lead: ${lead.name}`,
              body: `
                <h1>New Qualified Lead</h1>
                <p>A lead has been qualified and is ready for follow-up:</p>
                <ul>
                  <li><strong>Name:</strong> ${lead.name}</li>
                  <li><strong>Email:</strong> ${lead.email}</li>
                  <li><strong>Company:</strong> ${lead.company || 'N/A'}</li>
                  <li><strong>Phone:</strong> ${lead.phone || 'N/A'}</li>
                </ul>
                <p>Please follow up with this lead as soon as possible.</p>
              `,
              isHtml: true
            });
          }
          break;
          
        case 'proposal':
          // Remind to create a proposal
          // In a real system, this might notify the assigned user
          console.log(`Lead ${lead.id} moved to proposal stage - reminder to create proposal`);
          break;
          
        case 'closed-won':
          // Celebrate and send thank you email
          if (lead.email) {
            await emailService.sendEmail({
              to: lead.email,
              subject: `Thank You for Choosing Us, ${lead.name}!`,
              body: `
                <h1>Thank You for Choosing Us!</h1>
                <p>Dear ${lead.name},</p>
                <p>We're excited to have you as a customer and look forward to working with you.</p>
                <p>Your account manager will be in touch shortly to discuss next steps.</p>
                <p>In the meantime, if you have any questions, please don't hesitate to reach out.</p>
                <p>Best regards,<br>Your Company Team</p>
              `,
              isHtml: true
            });
          }
          break;
          
        case 'closed-lost':
          // Send feedback request
          if (lead.email) {
            await emailService.sendEmail({
              to: lead.email,
              subject: `We'd Love Your Feedback, ${lead.name}`,
              body: `
                <h1>We Value Your Feedback</h1>
                <p>Dear ${lead.name},</p>
                <p>Thank you for considering us. We understand we weren't the right fit this time.</p>
                <p>We're constantly working to improve our offerings. Would you be willing to share what factors influenced your decision?</p>
                <p>Simply reply to this email with your thoughts.</p>
                <p>We wish you all the best with your project.</p>
                <p>Regards,<br>Your Company Team</p>
              `,
              isHtml: true
            });
          }
          break;
          
        default:
          // No special actions for other statuses
          break;
      }
    } catch (error) {
      console.error("Error in processStatusChangeActions:", error);
    }
  },
  
  /**
   * Log a lead interaction
   * @param leadId The ID of the lead
   * @param interactionType The type of interaction
   * @param metadata Additional data about the interaction
   * @param userId Optional ID of the user creating the interaction
   * @returns Promise with the interaction result
   */
  async logInteraction(
    leadId: string, 
    interactionType: string, 
    metadata: any, 
    userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('lead_interactions')
        .insert([{
          lead_id: leadId,
          interaction_type: interactionType,
          metadata,
          created_at: new Date().toISOString(),
          created_by: userId
        }]);
      
      if (error) {
        console.error("Error logging interaction:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error in logInteraction:", error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get status history for a lead
   * @param leadId The ID of the lead
   * @returns Promise with the status history
   */
  async getStatusHistory(leadId: string): Promise<{
    history: LeadStatusChange[];
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('lead_status_history')
        .select('*')
        .eq('lead_id', leadId)
        .order('changed_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching status history:", error);
        return { history: [], error: error.message };
      }
      
      return { history: data || [] };
    } catch (error) {
      console.error("Error in getStatusHistory:", error);
      return { history: [], error: error.message };
    }
  },
  
  /**
   * Get interaction history for a lead
   * @param leadId The ID of the lead
   * @returns Promise with the interaction history
   */
  async getInteractionHistory(leadId: string): Promise<{
    interactions: LeadInteraction[];
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('lead_interactions')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching interaction history:", error);
        return { interactions: [], error: error.message };
      }
      
      return { interactions: data || [] };
    } catch (error) {
      console.error("Error in getInteractionHistory:", error);
      return { interactions: [], error: error.message };
    }
  },
  
  /**
   * Get leads that have been in a status for too long
   * @param thresholds Object with status keys and day values
   * @returns Promise with stale leads
   */
  async getStaleLeads(thresholds: Record<string, number>): Promise<{
    staleLeads: (Lead & { daysInStatus: number })[];
    error?: string;
  }> {
    try {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*');
      
      if (error) {
        console.error("Error fetching leads:", error);
        return { staleLeads: [], error: error.message };
      }
      
      // For each lead, get its last status change
      const staleLeads = await Promise.all(
        leads.map(async lead => {
          const { data: statusChanges } = await supabase
            .from('lead_status_history')
            .select('*')
            .eq('lead_id', lead.id)
            .eq('new_status', lead.status)
            .order('changed_at', { ascending: false })
            .limit(1);
          
          // Calculate days in status
          const statusDate = statusChanges && statusChanges.length > 0
            ? new Date(statusChanges[0].changed_at)
            : new Date(lead.createdat);
          
          const now = new Date();
          const daysInStatus = Math.floor(
            (now.getTime() - statusDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          // Check if this lead is stale based on thresholds
          const threshold = thresholds[lead.status];
          if (threshold && daysInStatus > threshold) {
            return { ...lead, daysInStatus };
          }
          
          return null;
        })
      );
      
      // Filter out non-stale leads
      return { staleLeads: staleLeads.filter(lead => lead !== null) };
    } catch (error) {
      console.error("Error in getStaleLeads:", error);
      return { staleLeads: [], error: error.message };
    }
  }
};
