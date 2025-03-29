
import { ProjectTypeQuestions } from '../../../types';

export const ELECTRICAL_QUESTIONS: ProjectTypeQuestions = {
  electrical: [
    {
      id: 'serviceType',
      text: 'What type of electrical service is needed?',
      type: 'radio',
      options: [
        {
          label: 'Panel Replacement/Upgrade',
          value: 'Panel Replacement/Upgrade',
          image: '/lovable-uploads/513863fd-2e15-41e3-86dd-ea8ad76ae967.png'
        },
        {
          label: 'New Outlet/Switch Installation',
          value: 'New Outlet/Switch Installation',
          image: '/lovable-uploads/6f111c4e-4089-4314-95ae-dfe51acb7ab7.png'
        },
        {
          label: 'Wire Repair/Replacement',
          value: 'Wire Repair/Replacement',
          image: '/lovable-uploads/d01083ea-a856-4f04-855e-80eaaf841d5f.png'
        },
        {
          label: 'Lighting Installation',
          value: 'Lighting Installation',
          image: '/lovable-uploads/a2b511bb-0ca9-4feb-becd-0c4d11515547.png'
        },
        {
          label: 'Troubleshooting/Repairs',
          value: 'Troubleshooting/Repairs',
          image: '/lovable-uploads/23f89ded-1af9-4c48-a17e-bd98de501ab2.png'
        }
      ],
      required: true,
    },
    {
      id: 'lightingType',
      text: 'What type of lighting is needed?',
      type: 'radio',
      options: [
        {
          label: 'Wall Sconce/Light Fixture',
          value: 'Wall Sconce/Light Fixture',
          image: '/lovable-uploads/513bd063-fedf-4cdd-8130-e058e514dd6e.png'
        },
        {
          label: 'Ceiling Light/Fan',
          value: 'Ceiling Light/Fan',
          image: '/lovable-uploads/adff2d0c-6478-4b92-bbf3-bcb4f1f5ae15.png'
        },
        {
          label: 'Outdoor Lighting',
          value: 'Outdoor Lighting',
          image: '/lovable-uploads/a2b511bb-0ca9-4feb-becd-0c4d11515547.png'
        }
      ],
      required: true,
      conditionalShow: (answers) => answers.serviceType === 'Lighting Installation',
    },
    {
      id: 'urgency',
      text: 'What is the urgency level?',
      type: 'radio',
      options: ['Emergency (24-48 hours)', 'Urgent (1 week)', 'Standard (2-3 weeks)', 'Flexible (1 month+)'],
      required: true,
    },
    {
      id: 'scopeDetails',
      text: 'Please provide detailed scope of work',
      type: 'textarea',
      required: true,
    },
    {
      id: 'permitRequired',
      text: 'Will a permit be required?',
      type: 'radio',
      options: ['Yes', 'No', 'Not Sure'],
      required: false,
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
    }
  ],
  electric_work: [
    {
      id: 'serviceType',
      text: 'What type of electrical service is needed?',
      type: 'radio',
      options: [
        {
          label: 'Panel Replacement/Upgrade',
          value: 'Panel Replacement/Upgrade',
          image: '/lovable-uploads/513863fd-2e15-41e3-86dd-ea8ad76ae967.png'
        },
        {
          label: 'New Outlet/Switch Installation',
          value: 'New Outlet/Switch Installation',
          image: '/lovable-uploads/6f111c4e-4089-4314-95ae-dfe51acb7ab7.png'
        },
        {
          label: 'Wire Repair/Replacement',
          value: 'Wire Repair/Replacement',
          image: '/lovable-uploads/d01083ea-a856-4f04-855e-80eaaf841d5f.png'
        },
        {
          label: 'Lighting Installation',
          value: 'Lighting Installation',
          image: '/lovable-uploads/a2b511bb-0ca9-4feb-becd-0c4d11515547.png'
        },
        {
          label: 'Troubleshooting/Repairs',
          value: 'Troubleshooting/Repairs',
          image: '/lovable-uploads/23f89ded-1af9-4c48-a17e-bd98de501ab2.png'
        }
      ],
      required: true,
    },
    {
      id: 'urgency',
      text: 'What is the urgency level?',
      type: 'radio',
      options: ['Emergency (24-48 hours)', 'Urgent (1 week)', 'Standard (2-3 weeks)', 'Flexible (1 month+)'],
      required: true,
    },
    {
      id: 'scopeDetails',
      text: 'Please provide detailed scope of work',
      type: 'textarea',
      required: true,
    },
    {
      id: 'permitRequired',
      text: 'Will a permit be required?',
      type: 'radio',
      options: ['Yes', 'No', 'Not Sure'],
      required: false,
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
    }
  ]
};
