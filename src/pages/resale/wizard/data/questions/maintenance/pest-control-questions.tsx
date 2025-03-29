
import { ProjectTypeQuestions } from '../../../types';

export const PEST_CONTROL_QUESTIONS: ProjectTypeQuestions = {
  pestControl: [
    {
      id: 'serviceType',
      text: 'What type of pest control service is needed?',
      type: 'radio',
      options: [
        {
          label: 'General Treatment',
          value: 'General Treatment',
          image: '/lovable-uploads/03157bbd-01a1-4722-a0b6-04dc8b7d0270.png'
        },
        {
          label: 'Specific Pest Treatment',
          value: 'Specific Pest Treatment',
          image: '/lovable-uploads/2e58061b-6520-4f42-9408-0a9eb76604cc.png'
        },
        {
          label: 'Prevention/Maintenance',
          value: 'Prevention/Maintenance',
          image: '/lovable-uploads/b3f8fde4-3ae2-423e-b6c5-8568c0e8d926.png'
        },
        {
          label: 'Mold Remediation',
          value: 'Mold Remediation',
          image: '/lovable-uploads/581a4026-ef10-4c0b-80e8-9e2bb3f3e034.png'
        }
      ],
      required: true,
    },
    {
      id: 'pestType',
      text: 'What type of pest needs to be addressed?',
      type: 'radio',
      options: [
        {
          label: 'Insects (ants, roaches, etc.)',
          value: 'Insects',
          image: '/lovable-uploads/03157bbd-01a1-4722-a0b6-04dc8b7d0270.png'
        },
        {
          label: 'Rodents (mice, rats)',
          value: 'Rodents',
          image: '/lovable-uploads/2e58061b-6520-4f42-9408-0a9eb76604cc.png'
        },
        {
          label: 'Termites',
          value: 'Termites',
          image: '/lovable-uploads/b3f8fde4-3ae2-423e-b6c5-8568c0e8d926.png'
        },
        {
          label: 'Other/Multiple',
          value: 'Other/Multiple',
          image: '/lovable-uploads/6ad7f4c2-c53b-49d4-adea-eff2b4164744.png'
        }
      ],
      required: true,
      conditionalShow: (answers) => answers.serviceType === 'Specific Pest Treatment',
    },
    {
      id: 'frequency',
      text: 'How frequently should the service be performed?',
      type: 'radio',
      options: ['One-time treatment', 'Monthly', 'Quarterly', 'Annually'],
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
      text: 'Please provide any additional details about the pest control needs:',
      type: 'textarea',
      required: false,
    }
  ]
};
