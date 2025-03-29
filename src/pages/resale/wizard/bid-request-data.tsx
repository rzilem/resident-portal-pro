import { 
  Building, Wrench, Wind, Warehouse, Hammer, Fence, 
  Droplets, Lock, Paintbrush, Bug, FileSpreadsheet, 
  TreePine, Tool, HardHat, Construction, Calculator, 
  Dog, Zap, HelpingHand, Trash2, Dumbbell
} from 'lucide-react';
import { ProjectType, ProjectTypeQuestions } from './types';

export const PROJECT_TYPES: ProjectType[] = [
  { 
    id: 'street_repairs', 
    name: 'Street Repairs / Paving / Striping', 
    icon: Construction, 
    description: 'Road maintenance, paving, and line striping services'
  },
  { 
    id: 'stucco', 
    name: 'Stucco', 
    icon: HardHat, 
    description: 'Stucco application, repair, and finishing services'
  },
  { 
    id: 'towing', 
    name: 'Towing', 
    icon: Building, 
    description: 'Vehicle towing and roadside assistance services'
  },
  { 
    id: 'trash_disposal', 
    name: 'Trash Disposal', 
    icon: Trash2, 
    description: 'Waste collection and disposal services'
  },
  { 
    id: 'welder', 
    name: 'Welder', 
    icon: Tool, 
    description: 'Metal welding and fabrication services'
  },
  { 
    id: 'window_washing', 
    name: 'Window Washing', 
    icon: Droplets, 
    description: 'Professional window cleaning services'
  },
  
  { 
    id: 'handyman', 
    name: 'Handyman', 
    icon: Tool, 
    description: 'General repairs and maintenance services'
  },
  { 
    id: 'hvac', 
    name: 'HVAC', 
    icon: Wind, 
    description: 'Heating, ventilation, and air conditioning services'
  },
  { 
    id: 'junk_removal', 
    name: 'Junk / Trash Removal', 
    icon: Trash2, 
    description: 'Removal of unwanted items and waste'
  },
  { 
    id: 'landscaping', 
    name: 'Landscaping', 
    icon: TreePine, 
    description: 'Landscape design, installation, and maintenance'
  },
  { 
    id: 'leak_detection', 
    name: 'Leak Detection', 
    icon: Droplets, 
    description: 'Water leak detection and repair services'
  },
  { 
    id: 'locksmith', 
    name: 'Locksmith', 
    icon: Lock, 
    description: 'Lock installation, repair, and key services'
  },
  { 
    id: 'masonry', 
    name: 'Masonry', 
    icon: Construction, 
    description: 'Stonework, brickwork, and concrete services'
  },
  { 
    id: 'mold_remediation', 
    name: 'Mold Remediation', 
    icon: Bug, 
    description: 'Mold detection and removal services'
  },
  { 
    id: 'painting', 
    name: 'Painting', 
    icon: Paintbrush, 
    description: 'Interior and exterior painting services'
  },
  { 
    id: 'pest_control', 
    name: 'Pest Control', 
    icon: Bug, 
    description: 'Pest management and extermination services'
  },
  { 
    id: 'plumbing', 
    name: 'Plumbing', 
    icon: Wrench, 
    description: 'Plumbing installation, repair, and maintenance'
  },
  { 
    id: 'privacy_gate', 
    name: 'Privacy Gate', 
    icon: Fence, 
    description: 'Gate installation, repair, and access control'
  },
  { 
    id: 'pool_service', 
    name: 'Pool Service / Maintenance', 
    icon: Droplets, 
    description: 'Swimming pool cleaning and maintenance'
  },
  { 
    id: 'power_washing', 
    name: 'Power Washing', 
    icon: Droplets, 
    description: 'Pressure washing services for various surfaces'
  },
  { 
    id: 'pond_servicing', 
    name: 'Pond Servicing', 
    icon: Droplets, 
    description: 'Pond maintenance and cleaning services'
  },
  { 
    id: 'pool_monitoring', 
    name: 'Pool Monitoring', 
    icon: Droplets, 
    description: 'Swimming pool monitoring and management'
  },
  { 
    id: 'reserve_study', 
    name: 'Reserve Study', 
    icon: FileSpreadsheet, 
    description: 'Financial planning for future capital expenditures'
  },
  { 
    id: 'roof_repair', 
    name: 'Roof Repair / Replacement', 
    icon: Warehouse, 
    description: 'Roof repair, replacement, and maintenance'
  },
  { 
    id: 'signs', 
    name: 'Signs', 
    icon: Building, 
    description: 'Sign creation, installation, and maintenance'
  },
  { 
    id: 'sports_courts', 
    name: 'Sports Courts', 
    icon: Building, 
    description: 'Installation and maintenance of sports courts'
  },
  
  { 
    id: 'access_system', 
    name: 'Access System', 
    icon: Lock, 
    description: 'Security and access control systems'
  },
  { 
    id: 'appliance_repair', 
    name: 'Appliance Repair', 
    icon: Tool, 
    description: 'Repair services for household appliances'
  },
  { 
    id: 'arborist', 
    name: 'Arborist', 
    icon: TreePine, 
    description: 'Tree care and maintenance services'
  },
  { 
    id: 'construction', 
    name: 'Construction (Big Projects)', 
    icon: Building, 
    description: 'Large-scale construction and renovation projects'
  },
  { 
    id: 'concrete', 
    name: 'Concrete', 
    icon: Construction, 
    description: 'Concrete installation and repair services'
  },
  { 
    id: 'cpa', 
    name: 'CPA', 
    icon: Calculator, 
    description: 'Certified Public Accountant services'
  },
  { 
    id: 'dog_waste', 
    name: 'Dog Waste', 
    icon: Dog, 
    description: 'Pet waste removal and management services'
  },
  { 
    id: 'electric_work', 
    name: 'Electric Work', 
    icon: Zap, 
    description: 'Electrical installation and repair services'
  },
  { 
    id: 'engineer', 
    name: 'Engineer', 
    icon: HelpingHand, 
    description: 'Engineering consultation and services'
  },
  { 
    id: 'elevator_repair', 
    name: 'Elevator Repair / Servicing', 
    icon: Building, 
    description: 'Elevator maintenance and repair services'
  },
  { 
    id: 'fencing', 
    name: 'Fencing', 
    icon: Fence, 
    description: 'Fence installation, repair, or replacement services'
  },
  { 
    id: 'fire_hydrant', 
    name: 'Fire Hydrant', 
    icon: Droplets, 
    description: 'Fire hydrant inspection and maintenance'
  },
  { 
    id: 'foundation_repair', 
    name: 'Foundation Repair', 
    icon: Building, 
    description: 'Building foundation repair services'
  },
  { 
    id: 'gutter_cleaning', 
    name: 'Gutter Cleaning', 
    icon: Droplets, 
    description: 'Gutter cleaning and maintenance services'
  },
  { 
    id: 'gym_equipment', 
    name: 'Gym Equipment', 
    icon: Dumbbell, 
    description: 'Fitness equipment installation and repair'
  },
  { 
    id: 'other', 
    name: 'Other', 
    icon: HelpingHand, 
    description: 'Other specialized services not listed above'
  }
];

