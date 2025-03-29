
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
      options: [
        {
          label: 'Asphalt Shingles',
          value: 'Asphalt Shingles',
          image: '/public/lovable-uploads/shingle-roof.jpg'
        },
        {
          label: 'TPO',
          value: 'TPO',
          image: '/public/lovable-uploads/tpo-roof.jpg'
        },
        {
          label: 'Metal',
          value: 'Metal',
          image: '/public/lovable-uploads/metal-roof.jpg'
        },
        {
          label: 'Tile Roof',
          value: 'Tile Roof',
          image: '/public/lovable-uploads/tile-roof.jpg'
        }
      ],
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
      text: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ]
};
