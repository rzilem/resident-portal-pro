
import { ProjectTypeQuestions } from '../../../types';

export const PLUMBING_QUESTIONS: ProjectTypeQuestions = {
  plumbing: [
    {
      id: 'requestType',
      text: 'What type of plumbing service is needed?',
      type: 'radio',
      options: [
        {
          label: 'Installation',
          value: 'Installation',
          image: '/lovable-uploads/62185c37-403f-45d8-8281-9b68b2c3bcf2.png'
        },
        {
          label: 'Repair',
          value: 'Repair',
          image: '/lovable-uploads/b3f8fde4-3ae2-423e-b6c5-8568c0e8d926.png'
        },
        {
          label: 'Replacement',
          value: 'Replacement',
          image: '/lovable-uploads/03157bbd-01a1-4722-a0b6-04dc8b7d0270.png'
        },
        {
          label: 'Maintenance',
          value: 'Maintenance',
          image: '/lovable-uploads/2e58061b-6520-4f42-9408-0a9eb76604cc.png'
        },
        {
          label: 'Leak Detection',
          value: 'Leak Detection',
          image: '/lovable-uploads/6ad7f4c2-c53b-49d4-adea-eff2b4164744.png'
        }
      ],
      required: true,
    },
    {
      id: 'hasLeakBeenIdentified',
      text: 'Has the leak area been identified?',
      type: 'radio',
      options: ['Yes', 'No'],
      required: true,
      conditionalShow: (answers) => answers.requestType === 'Leak Detection',
    },
    {
      id: 'leakArea',
      text: 'Please explain the approximate leak area(s)',
      type: 'textarea',
      required: true,
      conditionalShow: (answers) => 
        answers.requestType === 'Leak Detection' && 
        answers.hasLeakBeenIdentified === 'Yes',
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
      text: 'Please provide details about the plumbing issue or project:',
      type: 'textarea',
      required: true,
    }
  ]
};
