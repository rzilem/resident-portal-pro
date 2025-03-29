
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
