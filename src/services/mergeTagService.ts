
import { MergeTag, MergeTagGroup, MergeTagCategory, CustomMergeTagDefinition } from '@/types/mergeTags';

// Mock merge tag data
const associationTags: MergeTag[] = [
  { id: 'assoc-1', name: 'Association Name', description: 'The name of the association', tag: '{{association.name}}', example: 'Oakridge Community HOA', category: 'association' },
  { id: 'assoc-2', name: 'Association Address', description: 'The full address of the association', tag: '{{association.address}}', example: '123 Oak Avenue, Oakridge, CA 90210', category: 'association' },
  { id: 'assoc-3', name: 'Association City', description: 'The city of the association', tag: '{{association.city}}', example: 'Oakridge', category: 'association' },
  { id: 'assoc-4', name: 'Association State', description: 'The state of the association', tag: '{{association.state}}', example: 'California', category: 'association' },
  { id: 'assoc-5', name: 'Association Zip', description: 'The ZIP code of the association', tag: '{{association.zip}}', example: '90210', category: 'association' },
  { id: 'assoc-6', name: 'Association Phone', description: 'The main phone number for the association', tag: '{{association.phone}}', example: '(555) 123-4567', category: 'association' },
  { id: 'assoc-7', name: 'Association Email', description: 'The main email address for the association', tag: '{{association.email}}', example: 'info@oakridgehoa.com', category: 'association' },
  { id: 'assoc-8', name: 'Association Website', description: 'The website URL for the association', tag: '{{association.website}}', example: 'www.oakridgehoa.com', category: 'association' },
];

const propertyTags: MergeTag[] = [
  { id: 'prop-1', name: 'Property Address', description: 'The full address of the property', tag: '{{property.address}}', example: '123 Oak Avenue, Unit 101', category: 'property' },
  { id: 'prop-2', name: 'Property Unit Number', description: 'The unit number of the property', tag: '{{property.unit}}', example: '101', category: 'property' },
  { id: 'prop-3', name: 'Property Type', description: 'The type of property', tag: '{{property.type}}', example: 'Condominium', category: 'property' },
  { id: 'prop-4', name: 'Property Square Footage', description: 'The square footage of the property', tag: '{{property.sqft}}', example: '1,200', category: 'property' },
  { id: 'prop-5', name: 'Property Bedrooms', description: 'Number of bedrooms in the property', tag: '{{property.bedrooms}}', example: '2', category: 'property' },
  { id: 'prop-6', name: 'Property Bathrooms', description: 'Number of bathrooms in the property', tag: '{{property.bathrooms}}', example: '2', category: 'property' },
  { id: 'prop-7', name: 'Property Parking Spaces', description: 'Number of assigned parking spaces', tag: '{{property.parking_spaces}}', example: '1', category: 'property' },
  { id: 'prop-8', name: 'Property Building', description: 'The building name or number', tag: '{{property.building}}', example: 'Building A', category: 'property' },
];

const residentTags: MergeTag[] = [
  { id: 'res-1', name: 'Resident Full Name', description: 'The full name of the resident', tag: '{{resident.name}}', example: 'John Smith', category: 'resident' },
  { id: 'res-2', name: 'Resident First Name', description: 'The first name of the resident', tag: '{{resident.first_name}}', example: 'John', category: 'resident' },
  { id: 'res-3', name: 'Resident Last Name', description: 'The last name of the resident', tag: '{{resident.last_name}}', example: 'Smith', category: 'resident' },
  { id: 'res-4', name: 'Resident Email', description: 'The email address of the resident', tag: '{{resident.email}}', example: 'john.smith@email.com', category: 'resident' },
  { id: 'res-5', name: 'Resident Phone', description: 'The phone number of the resident', tag: '{{resident.phone}}', example: '(555) 987-6543', category: 'resident' },
  { id: 'res-6', name: 'Resident Type', description: 'The type of resident (owner/tenant)', tag: '{{resident.type}}', example: 'Owner', category: 'resident' },
  { id: 'res-7', name: 'Resident Move-in Date', description: 'The date the resident moved in', tag: '{{resident.move_in_date}}', example: 'January 15, 2022', category: 'resident' },
  { id: 'res-8', name: 'Resident Balance', description: 'The current account balance of the resident', tag: '{{resident.balance}}', example: '$250.00', category: 'resident' },
];

