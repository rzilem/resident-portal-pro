
import { AlertSolution } from '@/types/alert';

// Example alert solutions
export const getAlertSolutions = (alertType: string): AlertSolution[] => {
  const solutions: Record<string, AlertSolution[]> = {
    'landscaping': [
      {
        id: 'landscaping-1',
        title: 'Send Landscaping Violation Notice',
        description: 'Send an official notice to the resident about the landscaping violation',
        steps: [
          'Generate violation notice letter from template',
          'Send via certified mail to the resident',
          'Record the communication in the violation record',
          'Schedule a follow-up inspection in 14 days'
        ]
      },
      {
        id: 'landscaping-2',
        title: 'Schedule Landscaping Service',
        description: 'Arrange for a landscaping service to address the issue (cost will be billed to the homeowner)',
        steps: [
          'Contact approved landscaping vendor',
          'Schedule the service',
          'Notify the resident of the scheduled service',
          'Bill the resident for the service cost plus administrative fee'
        ]
      }
    ],
    'exterior_modification': [
      {
        id: 'exterior-1',
        title: 'Request ARC Application',
        description: 'Request that the homeowner submit an Architectural Review Committee application',
        steps: [
          'Send ARC application form to the resident',
          'Provide deadline for submission (usually 7 days)',
          'Schedule ARC review meeting',
          'Notify the resident of the ARC decision'
        ]
      }
    ],
    'parking': [
      {
        id: 'parking-1',
        title: 'Issue Parking Warning',
        description: 'Issue a warning for the parking violation',
        steps: [
          'Document the violation with photos',
          'Place a warning notice on the vehicle',
          'Send a copy of the warning to the resident',
          'Follow up in 48 hours to verify compliance'
        ]
      },
      {
        id: 'parking-2',
        title: 'Arrange for Vehicle Towing',
        description: 'Arrange for the vehicle to be towed (for repeat violations)',
        steps: [
          'Verify this is a repeat violation',
          'Contact authorized towing company',
          'Document the violation and towing with photos',
          'Notify the resident of the towing action'
        ]
      }
    ],
    'noise': [
      {
        id: 'noise-1',
        title: 'Send Noise Complaint Notice',
        description: 'Send a notice about the noise complaint',
        steps: [
          'Document the dates and times of reported noise',
          'Send formal notice to the resident',
          'Provide copy of the noise restrictions from CC&Rs',
          'Offer to mediate between complainant and violator if needed'
        ]
      }
    ],
    'default': [
      {
        id: 'default-1',
        title: 'Send Standard Violation Notice',
        description: 'Send a standard violation notice to the resident',
        steps: [
          'Generate violation notice from template',
          'Include relevant section of HOA rules or CC&Rs',
          'Send via certified mail',
          'Set reminder for follow-up in 14 days'
        ]
      },
      {
        id: 'default-2',
        title: 'Schedule Hearing with Board',
        description: 'Schedule a hearing with the HOA board',
        steps: [
          'Set hearing date (must be at least 14 days notice)',
          'Notify resident of hearing date, time, and location',
          'Prepare violation documentation for board review',
          'Send hearing results and decision to resident within 7 days'
        ]
      }
    ]
  };

  // Convert alertType to a key that matches our solutions object
  let key = alertType.toLowerCase().replace(/\s+/g, '_');
  
  // If we don't have specific solutions for this type, use default
  if (!solutions[key]) {
    key = 'default';
  }

  return solutions[key];
};
