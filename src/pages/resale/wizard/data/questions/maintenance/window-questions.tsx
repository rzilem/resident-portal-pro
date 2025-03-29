
import { ProjectTypeQuestions } from '../../../types';

export const WINDOW_QUESTIONS: ProjectTypeQuestions = {
  windows: [
    {
      id: 'windowWorkType',
      text: 'Type of Window Work',
      type: 'radio',
      options: [
        {
          label: 'Cleaning',
          value: 'Cleaning',
          image: '/lovable-uploads/1e3b1251-6ed5-49ec-8066-72ade13d816f.png'
        },
        {
          label: 'Install',
          value: 'Install',
          image: '/lovable-uploads/9b43960a-a200-4b8e-ab8d-d8d426eda4e0.png'
        },
        {
          label: 'Screens',
          value: 'Screens',
          image: '/lovable-uploads/2468b32f-5627-45fd-abf3-9b7b00444003.png'
        },
        {
          label: 'Repair',
          value: 'Repair',
          image: '/lovable-uploads/4210bfbe-69f1-4ffc-8a52-4bff55f3dd71.png'
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
      text: 'Please provide any additional details about the window project:',
      type: 'textarea',
      required: false,
    }
  ]
};
