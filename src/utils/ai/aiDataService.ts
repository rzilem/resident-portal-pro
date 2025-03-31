
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert } from '@/types/alert';
import { DocumentFile } from '@/types/documents';

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
   * Generate AI response with context from the system data
   * @param message - User's message
   * @param associationId - Current association ID
   * @returns Generated response
   */
  async generateResponse(message: string, associationId?: string): Promise<string> {
    try {
      console.log('Generating AI response with context, association:', associationId);
      
      // In a full implementation, this would make a call to an AI service
      // with context from all the data we've gathered
      
      // Gather context data
      const [alerts, associationDetails, documents, properties] = await Promise.all([
        this.getAssociationAlerts(associationId),
        this.getAssociationDetails(associationId),
        this.getAssociationDocuments(associationId),
        this.getAssociationProperties(associationId)
      ]);
      
      // Simple keyword-based response for demo purposes
      // In a real implementation, this would be replaced with an AI API call
      const messageLower = message.toLowerCase();
      
      // Log the context data for debugging
      console.log('AI Context Data:', {
        alertsCount: alerts.length,
        hasAssociationDetails: !!associationDetails,
        documentsCount: documents.length,
        propertiesCount: properties?.length || 0
      });
      
      // Return response based on keywords and available data
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
      }
      
      // Default response
      return `I understand your question about "${message}". I've looked at your association data including ${alerts.length} alerts, ${documents.length} documents, and ${properties?.length || 0} properties. In a production environment, I would connect to our knowledge base and these data sources to provide a detailed answer.`;
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('There was an error generating an AI response');
      return "I'm sorry, I encountered an error while trying to access your data. Please try again later.";
    }
  }
};
