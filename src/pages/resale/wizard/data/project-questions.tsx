
import { ProjectTypeQuestions } from '../types';

export const PROJECT_QUESTIONS: ProjectTypeQuestions = {
  fencing: [
    {
      id: 'requestType',
      text: 'What is the type of bid request?',
      type: 'radio',
      options: ['Maintenance/Repair', 'Service Contract', 'Construction/New Build'],
      required: true,
    },
    {
      id: 'location',
      text: 'Where is the fence located?',
      type: 'radio',
      options: ['Exterior Community Fence', 'Pool Fence', 'Playground Fence', 'Other'],
      required: true,
    },
    {
      id: 'material',
      text: 'What material should the fence be made of?',
      type: 'radio',
      options: ['Wood', 'Metal', 'Vinyl', 'Chain Link', 'Stone', 'Composite', 'Other'],
      required: true,
    },
    {
      id: 'height',
      text: 'What is the fence height?',
      type: 'radio',
      options: ['4 Feet', '6 Feet', '8 Feet', 'Other'],
      required: true,
    },
    {
      id: 'length',
      text: 'What is the approximate length of the fence (in feet)?',
      type: 'number',
      required: true,
    },
    {
      id: 'additionalDetails',
      text: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ],
  hvac: [
    {
      id: 'requestType',
      text: 'What is the type of bid request?',
      type: 'radio',
      options: ['Installation', 'Replacement', 'Repair', 'Maintenance Contract'],
      required: true,
    },
    {
      id: 'systemType',
      text: 'What type of HVAC system is needed?',
      type: 'radio',
      options: ['Central Air', 'Heat Pump', 'Ductless Mini-Split', 'Furnace Only', 'AC Only', 'Other'],
      required: true,
    },
    {
      id: 'capacity',
      text: 'What is the required capacity/size?',
      type: 'radio',
      options: ['Small (< 2 tons)', 'Medium (2-3.5 tons)', 'Large (> 3.5 tons)', 'Unknown/Need Recommendation'],
      required: true,
    },
    {
      id: 'buildingType',
      text: 'What type of building is this for?',
      type: 'radio',
      options: ['Clubhouse', 'Community Center', 'Residential Unit', 'Office', 'Other'],
      required: true,
    },
    {
      id: 'additionalDetails',
      text: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ],
  construction: [
    {
      id: 'projectScope',
      text: 'What is the scope of the construction project?',
      type: 'radio',
      options: ['New Building', 'Addition', 'Renovation', 'Repair', 'Infrastructure'],
      required: true,
    },
    {
      id: 'buildingType',
      text: 'What type of building or structure is involved?',
      type: 'radio',
      options: ['Residential', 'Clubhouse', 'Pool', 'Tennis Courts', 'Parking Area', 'Other'],
      required: true,
    },
    {
      id: 'squareFootage',
      text: 'What is the approximate square footage involved?',
      type: 'number',
      required: true,
    },
    {
      id: 'permitRequired',
      text: 'Will permits be required for this project?',
      type: 'radio',
      options: ['Yes', 'No', 'Unknown'],
      required: true,
    },
    {
      id: 'timeframe',
      text: 'What is the preferred timeframe for completion?',
      type: 'radio',
      options: ['Within 30 days', '1-3 months', '3-6 months', '6+ months', 'Flexible'],
      required: true,
    },
    {
      id: 'additionalDetails',
      text: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ],
  roofing: [
    {
      id: 'requestType',
      text: 'What is the type of roofing work needed?',
      type: 'radio',
      options: ['New Installation', 'Replacement', 'Repair', 'Inspection'],
      required: true,
    },
    {
      id: 'roofType',
      text: 'What type of roofing material is preferred?',
      type: 'radio',
      options: ['Shingle', 'Metal', 'Tile', 'Flat/Membrane', 'Other'],
      required: true,
    },
    {
      id: 'additionalDetails',
      text: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ],
  plumbing: [
    {
      id: 'requestType',
      text: 'What type of plumbing service is needed?',
      type: 'radio',
      options: ['Installation', 'Repair', 'Replacement', 'Maintenance'],
      required: true,
    },
    {
      id: 'additionalDetails',
      text: 'Please provide details about the plumbing issue or project:',
      type: 'text',
      required: true,
    }
  ],
  landscaping: [
    {
      id: 'serviceType',
      text: 'What landscaping service is needed?',
      type: 'radio',
      options: ['Design', 'Installation', 'Maintenance', 'Tree Service', 'Irrigation'],
      required: true,
    },
    {
      id: 'additionalDetails',
      text: 'Please provide details about the landscaping project:',
      type: 'text',
      required: true,
    }
  ],
  renovation: [
    {
      id: 'renovationType',
      text: 'What type of renovation is needed?',
      type: 'radio',
      options: ['Interior', 'Exterior', 'Both'],
      required: true,
    },
    {
      id: 'additionalDetails',
      text: 'Please provide details about the renovation project:',
      type: 'text',
      required: true,
    }
  ],
  other: [
    {
      id: 'projectDescription',
      text: 'Please describe the project or service needed:',
      type: 'text',
      required: true,
    },
    {
      id: 'timeline',
      text: 'What is the preferred timeline for this project?',
      type: 'radio',
      options: ['Urgent (within a week)', 'Soon (within a month)', 'Flexible (1-3 months)', 'Long-term (3+ months)'],
      required: true,
    }
  ]
};
