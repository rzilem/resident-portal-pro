
interface EmailParams {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

class EmailService {
  async sendEmail(params: EmailParams): Promise<boolean> {
    try {
      // This is a mock implementation
      console.log('Sending email to:', params.to);
      console.log('Subject:', params.subject);
      console.log('Body:', params.body);
      console.log('Is HTML:', params.isHtml);
      
      // In a real implementation, this would connect to your email provider
      // For example using the Supabase Edge Function to send emails via SendGrid, Mailgun, etc.
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Log the sent email to leads table if it's to a non-internal address
      if (!params.to.includes('@yourdomain.com') && !params.to.includes('@internal.com')) {
        this.processEmailAsLead(params);
      }
      
      return true; // Return boolean instead of void
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Process sent emails as potential leads
  private async processEmailAsLead(params: EmailParams): Promise<void> {
    try {
      // Import the hook at runtime to avoid circular dependencies
      const { useEmailToLead } = await import('@/hooks/use-email-to-lead');
      const { processEmailAsLead } = useEmailToLead();
      
      // Process the email as a lead
      await processEmailAsLead({
        from: params.to, // The recipient becomes the lead
        subject: params.subject,
        body: params.body,
        received_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error processing email as lead:', err);
    }
  }

  // Add missing methods that are used in useUserForm.ts
  async sendWelcomeEmail(email: string, name: string, role: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Welcome to Our Platform, ${name}!`,
      body: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining our platform as a ${role}.</p>
        <p>Your account has been created and you can now access the system.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
      `,
      isHtml: true
    });
  }

  async sendNewUserNotification(adminEmail: string, userName: string, userEmail: string, role: string): Promise<boolean> {
    return this.sendEmail({
      to: adminEmail,
      subject: 'New User Registration',
      body: `
        <h1>New User Registration</h1>
        <p>A new user has registered:</p>
        <ul>
          <li><strong>Name:</strong> ${userName}</li>
          <li><strong>Email:</strong> ${userEmail}</li>
          <li><strong>Role:</strong> ${role}</li>
        </ul>
      `,
      isHtml: true
    });
  }
}

export const emailService = new EmailService();
