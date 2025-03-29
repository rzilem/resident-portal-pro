
import { ProjectTypeQuestions } from '../../../types';

export const PLUMBING_QUESTIONS: ProjectTypeQuestions = {
  plumbing: [
    {
      id: 'requestType',
      text: 'What type of plumbing service is needed?',
      type: 'radio',
      options: ['Installation', 'Repair', 'Replacement', 'Maintenance', 'Leak Detection'],
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
      id: 'hasTowingProvider',
      text: 'Does the Association currently have a towing provider?',
      type: 'radio',
      options: ['Yes', 'No'],
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
      text: 'Please provide details about the plumbing issue or project:',
      type: 'text',
      required: true,
    }
  ]
};
