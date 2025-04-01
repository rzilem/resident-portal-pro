
import { useState } from 'react';
import { MessageTemplate } from './types';

const useCommunityMessaging = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedRecipientType, setSelectedRecipientType] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('html');
  const [selectedMessageType, setSelectedMessageType] = useState('email');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

  // Sample templates
  const templates: MessageTemplate[] = [
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
    console.log('Sending message:', {
      subject,
      content,
      recipients: selectedRecipients.length ? selectedRecipients : `All ${selectedRecipientType}`,
      format: selectedFormat,
      type: selectedMessageType
    });
    
    // Reset form after sending
    setTimeout(() => {
      setSubject('');
      setContent('');
      setSelectedRecipients([]);
    }, 1000);
  };

  const handleScheduleMessage = async () => {
    if (!scheduledDate) return;
    
    console.log('Scheduling message for:', scheduledDate, {
      subject,
      content,
      recipients: selectedRecipients.length ? selectedRecipients : `All ${selectedRecipientType}`,
      format: selectedFormat,
      type: selectedMessageType
    });
    
    // Reset form after scheduling
    setTimeout(() => {
      setSubject('');
      setContent('');
      setSelectedRecipients([]);
      setScheduledDate(null);
    }, 1000);
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
