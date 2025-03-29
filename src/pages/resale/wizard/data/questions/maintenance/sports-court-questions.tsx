
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
          image: '/lovable-uploads/9b43960a-a200-4b8e-ab8d-d8d426eda4e0.png'
        },
        {
          label: 'Re-paint Existing',
          value: 'Re-paint Existing',
          image: '/lovable-uploads/1e3b1251-6ed5-49ec-8066-72ade13d816f.png'
        },
        {
          label: 'Repair Surface',
          value: 'Repair Surface',
          image: '/lovable-uploads/2468b32f-5627-45fd-abf3-9b7b00444003.png'
        },
        {
          label: 'Add Equipment',
          value: 'Add Equipment',
          image: '/lovable-uploads/4210bfbe-69f1-4ffc-8a52-4bff55f3dd71.png'
        }
      ],
      required: true,
    },
    {
      id: 'courtType',
      text: 'Type of court',
      type: 'radio',
      options: [
        {
          label: 'Tennis',
          value: 'Tennis',
          image: '/lovable-uploads/d7f25017-e181-432e-8889-9354a6679147.png'
        },
        {
          label: 'Basketball',
          value: 'Basketball',
          image: '/lovable-uploads/75230129-3746-4768-9d0c-a4c8ebdb352e.png'
        },
        {
          label: 'Pickleball',
          value: 'Pickleball',
          image: '/lovable-uploads/1e3b1251-6ed5-49ec-8066-72ade13d816f.png'
        },
        {
          label: 'Multi-use',
          value: 'Multi-use',
          image: '/lovable-uploads/9b43960a-a200-4b8e-ab8d-d8d426eda4e0.png'
        },
        {
          label: 'Other',
          value: 'Other',
          image: '/lovable-uploads/2468b32f-5627-45fd-abf3-9b7b00444003.png'
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
      text: 'Please provide any additional details about the sports court project:',
      type: 'textarea',
      required: false,
    }
  ]
};
