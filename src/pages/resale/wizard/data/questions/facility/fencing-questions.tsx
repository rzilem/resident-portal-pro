
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
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/wood.png'
        },
        {
          label: 'Metal',
          value: 'Metal',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/metal.png'
        },
        {
          label: 'Vinyl',
          value: 'Vinyl',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/vinyl.png'
        },
        {
          label: 'Chain Link',
          value: 'Chain Link',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/chain-link.png'
        },
        {
          label: 'Stone',
          value: 'Stone',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/stone.png'
        },
        {
          label: 'Horizontal Wood',
          value: 'Horizontal Wood',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/horizontal-wood.png'
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
