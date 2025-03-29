
import { ProjectTypeQuestions } from '../../../types';

export const PRESSURE_WASHING_QUESTIONS: ProjectTypeQuestions = {
  pressureWashing: [
    {
      id: 'serviceArea',
      text: 'What areas need pressure washing?',
      type: 'radio',
      options: [
        {
          label: 'Sidewalks',
          value: 'Sidewalks',
          image: '/lovable-uploads/2e58061b-6520-4f42-9408-0a9eb76604cc.png'
        },
        {
          label: 'Building Exterior',
          value: 'Building Exterior',
          image: '/lovable-uploads/b3f8fde4-3ae2-423e-b6c5-8568c0e8d926.png'
        },
        {
          label: 'Parking Areas',
          value: 'Parking Areas',
          image: '/lovable-uploads/6ad7f4c2-c53b-49d4-adea-eff2b4164744.png'
        },
        {
          label: 'Pool Deck',
          value: 'Pool Deck',
          image: '/lovable-uploads/03157bbd-01a1-4722-a0b6-04dc8b7d0270.png'
        },
        {
          label: 'Multiple Areas',
          value: 'Multiple Areas',
          image: '/lovable-uploads/2e58061b-6520-4f42-9408-0a9eb76604cc.png'
        }
      ],
      required: true,
    },
    {
      id: 'frequency',
      text: 'How frequently should the service be performed?',
      type: 'radio',
      options: ['One-time service', 'Monthly', 'Quarterly', 'Annually', 'Other'],
      required: true,
    },
    {
      id: 'squareFootage',
      text: 'Approximate square footage to be cleaned',
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
      text: 'Please provide any additional details about the pressure washing needs:',
      type: 'textarea',
      required: false,
    }
  ]
};
