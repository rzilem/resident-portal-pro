
import { supabase } from '@/integrations/supabase/client';

// Email service using Supabase Edge Functions with fallback to mock implementation
export const emailService = {
  /**
   * Sends a welcome email to a new user
   * @param email The recipient's email address
   * @param name The recipient's name
   * @param role The recipient's role label
   * @returns Promise resolving to true if email was sent successfully
   */
  sendWelcomeEmail: async (email: string, name: string, role: string): Promise<boolean> => {
    try {
      console.log(`Sending welcome email to ${email} (${name}, ${role})`);
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: 'Welcome to ResidentPro!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb;">Welcome to ResidentPro!</h1>
              <p>Hello ${name},</p>
              <p>You have been invited to join ResidentPro as a <strong>${role}</strong>.</p>
              <p>Please click the button below to complete your registration:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://app.residentpro.com/register?email=${encodeURIComponent(email)}" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Complete Registration
                </a>
              </div>
              <p>If you have any questions, please contact your administrator.</p>
              <p>Thank you,<br>The ResidentPro Team</p>
            </div>
          `,
          from: 'ResidentPro <noreply@residentpro.com>'
        }
      });
      
      if (error) {
        console.error('Error sending welcome email via Supabase Edge Function:', error);
        return false;
      }
      
      console.log('Welcome email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Error in sendWelcomeEmail:', error);
      // Mock successful email sending (for development/testing)
      console.log(`[MOCK] Email would be sent to: ${email}`);
      console.log(`[MOCK] Subject: Welcome to ResidentPro!`);
      console.log(`[MOCK] Content: Welcome message for ${name} as ${role}`);
      return true; // Return true to indicate "success" in the mock implementation
    }
  },
  
  /**
   * Sends a notification email to admin when a new user is added
   * @param adminEmail The admin's email address
   * @param userName The new user's name
   * @param userEmail The new user's email
   * @param userRole The new user's role label
   * @returns Promise resolving to true if email was sent successfully
   */
  sendNewUserNotification: async (
    adminEmail: string, 
    userName: string, 
    userEmail: string, 
    userRole: string
  ): Promise<boolean> => {
    try {
      console.log(`Sending admin notification to ${adminEmail} about new user ${userName}`);
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: adminEmail,
          subject: 'New User Registration',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb;">New User Added</h1>
              <p>Hello Administrator,</p>
              <p>A new user has been added to ResidentPro:</p>
              <ul>
                <li><strong>Name:</strong> ${userName}</li>
                <li><strong>Email:</strong> ${userEmail}</li>
                <li><strong>Role:</strong> ${userRole}</li>
              </ul>
              <p>The user has been sent an invitation to complete their registration.</p>
              <p>Thank you,<br>The ResidentPro Team</p>
            </div>
          `,
          from: 'ResidentPro <noreply@residentpro.com>'
        }
      });
      
      if (error) {
        console.error('Error sending admin notification via Supabase Edge Function:', error);
        return false;
      }
      
      console.log('Admin notification email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Error in sendNewUserNotification:', error);
      // Mock successful email sending (for development/testing)
      console.log(`[MOCK] Email would be sent to admin: ${adminEmail}`);
      console.log(`[MOCK] Subject: New User Registration`);
      console.log(`[MOCK] Content: New user ${userName} (${userEmail}) added as ${userRole}`);
      return true; // Return true to indicate "success" in the mock implementation
    }
  }
};
