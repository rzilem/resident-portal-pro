import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MessageTemplate, CompositionMessage } from './types';
import { communicationService } from '@/services/communicationService';

// Sample template data to share between components
export const INITIAL_TEMPLATES = [
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
  },
  {
    id: '4',
    name: 'Maintenance Notification',
    description: 'Notice about upcoming maintenance work',
    subject: 'Scheduled Maintenance: {{maintenance.type}}',
    content: '<p>Dear Residents,</p><p>Please be advised that maintenance work ({{maintenance.type}}) is scheduled for {{maintenance.date}} between {{maintenance.start_time}} and {{maintenance.end_time}}.</p><p>Areas affected: {{maintenance.areas}}</p><p>This maintenance is necessary to ensure the continued quality and safety of our community facilities.</p><p>We apologize for any inconvenience this may cause.</p><p>Regards,<br>{{property.manager}}<br>Property Manager</p>',
    category: 'Maintenance',
    communities: ['comm1', 'comm2'],
    createdAt: '2023-07-18T10:00:00Z',
    updatedAt: '2023-07-18T10:00:00Z'
  },
  {
    id: '5',
    name: 'Community Event Invitation',
    description: 'Invitation to community social events',
    subject: 'You\'re Invited: {{event.name}} - {{event.date}}',
    content: '<p>Dear Neighbors,</p><p>We are excited to invite you to our upcoming community event!</p><p><strong>Event:</strong> {{event.name}}<br><strong>Date:</strong> {{event.date}}<br><strong>Time:</strong> {{event.time}}<br><strong>Location:</strong> {{event.location}}</p><p>{{event.description}}</p><p>Please RSVP by {{event.rsvp_date}} by replying to this email or calling {{association.phone}}.</p><p>We look forward to seeing you there!</p><p>Best regards,<br>{{event.coordinator}}<br>Event Coordinator</p>',
    category: 'Events',
    communities: ['all'],
    createdAt: '2023-07-19T10:00:00Z',
    updatedAt: '2023-07-19T10:00:00Z'
  },
  {
    id: '6',
    name: 'Holiday Schedule',
    description: 'Information about holiday services and office hours',
    subject: '{{holiday.name}} Schedule and Information',
    content: '<p>Dear Residents,</p><p>As {{holiday.name}} approaches, we want to inform you of the following schedule changes:</p><p><strong>Office Hours:</strong> {{holiday.office_hours}}<br><strong>Maintenance:</strong> {{holiday.maintenance_availability}}<br><strong>Trash Collection:</strong> {{holiday.trash_schedule}}</p><p>For emergencies during this time, please call {{emergency.phone}}.</p><p>We wish you a safe and enjoyable {{holiday.name}}!</p><p>Sincerely,<br>{{association.management}}</p>',
    category: 'General',
    communities: ['comm3', 'comm4'],
    createdAt: '2023-07-20T10:00:00Z',
    updatedAt: '2023-07-20T10:00:00Z'
  },
  {
    id: '7',
    name: 'Rule Violation Notice',
    description: 'Notice about community rule violations',
    subject: 'Notice of Rule Violation: {{violation.type}}',
    content: '<p>Dear {{resident.name}},</p><p>We are writing to inform you of a violation of the community rules that has been observed at your property ({{property.address}}).</p><p><strong>Violation:</strong> {{violation.type}}<br><strong>Date Observed:</strong> {{violation.date}}<br><strong>Description:</strong> {{violation.description}}</p><p>As per our community guidelines, we request that this violation be remedied by {{violation.remedy_date}}. Failure to do so may result in {{violation.consequence}}.</p><p>If you have questions or need assistance, please contact the management office.</p><p>Thank you for your cooperation.</p><p>Sincerely,<br>{{board.president}}</p>',
    category: 'Violations',
    communities: ['comm1', 'comm4'],
    createdAt: '2023-07-21T10:00:00Z',
    updatedAt: '2023-07-21T10:00:00Z'
  },
  {
    id: '8',
    name: 'Pool Season Opening',
    description: 'Information about pool opening and rules',
    subject: 'Community Pool Opening - {{pool.opening_date}}',
    content: '<p>Dear Residents,</p><p>We are pleased to announce that our community pool will be opening for the season on {{pool.opening_date}}!</p><p><strong>Pool Hours:</strong> {{pool.hours}}<br><strong>Season End Date:</strong> {{pool.closing_date}}</p><p>Please remember the following pool rules:<br>{{pool.rules}}</p><p>Pool access cards/keys can be obtained at the management office during business hours.</p><p>We hope you enjoy the pool this season!</p><p>Best regards,<br>{{association.management}}</p>',
    category: 'Amenities',
    communities: ['comm2', 'comm3'],
    createdAt: '2023-07-22T10:00:00Z',
    updatedAt: '2023-07-22T10:00:00Z'
  }
];

export const useCommunityMessaging = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("compose");
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [composeKey, setComposeKey] = useState<string>("initial");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const dbTemplates = await communicationService.getTemplates();
        
        if (dbTemplates && dbTemplates.length > 0) {
          setTemplates(dbTemplates);
        } else {
          for (const template of INITIAL_TEMPLATES) {
            await communicationService.saveTemplate(template);
          }
          setTemplates(INITIAL_TEMPLATES);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
        setTemplates(INITIAL_TEMPLATES);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);

  const handleSendMessage = async (message: CompositionMessage) => {
    console.log("Sending message:", message);
    
    toast({
      title: "Message action completed",
      description: "Your message has been processed successfully.",
    });
    
    setSelectedTemplate(null);
    setComposeKey(`new-${Date.now()}`);
    
    setActiveTab("history");
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setComposeKey(template.id);
    
    setActiveTab("compose");
  };

  const handleTemplateCreate = async (newTemplate: MessageTemplate) => {
    try {
      const templateId = await communicationService.saveTemplate(newTemplate);
      
      if (templateId) {
        const createdTemplate = {
          ...newTemplate,
          id: templateId
        };
        
        setTemplates(prev => [...prev, createdTemplate]);
        toast({
          title: "Template created",
          description: `Template "${newTemplate.name}" has been created successfully.`
        });
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error creating template",
        description: "There was a problem creating your template."
      });
    }
  };

  const handleTemplateUpdate = async (updatedTemplate: MessageTemplate) => {
    try {
      const success = await communicationService.updateTemplate(updatedTemplate);
      
      if (success) {
        setTemplates(templates.map(t => 
          t.id === updatedTemplate.id ? updatedTemplate : t
        ));
        
        toast({
          title: "Template updated",
          description: `Template "${updatedTemplate.name}" has been updated successfully.`
        });
      }
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error updating template",
        description: "There was a problem updating your template."
      });
    }
  };

  const handleTemplateDelete = async (templateId: string) => {
    try {
      const success = await communicationService.deleteTemplate(templateId);
      
      if (success) {
        setTemplates(templates.filter(t => t.id !== templateId));
        
        toast({
          title: "Template deleted",
          description: "The template has been deleted successfully."
        });
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error deleting template",
        description: "There was a problem deleting your template."
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    templates,
    selectedTemplate,
    composeKey,
    isLoading,
    handleSendMessage,
    handleTemplateSelect,
    handleTemplateCreate,
    handleTemplateUpdate,
    handleTemplateDelete,
  };
};
