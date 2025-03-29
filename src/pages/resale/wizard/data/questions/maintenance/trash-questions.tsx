
import { ProjectTypeQuestions } from '../../../types';

export const TRASH_QUESTIONS: ProjectTypeQuestions = {
  trash: [
    {
      id: 'serviceType',
      text: 'Type of Trash Disposal needed',
      type: 'radio',
      options: [
        {
          label: 'Individual Home / Unit Service',
          value: 'Individual Home / Unit Service',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/trash/individual-home-service.png'
        },
        {
          label: 'Community Dumpster Service',
          value: 'Community Dumpster Service',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/trash/community-dumpster-service.png'
        }
      ],
      required: true,
    },
    {
      id: 'dumpsterSize',
      text: 'Type of Dumpster Needed',
      type: 'radio',
      options: [
        {
          label: '2 Yard Dumpster',
          value: '2 Yard',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/trash/2yard-dumpster.png'
        },
        {
          label: '4 Yard Dumpster',
          value: '4 Yard',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/trash/4yard-dumpster.png'
        },
        {
          label: '6 Yard Dumpster',
          value: '6 Yard',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/trash/6yard-dumpster.png'
        },
        {
          label: '8 Yard Dumpster',
          value: '8 Yard',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/trash/8yard-dumpster.png'
        }
      ],
      required: true,
      conditionalShow: (answers) => answers.serviceType === 'Community Dumpster Service',
    },
    {
      id: 'pickupService',
      text: 'Type of service needed',
      type: 'radio',
      options: [
        {
          label: 'Dumpster Pick-up Service',
          value: 'Dumpster Pick-up Service',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/trash/dumpster-pickup.png'
        },
        {
          label: 'Per Unit Pick-up Service',
          value: 'Per Unit Pick-up Service',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/trash/per-unit-pickup.png'
        }
      ],
      required: true,
    },
    {
      id: 'pickupFrequency',
      text: 'How often is pickup needed?',
      type: 'radio',
      options: [
        {
          label: 'Twice Weekly',
          value: 'Twice Weekly',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/trash/twice-weekly.png'
        },
        {
          label: 'Weekly',
          value: 'Weekly',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/trash/weekly.png'
        },
        {
          label: 'Bi-Weekly',
          value: 'Bi-Weekly',
          image: 'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/trash/bi-weekly.png'
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
      text: 'Please provide any additional details about the trash service needs:',
      type: 'textarea',
      required: false,
    }
  ]
};
