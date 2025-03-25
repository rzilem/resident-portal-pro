
import { MergeTag, MergeTagGroup, CustomMergeTagDefinition } from '@/types/mergeTags';
import { v4 as uuid } from 'uuid';

// Standard merge tags grouped by category
const standardMergeTags: MergeTagGroup[] = [
  {
    category: 'association',
    name: 'Association',
    description: 'Association information',
    tags: [
      { id: 'assoc-1', name: 'Association Name', description: 'Full name of the association', category: 'association', tag: '{{association.name}}', example: 'Oakridge Community Association' },
      { id: 'assoc-2', name: 'Association Address', description: 'Full address of the association', category: 'association', tag: '{{association.address}}', example: '123 Main Street, Anytown, CA 12345' },
      { id: 'assoc-3', name: 'Association Email', description: 'Primary contact email', category: 'association', tag: '{{association.email}}', example: 'contact@oakridgecommunity.org' },
      { id: 'assoc-4', name: 'Association Phone', description: 'Primary contact phone', category: 'association', tag: '{{association.phone}}', example: '(555) 123-4567' },
      { id: 'assoc-5', name: 'Association Website', description: 'Association website URL', category: 'association', tag: '{{association.website}}', example: 'www.oakridgecommunity.org' },
      { id: 'assoc-6', name: 'Association Code', description: 'Association code/identifier', category: 'association', tag: '{{association.code}}', example: 'OAK-001' },
      { id: 'assoc-7', name: 'Association Type', description: 'Type of association', category: 'association', tag: '{{association.type}}', example: 'HOA' },
      { id: 'assoc-8', name: 'Total Units', description: 'Total number of units', category: 'association', tag: '{{association.units}}', example: '156' },
    ]
  },
  {
    category: 'property',
    name: 'Property',
    description: 'Property information',
    tags: [
      { id: 'prop-1', name: 'Property Address', description: 'Full address of the property', category: 'property', tag: '{{property.address}}', example: '123 Oak Lane' },
      { id: 'prop-2', name: 'Property Unit Number', description: 'Unit number of the property', category: 'property', tag: '{{property.unit}}', example: '204' },
      { id: 'prop-3', name: 'Property Type', description: 'Type of property', category: 'property', tag: '{{property.type}}', example: 'Single Family Home' },
      { id: 'prop-4', name: 'Property Square Footage', description: 'Square footage of the property', category: 'property', tag: '{{property.sqft}}', example: '1,850' },
      { id: 'prop-5', name: 'Property Lot Size', description: 'Lot size of the property', category: 'property', tag: '{{property.lotSize}}', example: '0.25 acres' },
      { id: 'prop-6', name: 'Property Bedrooms', description: 'Number of bedrooms', category: 'property', tag: '{{property.bedrooms}}', example: '3' },
      { id: 'prop-7', name: 'Property Bathrooms', description: 'Number of bathrooms', category: 'property', tag: '{{property.bathrooms}}', example: '2.5' },
      { id: 'prop-8', name: 'Property Purchase Date', description: 'Date the property was purchased', category: 'property', tag: '{{property.purchaseDate}}', example: 'January 15, 2021' },
    ]
  },
  {
    category: 'resident',
    name: 'Resident',
    description: 'Resident information',
    tags: [
      { id: 'res-1', name: 'Resident First Name', description: 'First name of the resident', category: 'resident', tag: '{{resident.firstName}}', example: 'John' },
      { id: 'res-2', name: 'Resident Last Name', description: 'Last name of the resident', category: 'resident', tag: '{{resident.lastName}}', example: 'Smith' },
      { id: 'res-3', name: 'Resident Full Name', description: 'Full name of the resident', category: 'resident', tag: '{{resident.fullName}}', example: 'John Smith' },
      { id: 'res-4', name: 'Resident Email', description: 'Email address of the resident', category: 'resident', tag: '{{resident.email}}', example: 'john.smith@example.com' },
      { id: 'res-5', name: 'Resident Phone', description: 'Phone number of the resident', category: 'resident', tag: '{{resident.phone}}', example: '(555) 987-6543' },
      { id: 'res-6', name: 'Resident Type', description: 'Type of resident (owner/tenant)', category: 'resident', tag: '{{resident.type}}', example: 'Owner' },
      { id: 'res-7', name: 'Resident Move-In Date', description: 'Date resident moved in', category: 'resident', tag: '{{resident.moveInDate}}', example: 'March 10, 2022' },
      { id: 'res-8', name: 'Resident Status', description: 'Current status of resident', category: 'resident', tag: '{{resident.status}}', example: 'Active' },
    ]
  },
  {
    category: 'financial',
    name: 'Financial',
    description: 'Financial information',
    tags: [
      { id: 'fin-1', name: 'Account Balance', description: 'Current account balance', category: 'financial', tag: '{{financial.balance}}', example: '$1,250.00' },
      { id: 'fin-2', name: 'Last Payment Amount', description: 'Amount of last payment', category: 'financial', tag: '{{financial.lastPaymentAmount}}', example: '$350.00' },
      { id: 'fin-3', name: 'Last Payment Date', description: 'Date of last payment', category: 'financial', tag: '{{financial.lastPaymentDate}}', example: 'April 1, 2023' },
      { id: 'fin-4', name: 'Next Due Amount', description: 'Amount due on next payment', category: 'financial', tag: '{{financial.nextDueAmount}}', example: '$350.00' },
      { id: 'fin-5', name: 'Next Due Date', description: 'Due date for next payment', category: 'financial', tag: '{{financial.nextDueDate}}', example: 'May 1, 2023' },
      { id: 'fin-6', name: 'Late Fee Amount', description: 'Amount of late fee if applicable', category: 'financial', tag: '{{financial.lateFeeAmount}}', example: '$25.00' },
      { id: 'fin-7', name: 'Outstanding Balance', description: 'Total amount overdue', category: 'financial', tag: '{{financial.outstandingBalance}}', example: '$725.00' },
      { id: 'fin-8', name: 'Payment History Link', description: 'Link to payment history', category: 'financial', tag: '{{financial.paymentHistoryLink}}', example: 'https://portal.association.com/payments/history' },
    ]
  },
  {
    category: 'maintenance',
    name: 'Maintenance',
    description: 'Maintenance request information',
    tags: [
      { id: 'maint-1', name: 'Request ID', description: 'Maintenance request ID', category: 'maintenance', tag: '{{maintenance.requestId}}', example: 'MAINT-2023-001' },
      { id: 'maint-2', name: 'Request Date', description: 'Date of maintenance request', category: 'maintenance', tag: '{{maintenance.requestDate}}', example: 'May 15, 2023' },
      { id: 'maint-3', name: 'Request Description', description: 'Description of maintenance issue', category: 'maintenance', tag: '{{maintenance.description}}', example: 'Leaking faucet in master bathroom' },
      { id: 'maint-4', name: 'Request Status', description: 'Current status of request', category: 'maintenance', tag: '{{maintenance.status}}', example: 'In Progress' },
      { id: 'maint-5', name: 'Assigned Vendor', description: 'Vendor assigned to request', category: 'maintenance', tag: '{{maintenance.assignedVendor}}', example: 'ABC Plumbing' },
      { id: 'maint-6', name: 'Scheduled Date', description: 'Date scheduled for service', category: 'maintenance', tag: '{{maintenance.scheduledDate}}', example: 'May 20, 2023' },
      { id: 'maint-7', name: 'Priority Level', description: 'Priority level of request', category: 'maintenance', tag: '{{maintenance.priority}}', example: 'Medium' },
      { id: 'maint-8', name: 'Request Link', description: 'Link to maintenance request details', category: 'maintenance', tag: '{{maintenance.requestLink}}', example: 'https://portal.association.com/maintenance/MAINT-2023-001' },
    ]
  },
  {
    category: 'communication',
    name: 'Communication',
    description: 'Communication information',
    tags: [
      { id: 'comm-1', name: 'Message ID', description: 'Unique ID of the message', category: 'communication', tag: '{{communication.messageId}}', example: 'MSG-12345' },
      { id: 'comm-2', name: 'Sender Name', description: 'Name of the sender', category: 'communication', tag: '{{communication.senderName}}', example: 'Property Manager' },
      { id: 'comm-3', name: 'Reply To Email', description: 'Email address for replies', category: 'communication', tag: '{{communication.replyToEmail}}', example: 'manager@oakridgecommunity.org' },
      { id: 'comm-4', name: 'Date Sent', description: 'Date the message was sent', category: 'communication', tag: '{{communication.dateSent}}', example: 'June 10, 2023' },
      { id: 'comm-5', name: 'Subject', description: 'Subject of the message', category: 'communication', tag: '{{communication.subject}}', example: 'Pool Closure Notice' },
      { id: 'comm-6', name: 'Association Logo', description: 'HTML for association logo', category: 'communication', tag: '{{communication.associationLogo}}', example: '<img src="logo.png" alt="Association Logo">' },
      { id: 'comm-7', name: 'Portal Link', description: 'Link to resident portal', category: 'communication', tag: '{{communication.portalLink}}', example: 'https://portal.association.com' },
      { id: 'comm-8', name: 'Unsubscribe Link', description: 'Link to unsubscribe from communications', category: 'communication', tag: '{{communication.unsubscribeLink}}', example: 'https://portal.association.com/unsubscribe' },
    ]
  },
  {
    category: 'meeting',
    name: 'Meeting',
    description: 'Meeting information',
    tags: [
      { id: 'meet-1', name: 'Meeting Title', description: 'Title of the meeting', category: 'meeting', tag: '{{meeting.title}}', example: 'Annual HOA Meeting' },
      { id: 'meet-2', name: 'Meeting Date', description: 'Date of the meeting', category: 'meeting', tag: '{{meeting.date}}', example: 'July 15, 2023' },
      { id: 'meet-3', name: 'Meeting Time', description: 'Time of the meeting', category: 'meeting', tag: '{{meeting.time}}', example: '7:00 PM' },
      { id: 'meet-4', name: 'Meeting Location', description: 'Location of the meeting', category: 'meeting', tag: '{{meeting.location}}', example: 'Community Clubhouse' },
      { id: 'meet-5', name: 'Meeting Agenda', description: 'Agenda for the meeting', category: 'meeting', tag: '{{meeting.agenda}}', example: '1. Call to order\n2. Approval of minutes\n3. Financial report' },
      { id: 'meet-6', name: 'Virtual Meeting Link', description: 'Link for virtual attendance', category: 'meeting', tag: '{{meeting.virtualLink}}', example: 'https://zoom.us/j/1234567890' },
      { id: 'meet-7', name: 'RSVP Link', description: 'Link to RSVP for the meeting', category: 'meeting', tag: '{{meeting.rsvpLink}}', example: 'https://portal.association.com/meetings/rsvp/123' },
      { id: 'meet-8', name: 'Meeting Minutes', description: 'Link to previous meeting minutes', category: 'meeting', tag: '{{meeting.previousMinutesLink}}', example: 'https://portal.association.com/minutes/2023-06-15' },
    ]
  },
  {
    category: 'workflow',
    name: 'Workflow',
    description: 'Workflow information',
    tags: [
      { id: 'flow-1', name: 'Workflow Name', description: 'Name of the workflow', category: 'workflow', tag: '{{workflow.name}}', example: 'New Resident Onboarding' },
      { id: 'flow-2', name: 'Current Step', description: 'Current step in the workflow', category: 'workflow', tag: '{{workflow.currentStep}}', example: 'Document Collection' },
      { id: 'flow-3', name: 'Next Step', description: 'Next step in the workflow', category: 'workflow', tag: '{{workflow.nextStep}}', example: 'Board Review' },
      { id: 'flow-4', name: 'Due Date', description: 'Due date for current step', category: 'workflow', tag: '{{workflow.dueDate}}', example: 'August 1, 2023' },
      { id: 'flow-5', name: 'Assignee', description: 'Person assigned to current step', category: 'workflow', tag: '{{workflow.assignee}}', example: 'Jane Manager' },
      { id: 'flow-6', name: 'Status', description: 'Current status of workflow', category: 'workflow', tag: '{{workflow.status}}', example: 'In Progress' },
      { id: 'flow-7', name: 'Started Date', description: 'Date workflow was started', category: 'workflow', tag: '{{workflow.startedDate}}', example: 'July 1, 2023' },
      { id: 'flow-8', name: 'Workflow Link', description: 'Link to workflow details', category: 'workflow', tag: '{{workflow.link}}', example: 'https://portal.association.com/workflows/123' },
    ]
  },
  {
    category: 'board',
    name: 'Board',
    description: 'Board information',
    tags: [
      { id: 'board-1', name: 'Board President', description: 'Name of board president', category: 'board', tag: '{{board.president}}', example: 'Michael Johnson' },
      { id: 'board-2', name: 'Board Members', description: 'List of board members', category: 'board', tag: '{{board.members}}', example: 'Michael Johnson, Sarah Lee, Robert Chen, Lisa Garcia' },
      { id: 'board-3', name: 'Next Board Meeting', description: 'Date of next board meeting', category: 'board', tag: '{{board.nextMeetingDate}}', example: 'August 15, 2023' },
      { id: 'board-4', name: 'Board Term End', description: 'End date of current board term', category: 'board', tag: '{{board.termEndDate}}', example: 'December 31, 2023' },
      { id: 'board-5', name: 'Open Board Positions', description: 'Number of open board positions', category: 'board', tag: '{{board.openPositions}}', example: '2' },
      { id: 'board-6', name: 'Board Election Date', description: 'Date of next board election', category: 'board', tag: '{{board.electionDate}}', example: 'November 15, 2023' },
      { id: 'board-7', name: 'Board Contact Email', description: 'Email for contacting the board', category: 'board', tag: '{{board.contactEmail}}', example: 'board@oakridgecommunity.org' },
      { id: 'board-8', name: 'Board Meeting Location', description: 'Location of board meetings', category: 'board', tag: '{{board.meetingLocation}}', example: 'Community Clubhouse Conference Room' },
    ]
  },
  {
    category: 'event',
    name: 'Event',
    description: 'Event information',
    tags: [
      { id: 'event-1', name: 'Event Name', description: 'Name of the event', category: 'event', tag: '{{event.name}}', example: 'Summer Pool Party' },
      { id: 'event-2', name: 'Event Date', description: 'Date of the event', category: 'event', tag: '{{event.date}}', example: 'August 12, 2023' },
      { id: 'event-3', name: 'Event Time', description: 'Time of the event', category: 'event', tag: '{{event.time}}', example: '1:00 PM - 4:00 PM' },
      { id: 'event-4', name: 'Event Location', description: 'Location of the event', category: 'event', tag: '{{event.location}}', example: 'Community Pool Area' },
      { id: 'event-5', name: 'Event Description', description: 'Description of the event', category: 'event', tag: '{{event.description}}', example: 'Join us for our annual summer pool party with food, games, and music!' },
      { id: 'event-6', name: 'Event RSVP Deadline', description: 'Deadline to RSVP for the event', category: 'event', tag: '{{event.rsvpDeadline}}', example: 'August 5, 2023' },
      { id: 'event-7', name: 'Event RSVP Link', description: 'Link to RSVP for the event', category: 'event', tag: '{{event.rsvpLink}}', example: 'https://portal.association.com/events/rsvp/456' },
      { id: 'event-8', name: 'Event Organizer', description: 'Name of event organizer', category: 'event', tag: '{{event.organizer}}', example: 'Social Committee' },
    ]
  },
  {
    category: 'violation',
    name: 'Violation',
    description: 'Violation information',
    tags: [
      { id: 'vio-1', name: 'Violation ID', description: 'ID of the violation', category: 'violation', tag: '{{violation.id}}', example: 'VIO-2023-042' },
      { id: 'vio-2', name: 'Violation Date', description: 'Date violation was reported', category: 'violation', tag: '{{violation.date}}', example: 'July 10, 2023' },
      { id: 'vio-3', name: 'Violation Type', description: 'Type of violation', category: 'violation', tag: '{{violation.type}}', example: 'Landscaping' },
      { id: 'vio-4', name: 'Violation Description', description: 'Description of the violation', category: 'violation', tag: '{{violation.description}}', example: 'Overgrown lawn exceeding 6 inches in height' },
      { id: 'vio-5', name: 'Correction Deadline', description: 'Deadline to correct violation', category: 'violation', tag: '{{violation.deadline}}', example: 'July 24, 2023' },
      { id: 'vio-6', name: 'Potential Fine', description: 'Potential fine amount if not corrected', category: 'violation', tag: '{{violation.potentialFine}}', example: '$100.00' },
      { id: 'vio-7', name: 'Relevant Rule', description: 'Association rule that was violated', category: 'violation', tag: '{{violation.rule}}', example: 'Section 5.3 of CC&Rs: Landscape Maintenance Requirements' },
      { id: 'vio-8', name: 'Violation Status', description: 'Current status of violation', category: 'violation', tag: '{{violation.status}}', example: 'Open' },
    ]
  }
];

