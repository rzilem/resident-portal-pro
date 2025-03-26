
// Email service utility to handle sending emails
// Note: In a real application, this would connect to a backend email service API

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  from?: string;
  replyTo?: string;
}

export const emailService = {
  /**
   * Send an email (simulated in this example)
   * In a real application, this would call a backend API endpoint
   */
  sendEmail: async (options: EmailOptions): Promise<boolean> => {
    // In a real application, this would make an API call to your backend
    console.log('Sending email:', options);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Email sent successfully to:', options.to);
        resolve(true);
      }, 500);
    });
  },
  
  /**
   * Send a welcome email to a new user
   */
  sendWelcomeEmail: async (
    userEmail: string, 
    firstName: string, 
    role: string
  ): Promise<boolean> => {
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
    
    return emailService.sendEmail({
      to: adminEmail,
      subject,
      body,
      from: 'notifications@residentpro.com',
      replyTo: 'support@residentpro.com'
    });
  }
};