const financialTags: MergeTag[] = [
  { id: 'fin-1', name: 'Monthly Assessment Amount', description: 'The monthly assessment amount', tag: '{{financial.monthly_assessment}}', example: '$350.00', category: 'financial' },
  { id: 'fin-2', name: 'Assessment Due Date', description: 'The date assessments are due', tag: '{{financial.due_date}}', example: '1st of each month', category: 'financial' },
  { id: 'fin-3', name: 'Late Fee Amount', description: 'The amount of the late fee', tag: '{{financial.late_fee}}', example: '$25.00', category: 'financial' },
  { id: 'fin-4', name: 'Late Fee Date', description: 'The date late fees are assessed', tag: '{{financial.late_fee_date}}', example: '15th of each month', category: 'financial' },
  { id: 'fin-5', name: 'Current Balance', description: 'The current account balance', tag: '{{financial.current_balance}}', example: '$350.00', category: 'financial' },
  { id: 'fin-6', name: 'Past Due Amount', description: 'The past due amount', tag: '{{financial.past_due}}', example: '$0.00', category: 'financial' },
  { id: 'fin-7', name: 'Payment Methods', description: 'Available payment methods', tag: '{{financial.payment_methods}}', example: 'Check, ACH, Credit Card', category: 'financial' },
  { id: 'fin-8', name: 'Last Payment Date', description: 'The date of the last payment', tag: '{{financial.last_payment_date}}', example: 'June 1, 2023', category: 'financial' },
];

const maintenanceTags: MergeTag[] = [
  { id: 'maint-1', name: 'Maintenance Request ID', description: 'The ID of the maintenance request', tag: '{{maintenance.request_id}}', example: 'REQ-12345', category: 'maintenance' },
  { id: 'maint-2', name: 'Maintenance Request Date', description: 'The date the maintenance request was submitted', tag: '{{maintenance.request_date}}', example: 'July 10, 2023', category: 'maintenance' },
  { id: 'maint-3', name: 'Maintenance Request Status', description: 'The current status of the maintenance request', tag: '{{maintenance.status}}', example: 'In Progress', category: 'maintenance' },
  { id: 'maint-4', name: 'Maintenance Request Description', description: 'The description of the maintenance issue', tag: '{{maintenance.description}}', example: 'Leaking kitchen faucet', category: 'maintenance' },
  { id: 'maint-5', name: 'Maintenance Priority', description: 'The priority level of the maintenance request', tag: '{{maintenance.priority}}', example: 'High', category: 'maintenance' },
  { id: 'maint-6', name: 'Maintenance Assigned To', description: 'The person or vendor assigned to the request', tag: '{{maintenance.assigned_to}}', example: 'John\'s Plumbing', category: 'maintenance' },
  { id: 'maint-7', name: 'Maintenance Estimated Completion', description: 'The estimated completion date', tag: '{{maintenance.estimated_completion}}', example: 'July 15, 2023', category: 'maintenance' },
  { id: 'maint-8', name: 'Maintenance Access Instructions', description: 'Instructions for accessing the property', tag: '{{maintenance.access_instructions}}', example: 'Key in lockbox #1234', category: 'maintenance' },
];

const communicationTags: MergeTag[] = [
  { id: 'comm-1', name: 'Communication Date', description: 'The date of the communication', tag: '{{communication.date}}', example: 'August 5, 2023', category: 'communication' },
  { id: 'comm-2', name: 'Communication Subject', description: 'The subject of the communication', tag: '{{communication.subject}}', example: 'Important Community Update', category: 'communication' },
  { id: 'comm-3', name: 'Communication Sender', description: 'The sender of the communication', tag: '{{communication.sender}}', example: 'Board of Directors', category: 'communication' },
  { id: 'comm-4', name: 'Communication Method', description: 'The method of communication', tag: '{{communication.method}}', example: 'Email', category: 'communication' },
  { id: 'comm-5', name: 'Communication Category', description: 'The category of the communication', tag: '{{communication.category}}', example: 'Announcements', category: 'communication' },
  { id: 'comm-6', name: 'Communication Priority', description: 'The priority level of the communication', tag: '{{communication.priority}}', example: 'High', category: 'communication' },
  { id: 'comm-7', name: 'Communication Response Required', description: 'Whether a response is required', tag: '{{communication.response_required}}', example: 'Yes, by August 10, 2023', category: 'communication' },
  { id: 'comm-8', name: 'Communication Attachments', description: 'The attachments included in the communication', tag: '{{communication.attachments}}', example: 'Meeting Minutes.pdf', category: 'communication' },
];

