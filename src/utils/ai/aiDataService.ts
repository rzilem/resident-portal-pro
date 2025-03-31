import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert } from '@/types/alert';
import { DocumentFile } from '@/types/documents';
import { aiActionService } from './aiActionService';

/**
 * Service to fetch data for the AI assistant
 */
export const aiDataService = {
  /**
   * Fetch recent alerts for an association
   * @param associationId - The association ID to fetch alerts for
   * @returns Array of alerts
   */
  async getAssociationAlerts(associationId?: string): Promise<Alert[]> {
    try {
      if (!associationId) return [];
      
      const { data, error } = await supabase
        .from('violations')
        .select(`
          id,
          violation_type,
          description,
          status,
          reported_date,
          resolved_date,
          property_id,
          association_id
        `)
        .eq('association_id', associationId)
        .order('reported_date', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching alerts for AI:', error);
        return [];
      }
      
      return data.map((violation): Alert => ({
        id: violation.id,
        title: violation.violation_type,
        description: violation.description || '',
        category: 'compliance',
        severity: 'medium',
        status: (violation.status as Alert['status']) || 'new',
        createdAt: violation.reported_date,
        resolvedAt: violation.resolved_date,
        propertyId: violation.property_id,
        associationId: violation.association_id
      }));
    } catch (error) {
      console.error('Error in getAssociationAlerts:', error);
      return [];
    }
  },
  
  /**
   * Fetch association details
   * @param associationId - The association ID
   * @returns Association details or null
   */
  async getAssociationDetails(associationId?: string) {
    try {
      if (!associationId) return null;
      
      const { data, error } = await supabase
        .from('associations')
        .select(`
          *,
          association_settings(settings)
        `)
        .eq('id', associationId)
        .single();
      
      if (error) {
        console.error('Error fetching association details for AI:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getAssociationDetails:', error);
      return null;
    }
  },
  
  /**
   * Fetch documents for an association
   * @param associationId - The association ID
   * @returns Array of documents
   */
  async getAssociationDocuments(associationId?: string): Promise<DocumentFile[]> {
    try {
      if (!associationId) return [];
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('association_id', associationId)
        .order('uploaded_date', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching documents for AI:', error);
        return [];
      }
      
      return data.map(doc => ({
        id: doc.id,
        name: doc.name,
        description: doc.description || '',
        fileSize: doc.file_size,
        fileType: doc.file_type,
        url: doc.url,
        category: doc.category || 'uncategorized',
        tags: doc.tags || [],
        uploadedBy: doc.uploaded_by || '',
        uploadedDate: doc.uploaded_date || new Date().toISOString(),
        lastModified: doc.last_modified || new Date().toISOString(),
        version: doc.version || 1,
        isPublic: doc.is_public || false,
        isArchived: doc.is_archived || false,
        associations: [associationId],
        properties: [],
        metadata: {}
      }));
    } catch (error) {
      console.error('Error in getAssociationDocuments:', error);
      return [];
    }
  },
  
  /**
   * Fetch properties for an association
   * @param associationId - The association ID
   * @returns Array of properties
   */
  async getAssociationProperties(associationId?: string) {
    try {
      if (!associationId) return [];
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('association_id', associationId)
        .limit(20);
      
      if (error) {
        console.error('Error fetching properties for AI:', error);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Error in getAssociationProperties:', error);
      return [];
    }
  },
  
  /**
   * Check if the user message contains an action request
   * @param message - User message
   * @returns Object indicating if message contains an action request
   */
  detectActionRequest(message: string): {
    isActionRequest: boolean;
    actionType?: string;
    actionParams?: Record<string, any>;
  } {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('send email') || messageLower.includes('send message') || messageLower.includes('email')) {
      const recipients = this.extractEmailRecipients(message);
      const subject = this.extractSubject(message);
      
      return {
        isActionRequest: true,
        actionType: 'send_message',
        actionParams: {
          type: 'email',
          recipients: recipients.length ? recipients : ['community@example.com'],
          subject: subject || 'Message from Community Assistant',
          content: `This is an email generated based on user request: "${message}"`
        }
      };
    }
    
    if (messageLower.includes('create alert') || messageLower.includes('new alert')) {
      return {
        isActionRequest: true,
        actionType: 'create_alert',
        actionParams: {
          title: this.extractAlertTitle(message) || 'New Alert',
          description: message,
          category: this.detectAlertCategory(message)
        }
      };
    }
    
    if (messageLower.includes('start workflow') || messageLower.includes('run workflow')) {
      return {
        isActionRequest: true,
        actionType: 'start_workflow',
        actionParams: {
          templateId: this.detectWorkflowType(message)
        }
      };
    }
    
    if (messageLower.includes('schedule') && (messageLower.includes('event') || messageLower.includes('meeting'))) {
      return {
        isActionRequest: true,
        actionType: 'schedule_event',
        actionParams: {
          title: this.extractEventTitle(message) || 'New Event',
          start: this.extractDateTime(message) || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          description: message
        }
      };
    }
    
    return { isActionRequest: false };
  },
  
  /**
   * Generate AI response with context from the system data
   * @param message - User's message
   * @param associationId - Current association ID
   * @returns Generated response
   */
  async generateResponse(message: string, associationId?: string): Promise<string> {
    try {
      console.log('Generating AI response with context, association:', associationId);
      
      const actionRequest = this.detectActionRequest(message);
      
      if (actionRequest.isActionRequest && actionRequest.actionType) {
        const actionResult = await aiActionService.processAction(
          actionRequest.actionType,
          actionRequest.actionParams || {}
        );
        
        if (actionResult.success) {
          return `✅ ${actionResult.message}`;
        } else {
          return `❌ ${actionResult.message}. Please provide more information or try a different request.`;
        }
      }
      
      const [alerts, associationDetails, documents, properties] = await Promise.all([
        this.getAssociationAlerts(associationId),
        this.getAssociationDetails(associationId),
        this.getAssociationDocuments(associationId),
        this.getAssociationProperties(associationId)
      ]);
      
      console.log('AI Context Data:', {
        alertsCount: alerts.length,
        hasAssociationDetails: !!associationDetails,
        documentsCount: documents.length,
        propertiesCount: properties?.length || 0
      });
      
      const messageLower = message.toLowerCase();
      
      if (messageLower.includes('alert') || messageLower.includes('violation')) {
        if (alerts.length > 0) {
          return `I found ${alerts.length} recent alerts for your association. The most recent is: "${alerts[0].title}" - ${alerts[0].description}`;
        } else {
          return "I don't see any recent alerts for your association.";
        }
      } else if (messageLower.includes('document') || messageLower.includes('file')) {
        if (documents.length > 0) {
          return `I found ${documents.length} documents in your association. The most recent is "${documents[0].name}" in the ${documents[0].category} category.`;
        } else {
          return "I don't see any documents in your association's repository.";
        }
      } else if (messageLower.includes('property') || messageLower.includes('properties')) {
        if (properties && properties.length > 0) {
          return `Your association has ${properties.length} properties on record. One example is at ${properties[0].address}, ${properties[0].city}, ${properties[0].state} ${properties[0].zip}.`;
        } else {
          return "I don't have information about properties in your association.";
        }
      } else if (messageLower.includes('association')) {
        if (associationDetails) {
          return `Your association "${associationDetails.name}" has ${associationDetails.units || 'an unknown number of'} units and was founded on ${associationDetails.founded_date || 'an unknown date'}.`;
        } else {
          return "I don't have detailed information about your association.";
        }
      } else if (messageLower.includes('help') || messageLower.includes('capabilities')) {
        return `I can help you with various tasks in your community. You can ask me to:
- Send emails and messages to community members
- Create alerts for issues that need attention
- Start workflows for common processes
- Schedule events and meetings
- Find information about properties, documents, and alerts

Just tell me what you'd like to do!`;
      }
      
      return `I understand your question about "${message}". I've looked at your association data but don't have a specific answer for that query. You can ask me about alerts, documents, properties, or ask me to perform actions like sending emails or creating alerts.`;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return `I'm sorry, I encountered an error while processing your request. Please try again later.`;
    }
  },
  
  private extractEmailRecipients(message: string): string[] {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const matches = message.match(emailRegex);
    return matches || [];
  },
  
  private extractSubject(message: string): string | null {
    const subjectRegex = /subject[:\s]+([^\.]+)/i;
    const match = message.match(subjectRegex);
    return match ? match[1].trim() : null;
  },
  
  private extractAlertTitle(message: string): string | null {
    const titleRegex = /title[:\s]+([^\.]+)/i;
    const match = message.match(titleRegex);
    return match ? match[1].trim() : null;
  },
  
  private detectAlertCategory(message: string): string {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('maintenance') || messageLower.includes('repair')) {
      return 'maintenance';
    } else if (messageLower.includes('noise') || messageLower.includes('disturbance')) {
      return 'noise';
    } else if (messageLower.includes('parking')) {
      return 'parking';
    } else if (messageLower.includes('landscape') || messageLower.includes('yard')) {
      return 'landscaping';
    } else {
      return 'general';
    }
  },
  
  private detectWorkflowType(message: string): string {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('violation') || messageLower.includes('compliance')) {
      return 'violation';
    } else if (messageLower.includes('maintenance')) {
      return 'maintenance';
    } else if (messageLower.includes('onboarding') || messageLower.includes('new resident')) {
      return 'residentonboarding';
    } else if (messageLower.includes('delinquency') || messageLower.includes('payment')) {
      return 'delinquency';
    } else if (messageLower.includes('architectural') || messageLower.includes('review')) {
      return 'architecturalreview';
    } else {
      return 'violation'; // Default to violation workflow
    }
  },
  
  private extractEventTitle(message: string): string | null {
    const titleRegex = /called[:\s]+([^\.]+)|titled[:\s]+([^\.]+)|named[:\s]+([^\.]+)/i;
    const match = message.match(titleRegex);
    if (match) {
      return (match[1] || match[2] || match[3]).trim();
    }
    return null;
  },
  
  private extractDateTime(message: string): string | null {
    const dateRegex = /on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})/i;
    const timeRegex = /at\s+(\d{1,2}:\d{2}\s*(?:am|pm)?)/i;
    
    const dateMatch = message.match(dateRegex);
    const timeMatch = message.match(timeRegex);
    
    if (dateMatch) {
      const dateStr = dateMatch[1];
      const timeStr = timeMatch ? timeMatch[1] : '9:00 AM';
      
      try {
        const date = new Date(`${dateStr} ${timeStr}`);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      } catch (e) {
        console.error('Error parsing date/time:', e);
      }
    }
    
    return null;
  }
};
