
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
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/maintenance-repair.png'
        },
        {
          label: 'Service Contract',
          value: 'Service Contract',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/service-contract.png'
        },
        {
          label: 'Construction/New Build',
          value: 'Construction/New Build',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/construction.png'
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
          image: '/lovable-uploads/581f6654-f38f-470b-b9b4-2f30f640e36e.png'
        },
        {
          label: 'Metal',
          value: 'Metal',
          image: '/lovable-uploads/3df3a221-5e00-49dd-b5c9-dcebe9d0d23f.png'
        },
        {
          label: 'Vinyl',
          value: 'Vinyl',
          image: '/lovable-uploads/d8b42e89-c3e9-4d23-867c-cc2cc43148c1.png'
        },
        {
          label: 'Chain Link',
          value: 'Chain Link',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/chain-link.png'
        },
        {
          label: 'Stone',
          value: 'Stone',
          image: '/lovable-uploads/7bd5e63f-f122-42d7-ac91-05f34b1882e6.png'
        },
        {
          label: 'Horizontal Wood',
          value: 'Horizontal Wood',
          image: '/lovable-uploads/dc0928e4-9e80-4e37-a162-dfb57ceb7278.png'
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
