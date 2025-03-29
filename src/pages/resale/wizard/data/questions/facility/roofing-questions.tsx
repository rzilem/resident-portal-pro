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
          image: '/lovable-uploads/1e1bc4f0-e720-43f0-8031-e93fc7826688.png'
        },
        {
          label: 'Metal Roofing',
          value: 'Metal Roofing',
          image: '/lovable-uploads/7e36618e-603b-49e8-833d-cb2cda0dfdbc.png'
        },
        {
          label: 'Tile Roof',
          value: 'Tile Roof',
          image: '/lovable-uploads/b0080889-9fea-433e-b738-65d24b8c257d.png'
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
