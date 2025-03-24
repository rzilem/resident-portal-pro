
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  preview: string;
}

interface MessageTemplatesProps {
  onSelectTemplate: (template: MessageTemplate) => void;
}

const TEMPLATES: MessageTemplate[] = [
  {
    id: 'community-update',
    name: 'Community Update',
    description: 'General update for the community',
    subject: 'Community Update - [Date]',
    content: `
      <h1 style="color: #2563eb;">Community Update</h1>
      <p>Dear Residents,</p>
      <p>We hope this message finds you well. Here are some important updates about our community:</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
      <p>Thank you for your attention to these matters.</p>
      <p>Best regards,<br>Community Management</p>
    `,
    preview: 'A general update template for notifying residents about community news and changes.'
  },
  {
    id: 'emergency-notice',
    name: 'Emergency Notice',
    description: 'Urgent information for residents',
    subject: 'IMPORTANT: Emergency Notice',
    content: `
      <h1 style="color: #dc2626;">Emergency Notice</h1>
      <p>Dear Residents,</p>
      <p><strong>Please be advised of the following emergency situation:</strong></p>
      <p>[Describe emergency situation here]</p>
      <p>Please follow these instructions:</p>
      <ol>
        <li>Step 1</li>
        <li>Step 2</li>
        <li>Step 3</li>
      </ol>
      <p>We will provide updates as more information becomes available.</p>
      <p>For emergencies, please call: [Emergency Number]</p>
      <p>Community Management</p>
    `,
    preview: 'For urgent communications about emergencies or critical situations.'
  },
  {
    id: 'maintenance-schedule',
    name: 'Maintenance Schedule',
    description: 'Upcoming maintenance information',
    subject: 'Scheduled Maintenance Notice',
    content: `
      <h1 style="color: #0891b2;">Scheduled Maintenance</h1>
      <p>Dear Residents,</p>
      <p>Please be advised that we have scheduled maintenance as follows:</p>
      <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
        <tr style="background-color: #e5e7eb;">
          <th>Date</th>
          <th>Time</th>
          <th>Area</th>
          <th>Impact</th>
        </tr>
        <tr>
          <td>[Date]</td>
          <td>[Time]</td>
          <td>[Area]</td>
          <td>[Impact]</td>
        </tr>
      </table>
      <p>We apologize for any inconvenience this may cause.</p>
      <p>If you have any questions, please contact maintenance at [phone/email].</p>
      <p>Thank you for your understanding.</p>
      <p>Community Management Team</p>
    `,
    preview: 'Inform residents about scheduled maintenance activities and potential service disruptions.'
  },
  {
    id: 'community-event',
    name: 'Community Event',
    description: 'Announcement for community gathering',
    subject: 'Upcoming Community Event: [Event Name]',
    content: `
      <div style="text-align: center;">
        <h1 style="color: #8b5cf6;">Community Event</h1>
        <p style="font-size: 18px;">You're Invited!</p>
      </div>
      <div style="margin-top: 20px;">
        <p>Dear Residents,</p>
        <p>We're excited to announce our upcoming community event:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h2>[Event Name]</h2>
          <p><strong>Date:</strong> [Date]</p>
          <p><strong>Time:</strong> [Time]</p>
          <p><strong>Location:</strong> [Location]</p>
        </div>
        <p>[Event description and details]</p>
        <p>Please RSVP by [date] by [how to RSVP].</p>
        <p>We look forward to seeing you there!</p>
        <p>Best regards,<br>Community Events Team</p>
      </div>
    `,
    preview: 'Announce and provide details about upcoming community events, gatherings or celebrations.'
  },
  {
    id: 'welcome-new-resident',
    name: 'Welcome New Resident',
    description: 'Welcome message for new community members',
    subject: 'Welcome to Our Community!',
    content: `
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #059669; text-align: center;">Welcome to Our Community!</h1>
        <p>Dear [New Resident Name],</p>
        <p>On behalf of all residents and the management team, we'd like to extend a warm welcome to our community!</p>
        <h3>Important Information:</h3>
        <ul>
          <li><strong>Community Office:</strong> [Location and Hours]</li>
          <li><strong>Maintenance Requests:</strong> [How to Submit]</li>
          <li><strong>Amenities:</strong> [List of Amenities]</li>
          <li><strong>Community Website:</strong> [Website URL]</li>
        </ul>
        <p>We've attached our community handbook which contains additional important information.</p>
        <p>If you have any questions, please don't hesitate to contact us at [Contact Information].</p>
        <p>We're delighted to have you join our community and look forward to meeting you!</p>
        <p>Warm regards,<br>Community Management Team</p>
      </div>
    `,
    preview: 'A friendly welcome message for new residents joining the community.'
  }
];

const MessageTemplates: React.FC<MessageTemplatesProps> = ({ onSelectTemplate }) => {
  const { toast } = useToast();

  const handleUseTemplate = (template: MessageTemplate) => {
    onSelectTemplate(template);
    toast({
      title: "Template selected",
      description: `"${template.name}" template has been loaded into the editor.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Message Templates</h3>
      </div>
      
      <ScrollArea className="h-[600px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="p-4 bg-muted/30">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4 text-sm">
                <p className="line-clamp-3">{template.preview}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleUseTemplate(template)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageTemplates;
