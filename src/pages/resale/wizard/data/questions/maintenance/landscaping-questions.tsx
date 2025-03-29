
import { ProjectTypeQuestions } from '../../../types';

export const LANDSCAPING_QUESTIONS: ProjectTypeQuestions = {
  landscaping: [
    {
      id: 'serviceType',
      text: 'What landscaping service is needed?',
      type: 'radio',
      options: ['Design', 'Installation', 'Maintenance', 'Tree Service', 'Irrigation', 'Pond Service'],
      required: true,
    },
    {
      id: 'pondServiceType',
      text: 'What type of pond service is needed?',
      type: 'radio',
      options: ['Cleaning', 'Repair', 'Installation', 'Maintenance Contract'],
      required: true,
      conditionalShow: (answers) => answers.serviceType === 'Pond Service',
    },
    {
      id: 'pondType',
      text: 'What type of pond do you have?',
      type: 'radio',
      options: [
        {
          label: 'Detention Pond (Dry Pond)',
          value: 'Detention Pond',
          image: '/lovable-uploads/513bd063-fedf-4cdd-8130-e058e514dd6e.png'
        },
        {
          label: 'Retention Pond (Wet Pond)',
          value: 'Retention Pond',
          image: '/lovable-uploads/adff2d0c-6478-4b92-bbf3-bcb4f1f5ae15.png'
        },
        {
          label: 'Decorative Pond',
          value: 'Decorative Pond',
          image: '/lovable-uploads/75230129-3746-4768-9d0c-a4c8ebdb352e.png'
        }
      ],
      required: true,
      conditionalShow: (answers) => answers.serviceType === 'Pond Service',
    },
    {
      id: 'treeServiceType',
      text: 'What type of tree service is needed?',
      type: 'radio',
      options: ['Trimming', 'Removal', 'Planting', 'Stump Grinding', 'Disease Treatment'],
      required: true,
      conditionalShow: (answers) => answers.serviceType === 'Tree Service',
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
      text: 'Please provide details about the landscaping project:',
      type: 'textarea',
      required: true,
    }
  ]
};
