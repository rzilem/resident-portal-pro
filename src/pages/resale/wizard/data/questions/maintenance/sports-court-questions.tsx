
import { ProjectTypeQuestions } from '../../../types';

export const SPORTS_COURT_QUESTIONS: ProjectTypeQuestions = {
  sportsCourt: [
    {
      id: 'courtServiceType',
      text: 'Sports Court service needed',
      type: 'radio',
      options: [
        {
          label: 'Build new Sports Court',
          value: 'Build new Sports Court',
          image: '/public/lovable-uploads/new-court.jpg'
        },
        {
          label: 'Re-paint Existing',
          value: 'Re-paint Existing',
          image: '/public/lovable-uploads/repaint-court.jpg'
        }
      ],
      required: true,
    },
    {
      id: 'courtType',
      text: 'Type of court',
      type: 'radio',
      options: ['Tennis', 'Basketball', 'Pickleball', 'Multi-use', 'Other'],
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
      text: 'Please provide any additional details about the sports court project:',
      type: 'textarea',
      required: false,
    }
  ]
};
