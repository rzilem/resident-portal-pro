
import { ProjectTypeQuestions } from '../../types';

export const MAINTENANCE_QUESTIONS: ProjectTypeQuestions = {
  landscaping: [
    {
      id: 'serviceType',
      text: 'What landscaping service is needed?',
      type: 'radio',
      options: ['Design', 'Installation', 'Maintenance', 'Tree Service', 'Irrigation'],
      required: true,
    },
    {
      id: 'additionalDetails',
      text: 'Please provide details about the landscaping project:',
      type: 'text',
      required: true,
    }
  ],
};