const meetingTags: MergeTag[] = [
  { id: 'meet-1', name: 'Meeting Title', description: 'The title of the meeting', tag: '{{meeting.title}}', example: 'Annual Board Meeting', category: 'meeting' },
  { id: 'meet-2', name: 'Meeting Date', description: 'The date of the meeting', tag: '{{meeting.date}}', example: 'September 15, 2023', category: 'meeting' },
  { id: 'meet-3', name: 'Meeting Time', description: 'The time of the meeting', tag: '{{meeting.time}}', example: '7:00 PM', category: 'meeting' },
  { id: 'meet-4', name: 'Meeting Location', description: 'The location of the meeting', tag: '{{meeting.location}}', example: 'Community Clubhouse', category: 'meeting' },
  { id: 'meet-5', name: 'Meeting Agenda', description: 'The agenda for the meeting', tag: '{{meeting.agenda}}', example: '1. Call to Order 2. Approval of Minutes 3. Financial Report', category: 'meeting' },
  { id: 'meet-6', name: 'Meeting Type', description: 'The type of meeting', tag: '{{meeting.type}}', example: 'Board Meeting', category: 'meeting' },
  { id: 'meet-7', name: 'Meeting RSVP Deadline', description: 'The deadline to RSVP for the meeting', tag: '{{meeting.rsvp_deadline}}', example: 'September 10, 2023', category: 'meeting' },
  { id: 'meet-8', name: 'Meeting Virtual Link', description: 'The virtual meeting link', tag: '{{meeting.virtual_link}}', example: 'https://zoom.us/j/123456789', category: 'meeting' },
];

const workflowTags: MergeTag[] = [
  { id: 'work-1', name: 'Workflow Name', description: 'The name of the workflow', tag: '{{workflow.name}}', example: 'New Resident Onboarding', category: 'workflow' },
  { id: 'work-2', name: 'Workflow Start Date', description: 'The date the workflow started', tag: '{{workflow.start_date}}', example: 'October 1, 2023', category: 'workflow' },
  { id: 'work-3', name: 'Workflow Status', description: 'The current status of the workflow', tag: '{{workflow.status}}', example: 'In Progress', category: 'workflow' },
  { id: 'work-4', name: 'Workflow Step', description: 'The current step in the workflow', tag: '{{workflow.current_step}}', example: 'Document Collection', category: 'workflow' },
  { id: 'work-5', name: 'Workflow Assignee', description: 'The person assigned to the workflow', tag: '{{workflow.assignee}}', example: 'Jane Doe', category: 'workflow' },
  { id: 'work-6', name: 'Workflow Due Date', description: 'The due date for the workflow', tag: '{{workflow.due_date}}', example: 'October 15, 2023', category: 'workflow' },
  { id: 'work-7', name: 'Workflow Priority', description: 'The priority of the workflow', tag: '{{workflow.priority}}', example: 'Medium', category: 'workflow' },
  { id: 'work-8', name: 'Workflow Notes', description: 'Notes related to the workflow', tag: '{{workflow.notes}}', example: 'Awaiting resident documentation', category: 'workflow' },
];

const boardTags: MergeTag[] = [
  { id: 'board-1', name: 'Board President', description: 'The name of the board president', tag: '{{board.president}}', example: 'Michael Johnson', category: 'board' },
  { id: 'board-2', name: 'Board Vice President', description: 'The name of the board vice president', tag: '{{board.vice_president}}', example: 'Sarah Williams', category: 'board' },
  { id: 'board-3', name: 'Board Treasurer', description: 'The name of the board treasurer', tag: '{{board.treasurer}}', example: 'David Chen', category: 'board' },
  { id: 'board-4', name: 'Board Secretary', description: 'The name of the board secretary', tag: '{{board.secretary}}', example: 'Maria Garcia', category: 'board' },
  { id: 'board-5', name: 'Board Member Count', description: 'The total number of board members', tag: '{{board.member_count}}', example: '5', category: 'board' },
  { id: 'board-6', name: 'Board Term End Date', description: 'The end date of the current board term', tag: '{{board.term_end_date}}', example: 'December 31, 2023', category: 'board' },
  { id: 'board-7', name: 'Board Next Election Date', description: 'The date of the next board election', tag: '{{board.next_election_date}}', example: 'November 15, 2023', category: 'board' },
  { id: 'board-8', name: 'Board Contact Email', description: 'The contact email for the board', tag: '{{board.contact_email}}', example: 'board@oakridgehoa.com', category: 'board' },
];

// ... add additional categories as needed