// In-memory storage of custom merge tags
let customMergeTags: MergeTag[] = [];

export const mergeTagService = {
  // Get all merge tags (standard and custom)
  getAllMergeTags: () => {
    const allTags = [
      ...standardMergeTags.flatMap(group => group.tags),
      ...customMergeTags
    ];
    return Promise.resolve(allTags);
  },

  // Get merge tags grouped by category
  getMergeTagGroups: () => {
    // Combine standard groups with custom tags grouped by category
    const customTagGroups = Array.from(
      new Set(customMergeTags.map(tag => tag.category))
    ).map(category => {
      const categoryTags = customMergeTags.filter(tag => tag.category === category);
      return {
        category,
        name: getCategoryName(category),
        description: `Custom ${getCategoryName(category).toLowerCase()} merge tags`,
        tags: categoryTags
      };
    });

    return Promise.resolve([...standardMergeTags, ...customTagGroups]);
  },

  // Create a custom merge tag for an association
  createCustomMergeTag: (definition: CustomMergeTagDefinition) => {
    const newTag: MergeTag = {
      id: uuid(),
      name: definition.name,
      description: definition.description,
      category: definition.category,
      tag: definition.tag,
      example: definition.defaultValue || `Custom value for ${definition.name}`,
      isCustom: true,
      associationId: definition.associationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    customMergeTags.push(newTag);
    return Promise.resolve(newTag);
  },

  // Update a custom merge tag
  updateCustomMergeTag: (id: string, updates: Partial<MergeTag>) => {
    const index = customMergeTags.findIndex(tag => tag.id === id);
    if (index === -1) {
      return Promise.reject(new Error(`Merge tag with ID ${id} not found`));
    }

    const updatedTag = {
      ...customMergeTags[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    customMergeTags[index] = updatedTag;
    return Promise.resolve(updatedTag);
  },

  // Delete a custom merge tag
  deleteCustomMergeTag: (id: string) => {
    const index = customMergeTags.findIndex(tag => tag.id === id);
    if (index === -1) {
      return Promise.reject(new Error(`Merge tag with ID ${id} not found`));
    }

    customMergeTags.splice(index, 1);
    return Promise.resolve({ success: true });
  },

  // Get all custom merge tags for a specific association
  getCustomMergeTagsForAssociation: (associationId: string) => {
    const associationTags = customMergeTags.filter(
      tag => tag.associationId === associationId
    );
    return Promise.resolve(associationTags);
  },

  // Process a text with merge tags and replace with values
  // This is a simplified version - in a real app, you'd need to fetch actual data
  processMergeTags: (text: string, context: any) => {
    let processedText = text;
    
    // Get all merge tags in the text using regex
    const tagRegex = /{{([^{}]+)}}/g;
    const tags = [...text.matchAll(tagRegex)].map(match => match[0]);
    
    // Replace each tag with its value from context
    tags.forEach(tag => {
      // For demo purposes, just replace with example values
      const matchingTag = [...standardMergeTags.flatMap(group => group.tags), ...customMergeTags]
        .find(t => t.tag === tag);
      
      if (matchingTag?.example) {
        processedText = processedText.replace(tag, matchingTag.example);
      }
    });
    
    return processedText;
  }
};

// Helper function to get friendly category name
function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    association: 'Association',
    property: 'Property',
    resident: 'Resident',
    financial: 'Financial',
    maintenance: 'Maintenance',
    communication: 'Communication',
    meeting: 'Meeting',
    workflow: 'Workflow',
    board: 'Board',
    event: 'Event',
    violation: 'Violation',
    custom: 'Custom'
  };
  
  return names[category] || 'Miscellaneous';
}
