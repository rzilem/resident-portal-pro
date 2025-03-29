
import { Building, Wrench, Wind, Warehouse, Hammer, Castle, Fence, Trees } from 'lucide-react';
import { ProjectType, ProjectTypeQuestions } from './types';

export const PROJECT_TYPES: ProjectType[] = [
  { 
    id: 'fencing', 
    name: 'Fencing', 
    icon: Fence, 
    description: 'Fence installation, repair, or replacement services'
  },
  { 
    id: 'construction', 
    name: 'Construction (Big Projects)', 
    icon: Building, 
    description: 'Large-scale construction and renovation projects'
  },
  { 
    id: 'hvac', 
    name: 'HVAC', 
    icon: Wind, 
    description: 'Heating, ventilation, and air conditioning services'
  },
  { 
    id: 'roofing', 
    name: 'Roofing', 
    icon: Warehouse, 
    description: 'Roof repair, replacement, and maintenance'
  },
  { 
    id: 'plumbing', 
    name: 'Plumbing', 
    icon: Wrench, 
    description: 'Plumbing installation, repair, and maintenance'
  },
  { 
    id: 'landscaping', 
    name: 'Landscaping', 
    icon: Trees, 
    description: 'Landscape design, installation, and maintenance'
  },
  { 
    id: 'renovation', 
    name: 'Renovation', 
    icon: Hammer, 
    description: 'Interior and exterior renovation services'
  },
  { 
    id: 'other', 
    name: 'Other', 
    icon: Castle, 
    description: 'Other specialized services not listed above'
  }
];

export const PROJECT_QUESTIONS: ProjectTypeQuestions = {
  fencing: [
    {
      id: 'requestType',
      question: 'What is the type of bid request?',
      type: 'radio',
      options: ['Maintenance/Repair', 'Service Contract', 'Construction/New Build'],
      required: true,
    },
    {
      id: 'location',
      question: 'Where is the fence located?',
      type: 'radio',
      options: ['Exterior Community Fence', 'Pool Fence', 'Playground Fence', 'Other'],
      required: true,
    },
    {
      id: 'material',
      question: 'What material should the fence be made of?',
      type: 'radio',
      options: ['Wood', 'Metal', 'Vinyl', 'Chain Link', 'Stone', 'Composite', 'Other'],
      required: true,
    },
    {
      id: 'height',
      question: 'What is the fence height?',
      type: 'radio',
      options: ['4 Feet', '6 Feet', '8 Feet', 'Other'],
      required: true,
    },
    {
      id: 'length',
      question: 'What is the approximate length of the fence (in feet)?',
      type: 'number',
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ],
  hvac: [
    {
      id: 'requestType',
      question: 'What is the type of bid request?',
      type: 'radio',
      options: ['Installation', 'Replacement', 'Repair', 'Maintenance Contract'],
      required: true,
    },
    {
      id: 'systemType',
      question: 'What type of HVAC system is needed?',
      type: 'radio',
      options: ['Central Air', 'Heat Pump', 'Ductless Mini-Split', 'Furnace Only', 'AC Only', 'Other'],
      required: true,
    },
    {
      id: 'capacity',
      question: 'What is the required capacity/size?',
      type: 'radio',
      options: ['Small (< 2 tons)', 'Medium (2-3.5 tons)', 'Large (> 3.5 tons)', 'Unknown/Need Recommendation'],
      required: true,
    },
    {
      id: 'buildingType',
      question: 'What type of building is this for?',
      type: 'radio',
      options: ['Clubhouse', 'Community Center', 'Residential Unit', 'Office', 'Other'],
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ],
  construction: [
    {
      id: 'projectScope',
      question: 'What is the scope of the construction project?',
      type: 'radio',
      options: ['New Building', 'Addition', 'Renovation', 'Repair', 'Infrastructure'],
      required: true,
    },
    {
      id: 'buildingType',
      question: 'What type of building or structure is involved?',
      type: 'radio',
      options: ['Residential', 'Clubhouse', 'Pool', 'Tennis Courts', 'Parking Area', 'Other'],
      required: true,
    },
    {
      id: 'squareFootage',
      question: 'What is the approximate square footage involved?',
      type: 'number',
      required: true,
    },
    {
      id: 'permitRequired',
      question: 'Will permits be required for this project?',
      type: 'radio',
      options: ['Yes', 'No', 'Unknown'],
      required: true,
    },
    {
      id: 'timeframe',
      question: 'What is the preferred timeframe for completion?',
      type: 'radio',
      options: ['Within 30 days', '1-3 months', '3-6 months', '6+ months', 'Flexible'],
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ],
  // Add minimal questions for other project types to get started
  roofing: [
    {
      id: 'requestType',
      question: 'What is the type of roofing work needed?',
      type: 'radio',
      options: ['New Installation', 'Replacement', 'Repair', 'Inspection'],
      required: true,
    },
    {
      id: 'roofType',
      question: 'What type of roofing material is preferred?',
      type: 'radio',
      options: ['Shingle', 'Metal', 'Tile', 'Flat/Membrane', 'Other'],
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ],
  plumbing: [
    {
      id: 'requestType',
      question: 'What type of plumbing service is needed?',
      type: 'radio',
      options: ['Installation', 'Repair', 'Replacement', 'Maintenance'],
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Please provide details about the plumbing issue or project:',
      type: 'text',
      required: true,
    }
  ],
  landscaping: [
    {
      id: 'serviceType',
      question: 'What landscaping service is needed?',
      type: 'radio',
      options: ['Design', 'Installation', 'Maintenance', 'Tree Service', 'Irrigation'],
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Please provide details about the landscaping project:',
      type: 'text',
      required: true,
    }
  ],
  renovation: [
    {
      id: 'renovationType',
      question: 'What type of renovation is needed?',
      type: 'radio',
      options: ['Interior', 'Exterior', 'Both'],
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Please provide details about the renovation project:',
      type: 'text',
      required: true,
    }
  ],
  other: [
    {
      id: 'projectDescription',
      question: 'Please describe the project or service needed:',
      type: 'text',
      required: true,
    },
    {
      id: 'timeline',
      question: 'What is the preferred timeline for this project?',
      type: 'radio',
      options: ['Urgent (within a week)', 'Soon (within a month)', 'Flexible (1-3 months)', 'Long-term (3+ months)'],
      required: true,
    }
  ]
};
