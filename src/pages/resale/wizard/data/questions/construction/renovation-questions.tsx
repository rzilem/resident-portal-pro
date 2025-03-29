
import { ProjectTypeQuestions } from '../../../types';

export const RENOVATION_QUESTIONS: ProjectTypeQuestions = {
  renovation: [
    {
      id: 'renovationType',
      text: 'What type of renovation is needed?',
      type: 'radio',
      options: [
        {
          label: 'Interior',
          value: 'Interior',
          image: '/lovable-uploads/1e3b1251-6ed5-49ec-8066-72ade13d816f.png'
        },
        {
          label: 'Exterior',
          value: 'Exterior',
          image: '/lovable-uploads/9b43960a-a200-4b8e-ab8d-d8d426eda4e0.png'
        },
        {
          label: 'Both',
          value: 'Both',
          image: '/lovable-uploads/2468b32f-5627-45fd-abf3-9b7b00444003.png'
        }
      ],
      required: true,
    },
    {
      id: 'facilityType',
      text: 'What type of facility is being renovated?',
      type: 'radio',
      options: [
        {
          label: 'Clubhouse',
          value: 'Clubhouse',
          image: '/lovable-uploads/d7f25017-e181-432e-8889-9354a6679147.png'
        },
        {
          label: 'Pool Area',
          value: 'Pool Area',
          image: '/lovable-uploads/4210bfbe-69f1-4ffc-8a52-4bff55f3dd71.png'
        },
        {
          label: 'Fitness Center',
          value: 'Fitness Center',
          image: '/lovable-uploads/75230129-3746-4768-9d0c-a4c8ebdb352e.png'
        },
        {
          label: 'Common Areas',
          value: 'Common Areas',
          image: '/lovable-uploads/1e3b1251-6ed5-49ec-8066-72ade13d816f.png'
        },
        {
          label: 'Other',
          value: 'Other',
          image: '/lovable-uploads/9b43960a-a200-4b8e-ab8d-d8d426eda4e0.png'
        }
      ],
      required: true,
    },
    {
      id: 'renovationScope',
      text: 'What is the scope of renovation?',
      type: 'radio',
      options: [
        {
          label: 'Minor (Cosmetic)',
          value: 'Minor (Cosmetic)',
          image: '/lovable-uploads/2468b32f-5627-45fd-abf3-9b7b00444003.png'
        },
        {
          label: 'Moderate (Some Structural)',
          value: 'Moderate (Some Structural)',
          image: '/lovable-uploads/d7f25017-e181-432e-8889-9354a6679147.png'
        },
        {
          label: 'Major (Complete Overhaul)',
          value: 'Major (Complete Overhaul)',
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
      text: 'Please provide details about the renovation project:',
      type: 'textarea',
      required: true,
    }
  ]
};
