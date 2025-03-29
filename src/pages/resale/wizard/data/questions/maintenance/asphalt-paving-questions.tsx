
import { ProjectTypeQuestions } from '../../../types';

export const ASPHALT_PAVING_QUESTIONS: ProjectTypeQuestions = {
  asphaltPaving: [
    {
      id: 'serviceType',
      text: 'What type of asphalt/paving service is needed?',
      type: 'radio',
      options: [
        {
          label: 'New Installation',
          value: 'New Installation',
          image: '/lovable-uploads/6ad7f4c2-c53b-49d4-adea-eff2b4164744.png'
        },
        {
          label: 'Repair',
          value: 'Repair',
          image: '/lovable-uploads/b3f8fde4-3ae2-423e-b6c5-8568c0e8d926.png'
        },
        {
          label: 'Resurfacing',
          value: 'Resurfacing',
          image: '/lovable-uploads/2e58061b-6520-4f42-9408-0a9eb76604cc.png'
        },
        {
          label: 'Sealcoating',
          value: 'Sealcoating',
          image: '/lovable-uploads/03157bbd-01a1-4722-a0b6-04dc8b7d0270.png'
        }
      ],
      required: true,
    },
    {
      id: 'area',
      text: 'What area needs paving services?',
      type: 'radio',
      options: ['Roads', 'Parking Lot', 'Driveways', 'Sidewalks', 'Other'],
      required: true,
    },
    {
      id: 'squareFootage',
      text: 'Approximate square footage of the area',
      type: 'number',
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
      text: 'Please provide any additional details about the asphalt/paving needs:',
      type: 'textarea',
      required: false,
    }
  ]
};
