
import { useState } from 'react';
import { MessageTemplate } from './types';
import { toast } from 'sonner';
import { communicationService } from '@/services/communicationService';

// Sample templates - now exported as INITIAL_TEMPLATES
export const INITIAL_TEMPLATES: MessageTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    description: 'Default welcome email for new residents',
    subject: 'Welcome to Our Community!',
    content: '<p>Dear [Resident Name],</p><p>Welcome to our community! We\'re delighted to have you join us.</p>',
    category: 'Welcome',
    type: 'email',
    format: 'html',
    lastUpdated: '2023-01-15T10:30:00Z',
    createdAt: '2023-01-01T09:00:00Z',
    updatedAt: '2023-01-15T10:30:00Z',
    isDefault: true,
    tags: ['welcome', 'new-resident']
  },
  {
    id: '2',
    name: 'Maintenance Notification',
    description: 'Notification about scheduled maintenance',
    subject: 'Upcoming Maintenance Work',
    content: '<p>Dear [Resident Name],</p><p>We will be performing scheduled maintenance in your area on [Date].</p>',
    category: 'Maintenance',
    type: 'email',
    format: 'html',
    lastUpdated: '2023-02-10T15:20:00Z',
    createdAt: '2023-02-01T11:45:00Z',
    updatedAt: '2023-02-10T15:20:00Z',
    tags: ['maintenance']
  }
];

const useCommunityMessaging = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedRecipientType, setSelectedRecipientType] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('html');
  const [selectedMessageType, setSelectedMessageType] = useState('email');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

  // Use the exported INITIAL_TEMPLATES
  const templates = INITIAL_TEMPLATES;

  // Sample recipient types
  const recipientTypes = [
    { id: 'all', label: 'All Residents' },
    { id: 'owners', label: 'Property Owners' },
    { id: 'tenants', label: 'Tenants' },
    { id: 'board', label: 'Board Members' },
    { id: 'custom', label: 'Custom List' }
  ];

  // Sample format options
  const formatOptions = [
    { id: 'html', label: 'HTML' },
    { id: 'plain', label: 'Plain Text' }
  ];

  // Sample message types
  const messageTypes = [
    { id: 'email', label: 'Email' },
    { id: 'sms', label: 'SMS' },
    { id: 'portal', label: 'Portal Notification' }
  ];

  const handleSendMessage = async () => {
    try {
      const result = await communicationService.sendMessage({
        subject,
        content,
        messageType: selectedMessageType,
        format: selectedFormat,
        recipients: {
          type: selectedRecipientType,
          items: selectedRecipients.length ? selectedRecipients : [selectedRecipientType]
        },
        status: 'sent',
        scheduledFor: null
      });
      
      if (result) {
        toast.success('Message sent successfully!');
        
        // Reset form after sending
        setSubject('');
        setContent('');
        setSelectedRecipients([]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleScheduleMessage = async () => {
    if (!scheduledDate) {
      toast.error('Please select a date to schedule the message');
      return;
    }
    
    try {
      const result = await communicationService.scheduleMessage({
        subject,
        content,
        messageType: selectedMessageType,
        format: selectedFormat,
        recipients: {
          type: selectedRecipientType,
          items: selectedRecipients.length ? selectedRecipients : [selectedRecipientType]
        },
        status: 'scheduled',
        scheduledFor: scheduledDate
      });
      
      if (result) {
        toast.success('Message scheduled successfully!');
        
        // Reset form after scheduling
        setSubject('');
        setContent('');
        setSelectedRecipients([]);
        setScheduledDate(null);
      }
    } catch (error) {
      console.error('Error scheduling message:', error);
      toast.error('Failed to schedule message. Please try again.');
    }
  };

  return {
    subject,
    content,
    selectedRecipientType,
    selectedFormat,
    selectedMessageType,
    selectedRecipients,
    scheduledDate,
    setSubject,
    setContent,
    setSelectedRecipientType,
    setSelectedFormat,
    setSelectedMessageType,
    setSelectedRecipients,
    setScheduledDate,
    handleSendMessage,
    handleScheduleMessage,
    recipientTypes,
    formatOptions,
    messageTypes,
    templates
  };
};

export default useCommunityMessaging;
