
// Basic email service for sending notifications
// In a real app, this would connect to an email delivery service like SendGrid, Mailchimp, etc.

import { toast } from "sonner";

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

export const emailService = {
  // Send a generic email
  sendEmail: async (options: EmailOptions): Promise<boolean> => {
    console.log('Sending email to:', options.to);
    console.log('Subject:', options.subject);
    console.log('Body:', options.body);
    
    // In development mode, we just log the email contents and simulate success
    // In production, this would connect to a real email service
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Log the success message
      console.log('Email sent successfully to', options.to);
      
      // Return true to indicate success
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  },
  
  // Send a welcome email to a new user
  sendWelcomeEmail: async (email: string, name: string, role: string): Promise<boolean> => {
    const subject = 'Welcome to ResidentPro';
    const body = `
      <h1>Welcome to ResidentPro, ${name}!</h1>
      <p>Your account has been created as a ${role}.</p>
      <p>You can log in using your email address and the temporary password that will be sent in a separate email.</p>
      <p>Please change your password after your first login.</p>
      <br />
      <p>Best regards,</p>
      <p>The ResidentPro Team</p>
    `;
    
    return emailService.sendEmail({
      to: email,
      subject,
      body,
      isHtml: true
    });
  },
  
  // Send a notification to an admin about a new user
  sendNewUserNotification: async (
    adminEmail: string, 
    userName: string, 
    userEmail: string, 
    userRole: string
  ): Promise<boolean> => {
    const subject = 'New User Registration';
    const body = `
      <h1>New User Registered</h1>
      <p>A new user has registered on ResidentPro:</p>
      <ul>
        <li><strong>Name:</strong> ${userName}</li>
        <li><strong>Email:</strong> ${userEmail}</li>
        <li><strong>Role:</strong> ${userRole}</li>
      </ul>
      <p>They have been sent a welcome email.</p>
      <br />
      <p>Best regards,</p>
      <p>The ResidentPro Team</p>
    `;
    
    return emailService.sendEmail({
      to: adminEmail,
      subject,
      body,
      isHtml: true
    });
  }
};
