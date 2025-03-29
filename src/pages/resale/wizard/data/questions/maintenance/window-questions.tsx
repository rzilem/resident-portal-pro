
import { ProjectTypeQuestions } from '../../../types';

export const WINDOW_QUESTIONS: ProjectTypeQuestions = {
  windows: [
    {
      id: 'windowWorkType',
      text: 'Type of Window Work',
      type: 'radio',
      options: [
        {
          label: 'Cleaning',
          value: 'Cleaning',
          image: '/lovable-uploads/2e58061b-6520-4f42-9408-0a9eb76604cc.png'
        },
        {
          label: 'Install',
          value: 'Install',
          image: '/lovable-uploads/6ad7f4c2-c53b-49d4-adea-eff2b4164744.png'
        },
        {
          label: 'Screens',
          value: 'Screens',
          image: '/lovable-uploads/dfa8f7e3-fc84-4a34-9807-25d6f0bd10ca.png'
        },
        {
          label: 'Repair',
          value: 'Repair',
          image: '/lovable-uploads/b3f8fde4-3ae2-423e-b6c5-8568c0e8d926.png'
        }
      ],
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
      text: 'Please provide any additional details about the window project:',
      type: 'textarea',
      required: false,
    }
  ]
};
