
import { ProjectTypeQuestions } from '../../../types';

export const TRASH_QUESTIONS: ProjectTypeQuestions = {
  trash: [
    {
      id: 'serviceType',
      text: 'Type of Trash Disposal needed',
      type: 'radio',
      options: ['Individual Home / Unit Service', 'Community Dumpster Service'],
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
          image: '/public/lovable-uploads/2yard-dumpster.jpg'
        },
        {
          label: '4 Yard Dumpster',
          value: '4 Yard',
          image: '/public/lovable-uploads/4yard-dumpster.jpg'
        },
        {
          label: '6 Yard Dumpster',
          value: '6 Yard',
          image: '/public/lovable-uploads/6yard-dumpster.jpg'
        },
        {
          label: '8 Yard Dumpster',
          value: '8 Yard',
          image: '/public/lovable-uploads/8yard-dumpster.jpg'
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
          image: '/public/lovable-uploads/dumpster-pickup.jpg'
        },
        {
          label: 'Per Unit Pick-up Service',
          value: 'Per Unit Pick-up Service',
          image: '/public/lovable-uploads/unit-pickup.jpg'
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
