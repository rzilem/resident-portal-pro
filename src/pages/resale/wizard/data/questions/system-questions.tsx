
import { ProjectTypeQuestions } from '../../types';

export const SYSTEM_QUESTIONS: ProjectTypeQuestions = {
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
};
