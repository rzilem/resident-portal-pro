
import { ProjectTypeQuestions } from '../../../types';

export const RENOVATION_QUESTIONS: ProjectTypeQuestions = {
  renovation: [
    {
      id: 'renovationType',
      text: 'What type of renovation is needed?',
      type: 'radio',
      options: ['Interior', 'Exterior', 'Both'],
      required: true,
    },
    {
      id: 'facilityType',
      text: 'What type of facility is being renovated?',
      type: 'radio',
      options: ['Clubhouse', 'Pool Area', 'Fitness Center', 'Common Areas', 'Other'],
      required: true,
    },
    {
      id: 'renovationScope',
      text: 'What is the scope of renovation?',
      type: 'radio',
      options: ['Minor (Cosmetic)', 'Moderate (Some Structural)', 'Major (Complete Overhaul)'],
      required: true,
    },
    {
      id: 'isBudgeted',
      text: 'Budgeted item?',
      type: 'radio',
      options: ['Yes', 'No'],
      required: false,
    },
    {
      id: 'bidDueDate',
      text: 'Bid needed by',
      type: 'date',
      required: true,
    },
    {
      id: 'additionalDetails',
      text: 'Please provide details about the renovation project:',
      type: 'textarea',
      required: true,
    }
  ]
};
