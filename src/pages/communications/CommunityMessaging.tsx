
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import MessageComposer from '@/components/communications/MessageComposer';
import MessageTemplates from '@/components/communications/MessageTemplates';
import MessageHistory from '@/components/communications/MessageHistory';

// Sample template data to share between components
const INITIAL_TEMPLATES = [
  {
    id: '1',
    name: 'Welcome New Resident',
    description: 'Send to new residents to welcome them to the community',
    subject: 'Welcome to our Community!',
    content: '<p>Dear {{resident.first_name}},</p><p>On behalf of the {{association.name}}, we would like to welcome you to our community! We are excited to have you join us.</p><p>Please find attached our welcome packet with important information about our community rules, amenities, and contact information.</p><p>If you have any questions, feel free to reach out to us at {{association.email}} or {{association.phone}}.</p><p>Best regards,<br>{{board.president}}<br>Board President</p>',
    category: 'Welcome',
    communities: ['all'],
    createdAt: '2023-07-15T10:00:00Z',
    updatedAt: '2023-07-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Monthly Meeting Reminder',
    description: 'Monthly reminder about upcoming board meeting',
    subject: 'Reminder: Monthly Board Meeting - {{meeting.date}}',
    content: '<p>Dear Homeowners,</p><p>This is a reminder that our monthly board meeting will be held on {{meeting.date}} at {{meeting.time}} in the {{meeting.location}}.</p><p>Agenda items include:</p><p>{{meeting.agenda}}</p><p>We hope to see you there!</p><p>Regards,<br>{{board.secretary}}<br>Board Secretary</p>',
    category: 'Meetings',
    communities: ['comm1', 'comm3'],
    createdAt: '2023-07-16T10:00:00Z',
    updatedAt: '2023-07-16T10:00:00Z'
  },
  {
    id: '3',
    name: 'Annual Assessment Notice',
    description: 'Annual notice about upcoming assessment dues',
    subject: 'Annual Assessment Notice for {{association.name}}',
    content: '<p>Dear {{resident.name}},</p><p>This letter serves as a notice that your annual assessment for your property at {{property.address}} is due on {{financial.due_date}}.</p><p>The annual assessment amount is {{financial.monthly_assessment}}.</p><p>Payment can be made via {{financial.payment_methods}}.</p><p>If you have any questions, please contact our office.</p><p>Thank you,<br>{{board.treasurer}}<br>Board Treasurer</p>',
    category: 'Financial',
    communities: ['comm2', 'comm4'],
    createdAt: '2023-07-17T10:00:00Z',
    updatedAt: '2023-07-17T10:00:00Z'
  }
];

// Define the template interface
interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  category: string;
  communities?: string[];
  createdAt: string;
  updatedAt: string;
}

const CommunityMessaging = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("compose");
  const [templates, setTemplates] = useState<MessageTemplate[]>(INITIAL_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

  const handleSendMessage = (message: { subject: string; content: string; recipients: string[] }) => {
    console.log("Sending message:", message);
    // Here you would integrate with your backend service
    
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${message.recipients.length} recipients.`,
    });
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setActiveTab("compose");
  };

  const handleTemplateCreate = (newTemplate: MessageTemplate) => {
    setTemplates([...templates, newTemplate]);
  };

  const handleTemplateUpdate = (updatedTemplate: MessageTemplate) => {
    setTemplates(templates.map(t => 
      t.id === updatedTemplate.id ? updatedTemplate : t
    ));
  };

  const handleTemplateDelete = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      
      <div className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
        <div className="grid gap-4 md:gap-6 mb-6">
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Community Messaging</h2>
                <p className="text-muted-foreground">Send messages to your entire community or specific groups</p>
              </div>
            </div>
          </section>
          
          <Card>
            <CardHeader>
              <CardTitle>Community Messaging</CardTitle>
              <CardDescription>
                Compose and send messages to your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="compose">Compose Message</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="history">Message History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="compose" className="mt-6">
                  <MessageComposer 
                    onSendMessage={handleSendMessage}
                    initialSubject={selectedTemplate?.subject || ''}
                    initialContent={selectedTemplate?.content || ''}
                  />
                </TabsContent>
                
                <TabsContent value="templates" className="mt-6">
                  <MessageTemplates 
                    onSelectTemplate={handleTemplateSelect}
                    templates={templates}
                    onCreateTemplate={handleTemplateCreate}
                    onUpdateTemplate={handleTemplateUpdate}
                    onDeleteTemplate={handleTemplateDelete}
                  />
                </TabsContent>
                
                <TabsContent value="history" className="mt-6">
                  <MessageHistory />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityMessaging;
