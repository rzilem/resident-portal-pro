
import { ProjectTypeQuestions } from '../../../types';

export const MISC_QUESTIONS: ProjectTypeQuestions = {
  other: [
    {
      id: 'projectDescription',
      text: 'Please describe the project or service needed:',
      type: 'text',
      required: true,
    },
    {
      id: 'timeline',
      text: 'What is the preferred timeline for this project?',
      type: 'radio',
      options: ['Urgent (within a week)', 'Soon (within a month)', 'Flexible (1-3 months)', 'Long-term (3+ months)'],
      required: true,
    }
  ]
};
