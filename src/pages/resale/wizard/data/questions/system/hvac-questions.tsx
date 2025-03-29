
import { ProjectTypeQuestions } from '../../../types';

export const HVAC_QUESTIONS: ProjectTypeQuestions = {
  hvac: [
    {
      id: 'requestType',
      text: 'What is the type of bid request?',
      type: 'radio',
      options: [
        {
          label: 'Installation',
          value: 'Installation',
          image: '/lovable-uploads/6ad7f4c2-c53b-49d4-adea-eff2b4164744.png'
        },
        {
          label: 'Replacement',
          value: 'Replacement',
          image: '/lovable-uploads/549fefb9-39cb-4663-9fb3-dcb67f37ff3d.png'
        },
        {
          label: 'Repair',
          value: 'Repair',
          image: '/lovable-uploads/cda1b3c1-7171-4c13-9cbf-d8a7c523aa18.png'
        },
        {
          label: 'Maintenance Contract',
          value: 'Maintenance Contract',
          image: '/lovable-uploads/a4f31575-9935-4c37-ad51-c5a0d8c0783a.png'
        }
      ],
      required: true,
    },
    {
      id: 'systemType',
      text: 'What type of HVAC system is needed?',
      type: 'radio',
      options: ['Central Air', 'Heat Pump', 'Ductless Mini-Split', 'Furnace Only', 'AC Only', 'Other'],
      required: true,
    },
    {
      id: 'capacity',
      text: 'What is the required capacity/size?',
      type: 'radio',
      options: ['Small (< 2 tons)', 'Medium (2-3.5 tons)', 'Large (> 3.5 tons)', 'Unknown/Need Recommendation'],
      required: true,
    },
    {
      id: 'buildingType',
      text: 'What type of building is this for?',
      type: 'radio',
      options: ['Clubhouse', 'Community Center', 'Residential Unit', 'Office', 'Other'],
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
