import { ProjectTypeQuestions } from '../../../types';

export const FENCING_QUESTIONS: ProjectTypeQuestions = {
  fencing: [
    {
      id: 'requestType',
      text: 'What is the type of bid request?',
      type: 'radio',
      options: [
        {
          label: 'Maintenance/Repair',
          value: 'Maintenance/Repair',
          image: '/lovable-uploads/b3f8fde4-3ae2-423e-b6c5-8568c0e8d926.png'
        },
        {
          label: 'Service Contract',
          value: 'Service Contract',
          image: '/lovable-uploads/2e58061b-6520-4f42-9408-0a9eb76604cc.png'
        },
        {
          label: 'Construction/New Build',
          value: 'Construction/New Build',
          image: '/lovable-uploads/6ad7f4c2-c53b-49d4-adea-eff2b4164744.png'
        }
      ],
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
          image: '/lovable-uploads/a07c1912-e436-4219-bda7-c71fbc466bcb.png'
        },
        {
          label: 'Metal',
          value: 'Metal',
          image: '/lovable-uploads/9b6ef5f1-f45d-4e64-80d1-06a58c70f880.png'
        },
        {
          label: 'Vinyl',
          value: 'Vinyl',
          image: '/lovable-uploads/a6174737-9906-4331-8945-b8e9e885a0f4.png'
        },
        {
          label: 'Chain Link',
          value: 'Chain Link',
          image: '/lovable-uploads/a0123dbe-64da-4bbe-93c6-09b4be5ec811.png'
        },
        {
          label: 'Stone',
          value: 'Stone',
          image: '/lovable-uploads/1a96ebe7-836c-4166-beb2-ce6162083f29.png'
        },
        {
          label: 'Horizontal Wood',
          value: 'Horizontal Wood',
          image: '/lovable-uploads/ed34858c-12d0-4a55-a122-bd986098b60d.png'
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
      type: 'textarea',
      required: false,
    }
  ]
};
