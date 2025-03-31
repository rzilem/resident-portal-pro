
import { MergeTagGroup, MergeTag, CustomMergeTagDefinition, MergeTagCategory } from "@/types/mergeTags";

// Define sample merge tags for letter templates
const MERGE_TAG_GROUPS: MergeTagGroup[] = [
  {
    category: "resident",
    name: "Resident Information",
    tags: [
      {
        id: "resident-name",
        name: "Resident Name",
        description: "Full name of the resident",
        tag: "{{resident.name}}",
        example: "John Doe"
      },
      {
        id: "resident-first-name",
        name: "First Name",
        description: "First name of the resident",
        tag: "{{resident.firstName}}",
        example: "John"
      },
      {
        id: "resident-email",
        name: "Email",
        description: "Email address of the resident",
        tag: "{{resident.email}}",
        example: "john.doe@example.com"
      },
      {
        id: "resident-move-in-date",
        name: "Move-in Date",
        description: "Date the resident moved in",
        tag: "{{resident.moveInDate}}",
        example: "January 1, 2023"
      }
    ]
  },
  {
    category: "property",
    name: "Property Details",
    tags: [
      {
        id: "property-address",
        name: "Property Address",
        description: "Full address of the property",
        tag: "{{property.address}}",
        example: "123 Main St, Anytown, CA 91234"
      },
      {
        id: "property-unit",
        name: "Unit Number",
        description: "Unit number of the property",
        tag: "{{property.unitNumber}}",
        example: "Unit 4B"
      },
      {
        id: "property-type",
        name: "Property Type",
        description: "Type of property",
        tag: "{{property.type}}",
        example: "Condo"
      }
    ]
  },
  {
    category: "association",
    name: "Association Information",
    tags: [
      {
        id: "association-name",
        name: "Association Name",
        description: "Name of the HOA or community association",
        tag: "{{association.name}}",
        example: "Sunset Hills Community Association"
      },
      {
        id: "association-contact",
        name: "Association Contact",
        description: "Contact information for the association",
        tag: "{{association.contact}}",
        example: "contact@sunsethills.org"
      },
      {
        id: "association-website",
        name: "Association Website",
        description: "Website URL for the association",
        tag: "{{association.website}}",
        example: "www.sunsethills.org"
      }
    ]
  },
  {
    category: "compliance",
    name: "Compliance Details",
    tags: [
      {
        id: "violation-type",
        name: "Violation Type",
        description: "Type of violation reported",
        tag: "{{violation.type}}",
        example: "Unauthorized exterior modification"
      },
      {
        id: "violation-date",
        name: "Violation Date",
        description: "Date the violation was reported",
        tag: "{{violation.date}}",
        example: "March 15, 2023"
      },
      {
        id: "violation-description",
        name: "Violation Description",
        description: "Detailed description of the violation",
        tag: "{{violation.description}}",
        example: "Unauthorized installation of satellite dish on front facade"
      },
      {
        id: "correction-deadline",
        name: "Correction Deadline",
        description: "Deadline to correct the violation",
        tag: "{{violation.deadline}}",
        example: "April 15, 2023"
      }
    ]
  },
  {
    category: "financial",
    name: "Financial Information",
    tags: [
      {
        id: "balance-due",
        name: "Balance Due",
        description: "Current balance due from resident",
        tag: "{{financial.balanceDue}}",
        example: "$450.00"
      },
      {
        id: "assessment-amount",
        name: "Assessment Amount",
        description: "Regular assessment amount",
        tag: "{{financial.assessmentAmount}}",
        example: "$250.00"
      },
      {
        id: "late-fee",
        name: "Late Fee",
        description: "Late fee amount",
        tag: "{{financial.lateFee}}",
        example: "$25.00"
      },
      {
        id: "payment-due-date",
        name: "Payment Due Date",
        description: "Date by which payment is due",
        tag: "{{financial.dueDate}}",
        example: "January 15, 2023"
      }
    ]
  },
  {
    category: "date",
    name: "Date Information",
    tags: [
      {
        id: "current-date",
        name: "Current Date",
        description: "Today's date",
        tag: "{{date.current}}",
        example: "May 10, 2023"
      },
      {
        id: "meeting-date",
        name: "Meeting Date",
        description: "Date of upcoming board meeting",
        tag: "{{date.meeting}}",
        example: "June 1, 2023"
      },
      {
        id: "year",
        name: "Current Year",
        description: "Current year",
        tag: "{{date.year}}",
        example: "2023"
      }
    ]
  }
];

class MergeTagService {
  // Get all merge tag groups
  async getMergeTagGroups(): Promise<MergeTagGroup[]> {
    // In a real application, this might come from an API
    return MERGE_TAG_GROUPS;
  }

  // Get a single merge tag group by category
  async getMergeTagGroup(category: string): Promise<MergeTagGroup | undefined> {
    return MERGE_TAG_GROUPS.find(group => group.category === category);
  }

  // Get all available merge tags (flattened)
  async getAllMergeTags() {
    return MERGE_TAG_GROUPS.flatMap(group => group.tags);
  }

  // Process merge tags in content (replace them with sample values)
  async processMergeTags(content: string): Promise<string> {
    if (!content) return content;
    
    const allTags = await this.getAllMergeTags();
    let processedContent = content;
    
    // Simple replacement of merge tags with their example values
    allTags.forEach(tag => {
      if (tag.example) {
        const regex = new RegExp(tag.tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        processedContent = processedContent.replace(regex, tag.example);
      }
    });
    
    return processedContent;
  }
  
  // Get custom merge tags for a specific association
  async getCustomMergeTagsForAssociation(associationId: string): Promise<MergeTag[]> {
    // In a real implementation, this would fetch from the database
    // For now, just return a sample custom tag
    return [
      {
        id: 'custom-1',
        name: 'Pool Access Code',
        description: 'The current access code for the community pool',
        tag: '{{custom.property.pool_access_code}}',
        example: '1234',
        category: 'property'
      }
    ];
  }
  
  // Create a new custom merge tag
  async createCustomMergeTag(definition: CustomMergeTagDefinition): Promise<MergeTag> {
    // In a real implementation, this would store to the database
    return {
      id: `custom-${Date.now()}`,
      name: definition.name,
      description: definition.description,
      tag: definition.tag,
      example: definition.defaultValue,
      category: definition.category
    };
  }
  
  // Update an existing custom merge tag
  async updateCustomMergeTag(id: string, updates: Partial<CustomMergeTagDefinition>): Promise<MergeTag> {
    // In a real implementation, this would update the database
    return {
      id,
      name: updates.name || 'Updated Tag',
      description: updates.description || 'Updated Description',
      tag: updates.tag || '{{custom.updated}}',
      example: updates.defaultValue,
      category: updates.category || 'custom'
    };
  }
  
  // Delete a custom merge tag
  async deleteCustomMergeTag(id: string): Promise<boolean> {
    // In a real implementation, this would delete from the database
    console.log(`Deleting custom merge tag with ID: ${id}`);
    return true;
  }
}

export const mergeTagService = new MergeTagService();
