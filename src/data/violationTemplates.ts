
import { ViolationTemplate, ViolationGroup } from '@/types/compliance';
import { v4 as uuidv4 } from 'uuid';

export const violationGroups: ViolationGroup[] = [
  {
    id: '1',
    name: 'ARC',
    associationId: '1',
  },
  {
    id: '2',
    name: 'Maintenance',
    associationId: '1',
  },
  {
    id: '3',
    name: 'Landscaping',
    associationId: '1',
  },
  {
    id: '4',
    name: 'Parking',
    associationId: '1',
  },
  {
    id: '5',
    name: 'Noise',
    associationId: '1',
  },
  {
    id: '6',
    name: 'Pets',
    associationId: '1',
  }
];

export const violationTemplates: ViolationTemplate[] = [
  {
    id: '1',
    group: 'ARC',
    item: 'Architectural - Construction',
    description: 'Article 3.02: Approval for Construction - No Improvements shall be constructed upon any Lot without the prior written approval of the Avalon Reviewer.',
    associationId: '1',
    isUsed: true,
    articleNumber: '3.02',
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2023-05-12T08:00:00Z'
  },
  {
    id: '2',
    group: 'ARC',
    item: 'Architectural - Exterior Paint',
    description: 'Article 3.01: Design Guidelines - All Improvements erected, placed, constructed, painted, altered, modified, or remodeled on any portion of the Development Area shall have prior written approval by the Architectural Committee.',
    associationId: '1',
    isUsed: true,
    articleNumber: '3.01',
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2023-05-12T08:00:00Z'
  },
  {
    id: '3',
    group: 'ARC',
    item: 'Architectural - Fence Stain',
    description: 'Article 3.05: Fences - All improvements, including but not limited to: fences and stain must have prior written approval by the Architectural Committee.',
    associationId: '1',
    isUsed: true,
    articleNumber: '3.05',
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2023-05-12T08:00:00Z'
  },
  {
    id: '4',
    group: 'ARC',
    item: 'Architectural - Fencing',
    description: 'Article 3.05: Fences - All improvements, including but not limited to: fences must have prior written approval by the Architectural Committee.',
    associationId: '1',
    isUsed: true,
    articleNumber: '3.05',
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2023-05-12T08:00:00Z'
  },
  {
    id: '5',
    group: 'ARC',
    item: 'Architectural - Garage',
    description: 'Article 3.04: Garages - All improvements, including but not limited to: garages must have prior written approval by the Architectural Committee.',
    associationId: '1',
    isUsed: true,
    articleNumber: '3.04',
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2023-05-12T08:00:00Z'
  },
  {
    id: '6',
    group: 'ARC',
    item: 'Architectural - Gutters',
    description: 'Article 3.06: Building Materials - All projections from a dwelling or other structure, including but not limited to: gutters, downspouts, must have prior written approval by the Architectural Committee.',
    associationId: '1',
    isUsed: true,
    articleNumber: '3.06',
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2023-05-12T08:00:00Z'
  },
  {
    id: '7',
    group: 'ARC',
    item: 'Architectural - Landscape',
    description: 'Article 3.16: Landscaping - Each Owner shall be required to install landscaping upon such Owner\'s Lot in accordance with landscaping plans approved in advance of installation by the Avalon Reviewer.',
    associationId: '1',
    isUsed: true,
    articleNumber: '3.16',
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2023-05-12T08:00:00Z'
  },
  {
    id: '8',
    group: 'Maintenance',
    item: 'Property - Lawn',
    description: 'Article 4.02: Lawn Maintenance - Owners shall regularly mow and trim all lawns on their Lot. Lawns may not exceed 6 inches in height.',
    associationId: '1',
    isUsed: true,
    articleNumber: '4.02',
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2023-05-12T08:00:00Z'
  },
  {
    id: '9',
    group: 'Maintenance',
    item: 'Property - Exterior Cleanliness',
    description: 'Article 4.05: Cleanliness - Owners shall maintain the exterior of their dwelling and all structures, parking areas and other improvements on their Lot in good condition and shall keep such areas well maintained, safe, clean and attractive.',
    associationId: '1',
    isUsed: true,
    articleNumber: '4.05',
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2023-05-12T08:00:00Z'
  },
  {
    id: '10',
    group: 'Parking',
    item: 'Vehicles - Street Parking',
    description: 'Article 5.03: Street Parking - No vehicle may be parked on the street for more than 48 consecutive hours. Vehicles must be parked in driveways or garages when not in use.',
    associationId: '1',
    isUsed: true,
    articleNumber: '5.03',
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2023-05-12T08:00:00Z'
  }
];

export const getViolationTemplatesByAssociation = (associationId: string): ViolationTemplate[] => {
  return violationTemplates.filter(template => template.associationId === associationId);
};

export const getViolationGroupsByAssociation = (associationId: string): ViolationGroup[] => {
  return violationGroups.filter(group => group.associationId === associationId);
};

export const toggleTemplateUsage = (templateId: string): ViolationTemplate[] => {
  // Create a new array to avoid mutating the original
  const updatedTemplates = violationTemplates.map(template => {
    if (template.id === templateId) {
      return {
        ...template,
        isUsed: !template.isUsed,
        updatedAt: new Date().toISOString()
      };
    }
    return template;
  });
  
  // In a real app, you would update the data on the server here
  
  // Return the updated array for immediate UI update
  return updatedTemplates;
};
