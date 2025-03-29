
import { ProjectTypeQuestions } from '../../../types';

export const RENOVATION_QUESTIONS: ProjectTypeQuestions = {
  renovation: [
    {
      id: 'renovationType',
      text: 'What type of renovation is needed?',
      type: 'radio',
      options: ['Interior', 'Exterior', 'Both'],
      required: true,
    },
    {
      id: 'additionalDetails',
      text: 'Please provide details about the renovation project:',
      type: 'text',
      required: true,
    }
  ]
};
