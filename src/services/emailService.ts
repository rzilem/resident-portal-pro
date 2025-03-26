
// Email service utility to handle sending emails through Supabase Edge Function

import { supabase } from "@/integrations/supabase/client";

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  from?: string;
  replyTo?: string;
}

export const emailService = {
  /**
   * Send an email using Supabase Edge Function
   */
  sendEmail: async (options: EmailOptions): Promise<boolean> => {
    if (!options.to) {
      console.error('Cannot send email: Recipient email is missing');
      return false;
    }

    if (!options.subject) {
      console.error('Cannot send email: Subject is missing');
      return false;
    }

    if (!options.body) {
      console.error('Cannot send email: Email body is missing');
      return false;
    }
    
    console.log('Sending email:', options);
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`From: ${options.from || 'noreply@residentpro.com'}`);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: options.to,
          subject: options.subject,
          html: options.body,
          from: options.from,
          replyTo: options.replyTo
        }
      });
      
      if (error) {
        console.error('Error sending email:', error);
        return false;
      }
      
      console.log('Email sent successfully to:', options.to, data);
      return true;
    } catch (err) {
      console.error('Exception while sending email:', err);
      return false;
    }
  },
  
  /**
   * Send a welcome email to a new user
   */
  sendWelcomeEmail: async (
    userEmail: string, 
    firstName: string, 
    role: string
  ): Promise<boolean> => {
    if (!userEmail) {
      console.error('Cannot send welcome email: Email address is missing');
      return false;
    }
    
    const subject = 'Welcome to ResidentPro!';
    
    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to ResidentPro, ${firstName}!</h2>
        <p>Your account has been created with the role of <strong>${role}</strong>.</p>
        <p>You can now log in to access the system and manage your community information.</p>
        <p>If you have any questions, please contact the administrator.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;
    
    console.log(`Attempting to send welcome email to ${userEmail} with role ${role}`);
    
    return emailService.sendEmail({
      to: userEmail,
      subject,
      body,
      from: 'noreply@residentpro.com',
      replyTo: 'support@residentpro.com'
    });
  },
  
  /**
   * Send a notification to the admin when a new user is invited
   */
  sendNewUserNotification: async (
    adminEmail: string,
    newUserName: string,
    newUserEmail: string,
    role: string
  ): Promise<boolean> => {
    if (!adminEmail || !newUserEmail) {
      console.error('Cannot send notification: Email address is missing');
      return false;
    }
    
    const subject = 'New User Invited';
    
    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New User Invited</h2>
        <p>A new user has been invited to the system:</p>
        <ul>
          <li><strong>Name:</strong> ${newUserName}</li>
          <li><strong>Email:</strong> ${newUserEmail}</li>
          <li><strong>Role:</strong> ${role}</li>
        </ul>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;
    
    console.log(`Attempting to send admin notification to ${adminEmail} about new user ${newUserEmail}`);
    
    return emailService.sendEmail({
      to: adminEmail,
      subject,
      body,
      from: 'notifications@residentpro.com',
      replyTo: 'support@residentpro.com'
    });
  }
};
