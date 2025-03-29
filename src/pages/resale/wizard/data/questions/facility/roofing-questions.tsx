
import { ProjectTypeQuestions } from '../../../types';

export const ROOFING_QUESTIONS: ProjectTypeQuestions = {
  roofing: [
    {
      id: 'requestType',
      text: 'What is the type of roofing work needed?',
      type: 'radio',
      options: ['New Installation', 'Replacement', 'Repair', 'Inspection'],
      required: true,
    },
    {
      id: 'roofType',
      text: 'What type of roofing material is preferred?',
      type: 'radio',
      options: ['Shingle', 'Metal', 'Tile', 'Flat/Membrane', 'Other'],
      required: true,
    },
    {
      id: 'additionalDetails',
      text: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ]
};
