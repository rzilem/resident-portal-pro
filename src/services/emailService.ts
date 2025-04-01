
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
      
      return true; // Return boolean instead of void
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
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
