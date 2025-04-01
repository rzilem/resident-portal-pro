
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { MessageTemplate, CompositionMessage } from '@/pages/communications/types';

// Define the Communication type for internal API communication
export interface Communication {
  id: string;
  subject: string;
  content: string;
  message_type: string;
  format: string;
  recipients: {
    recipient_email: string;
  }[];
  scheduled_for?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Function to get all message templates
export const getMessageTemplates = async (): Promise<MessageTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('communication_templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform data to match the MessageTemplate interface
    const templates: MessageTemplate[] = data.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description || '',
      subject: template.subject || '',
      content: template.content,
      category: template.category || 'General',
      type: 'email', // Default value
      format: 'html', // Default value
      lastUpdated: template.updated_at,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
      isDefault: false
    }));
    
    return templates;
  } catch (error) {
    console.error('Error fetching message templates:', error);
    toast.error('Failed to load message templates');
    return [];
  }
};

// Function to get a specific message template by ID
export const getMessageTemplateById = async (id: string): Promise<MessageTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('communication_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      subject: data.subject || '',
      content: data.content,
      category: data.category || 'General',
      type: 'email', // Default value
      format: 'html', // Default value
      lastUpdated: data.updated_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      isDefault: false
    };
  } catch (error) {
    console.error('Error fetching message template:', error);
    toast.error('Failed to load message template');
    return null;
  }
};

// Function to create a new message template
export const createMessageTemplate = async (template: Partial<MessageTemplate>): Promise<MessageTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('communication_templates')
      .insert({
        name: template.name,
        description: template.description,
        subject: template.subject,
        content: template.content,
        category: template.category
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success('Template created successfully');
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      subject: data.subject || '',
      content: data.content,
      category: data.category || 'General',
      type: 'email', // Default value
      format: 'html', // Default value
      lastUpdated: data.updated_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      isDefault: false
    };
  } catch (error) {
    console.error('Error creating message template:', error);
    toast.error('Failed to create template');
    return null;
  }
};

// Function to update an existing message template
export const updateMessageTemplate = async (id: string, updates: Partial<MessageTemplate>): Promise<MessageTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('communication_templates')
      .update({
        name: updates.name,
        description: updates.description,
        subject: updates.subject,
        content: updates.content,
        category: updates.category
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success('Template updated successfully');
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      subject: data.subject || '',
      content: data.content,
      category: data.category || 'General',
      type: 'email', // Default value
      format: 'html', // Default value
      lastUpdated: data.updated_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      isDefault: false
    };
  } catch (error) {
    console.error('Error updating message template:', error);
    toast.error('Failed to update template');
    return null;
  }
};

// Function to delete a message template
export const deleteMessageTemplate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('communication_templates')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Template deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting message template:', error);
    toast.error('Failed to delete template');
    return false;
  }
};

// Function to send a message
export const sendMessage = async (message: CompositionMessage): Promise<boolean> => {
  try {
    // For now, just log the message and return success
    console.log('Sending message:', message);
    
    // Here you would typically call an API endpoint or Supabase function to send the email
    
    toast.success('Message sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message');
    return false;
  }
};

// Function to schedule a message for later sending
export const scheduleMessage = async (message: CompositionMessage): Promise<boolean> => {
  try {
    // For now, just log the scheduled message and return success
    console.log('Scheduling message for:', message.scheduledFor);
    console.log('Message:', message);
    
    // Here you would typically save the scheduled message to the database
    
    toast.success('Message scheduled successfully');
    return true;
  } catch (error) {
    console.error('Error scheduling message:', error);
    toast.error('Failed to schedule message');
    return false;
  }
};

// Additional functions needed by the application

// Get scheduled communications
export const getScheduledCommunications = async (): Promise<Communication[]> => {
  // This would typically fetch from the database
  return [];
};

// Mark a communication as sent
export const markAsSent = async (id: string): Promise<boolean> => {
  // This would typically update the status in the database
  return true;
};

// Cancel a scheduled communication
export const cancelScheduledCommunication = async (id: string): Promise<boolean> => {
  // This would typically delete or update the status in the database
  console.log('Cancelling scheduled communication:', id);
  toast.success('Scheduled message cancelled');
  return true;
};