export const PROJECT_QUESTIONS: ProjectTypeQuestions = {
  fencing: [
    {
      id: 'requestType',
      question: 'What is the type of bid request?',
      type: 'radio',
      options: ['Maintenance/Repair', 'Service Contract', 'Construction/New Build'],
      required: true,
    },
    {
      id: 'location',
      question: 'Where is the fence located?',
      type: 'radio',
      options: ['Exterior Community Fence', 'Pool Fence', 'Playground Fence', 'Other'],
      required: true,
    },
    {
      id: 'material',
      question: 'What material should the fence be made of?',
      type: 'radio',
      options: ['Wood', 'Metal', 'Vinyl', 'Chain Link', 'Stone', 'Composite', 'Other'],
      required: true,
    },
    {
      id: 'height',
      question: 'What is the fence height?',
      type: 'radio',
      options: ['4 Feet', '6 Feet', '8 Feet', 'Other'],
      required: true,
    },
    {
      id: 'length',
      question: 'What is the approximate length of the fence (in feet)?',
      type: 'number',
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ],
  hvac: [
    {
      id: 'requestType',
      question: 'What is the type of bid request?',
      type: 'radio',
      options: ['Installation', 'Replacement', 'Repair', 'Maintenance Contract'],
      required: true,
    },
    {
      id: 'systemType',
      question: 'What type of HVAC system is needed?',
      type: 'radio',
      options: ['Central Air', 'Heat Pump', 'Ductless Mini-Split', 'Furnace Only', 'AC Only', 'Other'],
      required: true,
    },
    {
      id: 'capacity',
      question: 'What is the required capacity/size?',
      type: 'radio',
      options: ['Small (< 2 tons)', 'Medium (2-3.5 tons)', 'Large (> 3.5 tons)', 'Unknown/Need Recommendation'],
      required: true,
    },
    {
      id: 'buildingType',
      question: 'What type of building is this for?',
      type: 'radio',
      options: ['Clubhouse', 'Community Center', 'Residential Unit', 'Office', 'Other'],
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ],
  construction: [
    {
      id: 'projectScope',
      question: 'What is the scope of the construction project?',
      type: 'radio',
      options: ['New Building', 'Addition', 'Renovation', 'Repair', 'Infrastructure'],
      required: true,
    },
    {
      id: 'buildingType',
      question: 'What type of building or structure is involved?',
      type: 'radio',
      options: ['Residential', 'Clubhouse', 'Pool', 'Tennis Courts', 'Parking Area', 'Other'],
      required: true,
    },
    {
      id: 'squareFootage',
      question: 'What is the approximate square footage involved?',
      type: 'number',
      required: true,
    },
    {
      id: 'permitRequired',
      question: 'Will permits be required for this project?',
      type: 'radio',
      options: ['Yes', 'No', 'Unknown'],
      required: true,
    },
    {
      id: 'timeframe',
      question: 'What is the preferred timeframe for completion?',
      type: 'radio',
      options: ['Within 30 days', '1-3 months', '3-6 months', '6+ months', 'Flexible'],
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ],
  roofing: [
    {
      id: 'requestType',
      question: 'What is the type of roofing work needed?',
      type: 'radio',
      options: ['New Installation', 'Replacement', 'Repair', 'Inspection'],
      required: true,
    },
    {
      id: 'roofType',
      question: 'What type of roofing material is preferred?',
      type: 'radio',
      options: ['Shingle', 'Metal', 'Tile', 'Flat/Membrane', 'Other'],
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Any additional details or requirements?',
      type: 'text',
      required: false,
    }
  ],
  plumbing: [
    {
      id: 'requestType',
      question: 'What type of plumbing service is needed?',
      type: 'radio',
      options: ['Installation', 'Repair', 'Replacement', 'Maintenance'],
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Please provide details about the plumbing issue or project:',
      type: 'text',
      required: true,
    }
  ],
  landscaping: [
    {
      id: 'serviceType',
      question: 'What landscaping service is needed?',
      type: 'radio',
      options: ['Design', 'Installation', 'Maintenance', 'Tree Service', 'Irrigation'],
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Please provide details about the landscaping project:',
      type: 'text',
      required: true,
    }
  ],
  renovation: [
    {
      id: 'renovationType',
      question: 'What type of renovation is needed?',
      type: 'radio',
      options: ['Interior', 'Exterior', 'Both'],
      required: true,
    },
    {
      id: 'additionalDetails',
      question: 'Please provide details about the renovation project:',
      type: 'text',
      required: true,
    }
  ],
  other: [
    {
      id: 'projectDescription',
      question: 'Please describe the project or service needed:',
      type: 'text',
      required: true,
    },
    {
      id: 'timeline',
      question: 'What is the preferred timeline for this project?',
      type: 'radio',
      options: ['Urgent (within a week)', 'Soon (within a month)', 'Flexible (1-3 months)', 'Long-term (3+ months)'],
      required: true,
    }
  ]
};