// Group tags by category
const mergeTagGroups: MergeTagGroup[] = [
  { category: 'association', name: 'Association', description: 'Association details and contact information', tags: associationTags },
  { category: 'property', name: 'Property', description: 'Property-specific information', tags: propertyTags },
  { category: 'resident', name: 'Resident', description: 'Resident personal and contact information', tags: residentTags },
  { category: 'financial', name: 'Financial', description: 'Assessment and payment information', tags: financialTags },
  { category: 'maintenance', name: 'Maintenance', description: 'Maintenance request information', tags: maintenanceTags },
  { category: 'communication', name: 'Communication', description: 'Communication details', tags: communicationTags },
  { category: 'meeting', name: 'Meeting', description: 'Meeting details and scheduling', tags: meetingTags },
  { category: 'workflow', name: 'Workflow', description: 'Workflow process information', tags: workflowTags },
  { category: 'board', name: 'Board', description: 'Board member information', tags: boardTags },
  // Custom tags will be added here on a per-association basis
];

// Sample custom tags for demo purposes
const customTags: MergeTag[] = [
  { 
    id: 'custom-1', 
    name: 'Community Event Coordinator', 
    description: 'The name of the community event coordinator', 
    tag: '{{custom.event_coordinator}}', 
    example: 'Emily Wilson',
    category: 'custom',
    isCustom: true,
    associationId: '123'
  },
  { 
    id: 'custom-2', 
    name: 'Pool Access Code', 
    description: 'The current access code for the pool', 
    tag: '{{custom.pool_code}}', 
    example: '4321',
    category: 'custom',
    isCustom: true,
    associationId: '123'
  },
];

class MergeTagService {
  // Get all merge tag groups
  getMergeTagGroups = async (): Promise<MergeTagGroup[]> => {
    // In a real implementation, this would fetch from an API
    return [...mergeTagGroups, {
      category: 'custom' as MergeTagCategory,
      name: 'Custom Fields',
      description: 'Custom fields specific to your association',
      tags: customTags
    }];
  }

  // Get all merge tags in a flat array
  getAllMergeTags = async (): Promise<MergeTag[]> => {
    const groups = await this.getMergeTagGroups();
    return groups.flatMap(group => group.tags);
  }

  // Get merge tags by category
  getMergeTagsByCategory = async (category: MergeTagCategory): Promise<MergeTag[]> => {
    const groups = await this.getMergeTagGroups();
    const group = groups.find(g => g.category === category);
    return group ? group.tags : [];
  }

  // Get custom merge tags for a specific association
  getCustomMergeTagsForAssociation = async (associationId: string): Promise<MergeTag[]> => {
    // In a real implementation, this would fetch from an API
    return customTags.filter(tag => tag.associationId === associationId);
  }

  // Create a custom merge tag
  createCustomMergeTag = async (tag: CustomMergeTagDefinition): Promise<MergeTag> => {
    // In a real implementation, this would post to an API
    const newTag: MergeTag = {
      id: `custom-${Date.now()}`,
      name: tag.name,
      description: tag.description,
      tag: tag.tag,
      category: tag.category,
      isCustom: true,
      associationId: tag.associationId,
      example: tag.defaultValue || 'Custom value',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // For this mock, we'll just log it
    console.log('Added custom merge tag:', newTag);
    
    return newTag;
  }

  // Update a custom merge tag
  updateCustomMergeTag = async (tagId: string, updates: Partial<MergeTag>): Promise<MergeTag> => {
    // In a real implementation, this would update via an API
    console.log('Updating custom merge tag:', tagId, updates);
    
    // Mock implementation
    const existingTag = customTags.find(tag => tag.id === tagId);
    if (!existingTag) {
      throw new Error('Tag not found');
    }
    
    const updatedTag = { ...existingTag, ...updates, updatedAt: new Date().toISOString() };
    
    return updatedTag;
  }

  // Delete a custom merge tag
  deleteCustomMergeTag = async (tagId: string): Promise<boolean> => {
    // In a real implementation, this would delete from an API
    console.log('Deleting custom merge tag:', tagId);
    return true;
  }

  // Process merge tags in a string (replace with actual values)
  processMergeTags = async (content: string, context: any = {}): Promise<string> => {
    // Get all tags
    const allTags = await this.getAllMergeTags();
    
    // For this mock implementation, we'll just replace with examples
    let processedContent = content;
    
    allTags.forEach(tag => {
      const tagRegex = new RegExp(tag.tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      processedContent = processedContent.replace(tagRegex, tag.example || '[No example value]');
    });
    
    return processedContent;
  }
}

export const mergeTagService = new MergeTagService();
