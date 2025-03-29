
import { ProjectTypeQuestions } from '../../../types';

export const PLUMBING_QUESTIONS: ProjectTypeQuestions = {
  plumbing: [
    {
      id: 'requestType',
      text: 'What type of plumbing service is needed?',
      type: 'radio',
      options: ['Installation', 'Repair', 'Replacement', 'Maintenance'],
      required: true,
    },
    {
      id: 'additionalDetails',
      text: 'Please provide details about the plumbing issue or project:',
      type: 'text',
      required: true,
    }
  ]
};
