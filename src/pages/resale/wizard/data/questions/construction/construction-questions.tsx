
import { ProjectTypeQuestions } from '../../../types';

export const CONSTRUCTION_QUESTIONS: ProjectTypeQuestions = {
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
  ]
};
