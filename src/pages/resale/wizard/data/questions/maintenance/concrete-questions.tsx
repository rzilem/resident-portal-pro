
import { ProjectTypeQuestions } from '../../../types';

export const CONCRETE_QUESTIONS: ProjectTypeQuestions = {
  concrete: [
    {
      id: 'serviceType',
      text: 'What type of concrete service is needed?',
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
          label: 'Replacement',
          value: 'Replacement',
          image: '/lovable-uploads/2e58061b-6520-4f42-9408-0a9eb76604cc.png'
        },
        {
          label: 'Staining/Finishing',
          value: 'Staining/Finishing',
          image: '/lovable-uploads/03157bbd-01a1-4722-a0b6-04dc8b7d0270.png'
        }
      ],
      required: true,
    },
    {
      id: 'area',
      text: 'What area needs concrete services?',
      type: 'radio',
      options: ['Sidewalks', 'Driveways', 'Foundations', 'Pool Deck', 'Retaining Walls', 'Other'],
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
      text: 'Please provide any additional details about the concrete service needs:',
      type: 'textarea',
      required: false,
    }
  ]
};