// Get all communications (sent and scheduled)
export const getCommunications = async (): Promise<Communication[]> => {
  // This would typically fetch from the database
  // For now, return mock data
  return [
    {
      id: '1',
      subject: 'Meeting Reminder',
      content: '<p>This is a reminder about the upcoming board meeting.</p>',
      message_type: 'email',
      format: 'html',
      recipients: [{ recipient_email: 'user1@example.com' }, { recipient_email: 'user2@example.com' }],
      status: 'sent',
      created_at: '2023-09-15T14:30:00Z',
      updated_at: '2023-09-15T14:30:00Z'
    },
    {
      id: '2',
      subject: 'Pool Maintenance',
      content: '<p>The pool will be closed for maintenance tomorrow.</p>',
      message_type: 'email',
      format: 'html',
      recipients: [{ recipient_email: 'residents@example.com' }],
      status: 'scheduled',
      scheduled_for: '2023-09-22T10:00:00Z',
      created_at: '2023-09-15T11:20:00Z',
      updated_at: '2023-09-15T11:20:00Z'
    },
    {
      id: '3',
      subject: '',
      content: 'Reminder: Trash pickup is delayed this week due to the holiday.',
      message_type: 'sms',
      format: 'plain',
      recipients: [{ recipient_email: '+11234567890' }, { recipient_email: '+10987654321' }],
      status: 'sent',
      created_at: '2023-09-14T09:45:00Z',
      updated_at: '2023-09-14T09:45:00Z'
    }
  ];
};

// Mock function to get sample templates for demo purposes
export const getSampleTemplates = (): MessageTemplate[] => {
  return [
    {
      id: '1',
      name: 'Welcome Email',
      description: 'Default welcome email for new residents',
      subject: 'Welcome to Our Community!',
      content: '<p>Dear {{resident.name}},</p><p>Welcome to {{association.name}}! We\'re delighted to have you join our community.</p><p>Here are a few important resources to help you get started:</p><ul><li>Community website: {{association.website}}</li><li>Resident portal: {{portal.url}}</li><li>Emergency contact: {{association.emergency_contact}}</li></ul><p>If you have any questions, please don\'t hesitate to reach out.</p><p>Best regards,<br>{{association.manager_name}}<br>{{association.name}} Management</p>',
      category: 'Welcome',
      type: 'email',
      format: 'html',
      lastUpdated: '2023-04-15T10:30:00Z',
      createdAt: '2023-04-01T09:00:00Z',
      updatedAt: '2023-04-15T10:30:00Z',
      isDefault: true
    },
    {
      id: '2',
      name: 'Maintenance Notice',
      description: 'Template for scheduled maintenance notices',
      subject: 'Scheduled Maintenance Notice',
      content: '<p>Dear {{resident.name}},</p><p>This is to inform you that we will be performing scheduled maintenance on <strong>{{maintenance.date}}</strong> from <strong>{{maintenance.start_time}}</strong> to <strong>{{maintenance.end_time}}</strong>.</p><p>The following areas will be affected:</p><ul>{{maintenance.affected_areas}}</ul><p>We apologize for any inconvenience this may cause. If you have any questions or special needs during this time, please contact the management office.</p><p>Thank you for your understanding.</p><p>Best regards,<br>{{association.name}} Management</p>',
      category: 'Maintenance',
      type: 'email',
      format: 'html',
      lastUpdated: '2023-05-10T14:45:00Z',
      createdAt: '2023-04-10T11:20:00Z',
      updatedAt: '2023-05-10T14:45:00Z',
      isDefault: true
    },
    {
      id: '3',
      name: 'Board Meeting Invitation',
      description: 'Template for board meeting invitations',
      subject: 'Invitation: Upcoming Board Meeting',
      content: '<p>Dear {{resident.name}},</p><p>You are cordially invited to attend our upcoming board meeting:</p><p><strong>Date:</strong> {{meeting.date}}<br><strong>Time:</strong> {{meeting.time}}<br><strong>Location:</strong> {{meeting.location}}</p><p><strong>Agenda:</strong></p><ol>{{meeting.agenda_items}}</ol><p>Your participation is important to us, and we value your input on community matters.</p><p>If you are unable to attend but would like to submit comments or questions, please email them to {{association.email}} before the meeting.</p><p>We look forward to seeing you there!</p><p>Best regards,<br>{{association.board_president}}<br>Board President, {{association.name}}</p>',
      category: 'Meetings',
      type: 'email',
      format: 'html',
      lastUpdated: '2023-06-05T09:15:00Z',
      createdAt: '2023-03-20T16:30:00Z',
      updatedAt: '2023-06-05T09:15:00Z',
      isDefault: true
    }
  ];
};

// Export the service object with all functions
export const communicationService = {
  getMessageTemplates,
  getMessageTemplateById,
  createMessageTemplate,
  updateMessageTemplate,
  deleteMessageTemplate,
  sendMessage,
  scheduleMessage,
  getSampleTemplates,
  getScheduledCommunications,
  markAsSent,
  cancelScheduledCommunication,
  getCommunications
};
