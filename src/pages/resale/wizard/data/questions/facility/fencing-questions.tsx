
import { ProjectTypeQuestions } from '../../../types';

export const FENCING_QUESTIONS: ProjectTypeQuestions = {
  fencing: [
    {
      id: 'requestType',
      text: 'What is the type of bid request?',
      type: 'radio',
      options: ['Maintenance/Repair', 'Service Contract', 'Construction/New Build'],
      required: true,
    },
    {
      id: 'location',
      text: 'Where is the fence located?',
      type: 'radio',
      options: ['Exterior Community Fence', 'Pool Fence', 'Playground Fence', 'Other'],
      required: true,
    },
    {
      id: 'material',
      text: 'What material should the fence be made of?',
      type: 'radio',
      options: [
        {
          label: 'Wood',
          value: 'Wood',
          image: '/lovable-uploads/d7f25017-e181-432e-8889-9354a6679147.png'
        },
        {
          label: 'Metal',
          value: 'Metal',
          image: '/lovable-uploads/1e3b1251-6ed5-49ec-8066-72ade13d816f.png'
        },
        {
          label: 'Vinyl',
          value: 'Vinyl',
          image: '/lovable-uploads/9b43960a-a200-4b8e-ab8d-d8d426eda4e0.png'
        },
        {
          label: 'Chain Link',
          value: 'Chain Link',
          image: '/lovable-uploads/2468b32f-5627-45fd-abf3-9b7b00444003.png'
        },
        {
          label: 'Stone',
          value: 'Stone',
          image: '/lovable-uploads/4210bfbe-69f1-4ffc-8a52-4bff55f3dd71.png'
        },
        {
          label: 'Composite',
          value: 'Composite',
          image: '/lovable-uploads/75230129-3746-4768-9d0c-a4c8ebdb352e.png'
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
      id: 'height',
      text: 'What is the fence height?',
      type: 'radio',
      options: ['4 Feet', '6 Feet', '8 Feet', 'Other'],
      required: true,
    },
    {
      id: 'length',
      text: 'What is the approximate length of the fence (in feet)?',
      type: 'number',
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
