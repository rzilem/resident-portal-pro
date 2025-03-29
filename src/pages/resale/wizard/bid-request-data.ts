
import { ProjectType, Question } from './types';

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'renovation',
    name: 'Renovation Project',
    description: 'Major renovations, remodeling, or structural changes',
    icon: '🏠'
  },
  {
    id: 'repair',
    name: 'Repair Work',
    description: 'Fixing damaged or non-functioning parts of the property',
    icon: '🔧'
  },
  {
    id: 'maintenance',
    name: 'Regular Maintenance',
    description: 'Scheduled upkeep of property features and systems',
    icon: '🧹'
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    description: 'Outdoor improvements, gardening, and hardscaping',
    icon: '🌳'
  },
  {
    id: 'painting',
    name: 'Painting',
    description: 'Interior or exterior painting projects',
    icon: '🎨'
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    description: 'Installation or repair of water and drainage systems',
    icon: '🚿'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    description: 'Wiring, fixtures, and electrical system work',
    icon: '⚡'
  },
  {
    id: 'hvac',
    name: 'HVAC',
    description: 'Heating, ventilation, and air conditioning',
    icon: '❄️'
  },
  {
    id: 'roofing',
    name: 'Roofing',
    description: 'Roof repair, replacement, or installation',
    icon: '🏠'
  },
  {
    id: 'other',
    name: 'Other Project',
    description: 'Any other type of project not listed above',
    icon: '📋'
  }
];

// Define questions for each project type
export const PROJECT_QUESTIONS: Record<string, Question[]> = {
  'renovation': [
    {
      id: 'renovationScope',
      text: 'What is the scope of your renovation project?',
      type: 'radio',
      options: [
        'Full home renovation',
        'Kitchen renovation',
        'Bathroom renovation',
        'Basement renovation',
        'Room addition',
        'Other (please specify)'
      ]
    },
    {
      id: 'renovationTimeframe',
      text: 'What is your preferred timeframe for completing this project?',
      type: 'radio',
      options: [
        'Within 1 month',
        '1-3 months',
        '3-6 months',
        '6+ months',
        'Flexible/Not sure'
      ]
    },
    {
      id: 'renovationBudget',
      text: 'What is your approximate budget for this project?',
      type: 'radio',
      options: [
        'Under $5,000',
        '$5,000 - $15,000',
        '$15,000 - $30,000',
        '$30,000 - $50,000',
        '$50,000 - $100,000',
        'Over $100,000'
      ]
    }
  ],
  'repair': [
    {
      id: 'repairType',
      text: 'What type of repair work do you need?',
      type: 'radio',
      options: [
        'Structural repair',
        'Water damage repair',
        'Drywall/ceiling repair',
        'Floor repair',
        'Door/window repair',
        'Other (please specify)'
      ]
    },
    {
      id: 'repairUrgency',
      text: 'How urgent is this repair?',
      type: 'radio',
      options: [
        'Emergency (needs immediate attention)',
        'Urgent (within a week)',
        'Standard (within a month)',
        'Low priority (flexible timeframe)'
      ]
    }
  ],
  'maintenance': [
    {
      id: 'maintenanceType',
      text: 'What type of maintenance do you need?',
      type: 'radio',
      options: [
        'General property inspection',
        'Seasonal maintenance',
        'Preventative maintenance',
        'Systems check-up',
        'Other (please specify)'
      ]
    },
    {
      id: 'maintenanceFrequency',
      text: 'How frequently do you need this maintenance?',
      type: 'radio',
      options: [
        'One-time service',
        'Monthly',
        'Quarterly',
        'Bi-annually',
        'Annually'
      ]
    }
  ],
  'landscaping': [
    {
      id: 'landscapingScope',
      text: 'What is the scope of your landscaping project?',
      type: 'radio',
      options: [
        'Full yard redesign',
        'Planting and gardening',
        'Hardscaping (patios, walls, pathways)',
        'Tree service',
        'Lawn care',
        'Irrigation system',
        'Other (please specify)'
      ]
    },
    {
      id: 'landscapingSize',
      text: 'What is the approximate size of the area?',
      type: 'radio',
      options: [
        'Small (under 1,000 sq ft)',
        'Medium (1,000 - 5,000 sq ft)',
        'Large (5,000 - 10,000 sq ft)',
        'Very large (over 10,000 sq ft)'
      ]
    }
  ],
  'painting': [
    {
      id: 'paintingType',
      text: 'What type of painting project do you have?',
      type: 'radio',
      options: [
        'Interior - Full home',
        'Interior - Specific rooms',
        'Exterior - Full home',
        'Exterior - Specific areas',
        'Both interior and exterior'
      ]
    },
    {
      id: 'paintingPrep',
      text: 'What level of preparation is needed?',
      type: 'radio',
      options: [
        'Minimal (clean surfaces, minor repairs)',
        'Moderate (some repairs, sanding, priming)',
        'Extensive (major repairs, stripping old paint)',
        'Not sure'
      ]
    }
  ],
  'plumbing': [
    {
      id: 'plumbingType',
      text: 'What type of plumbing work do you need?',
      type: 'radio',
      options: [
        'Repair (leaks, clogs, etc.)',
        'Installation (fixtures, appliances, etc.)',
        'Replacement (pipes, water heater, etc.)',
        'New construction plumbing',
        'Other (please specify)'
      ]
    },
    {
      id: 'plumbingUrgency',
      text: 'How urgent is this plumbing work?',
      type: 'radio',
      options: [
        'Emergency (active leak, no water)',
        'Urgent (within 24-48 hours)',
        'Standard (within a week)',
        'Flexible timing'
      ]
    }
  ],
  'electrical': [
    {
      id: 'electricalType',
      text: 'What type of electrical work do you need?',
      type: 'radio',
      options: [
        'Repair (outlets, switches, fixtures)',
        'Installation (new fixtures, outlets)',
        'Wiring/rewiring',
        'Panel upgrade/replacement',
        'Other (please specify)'
      ]
    },
    {
      id: 'electricalUrgency',
      text: 'How urgent is this electrical work?',
      type: 'radio',
      options: [
        'Emergency (safety hazard)',
        'Urgent (within 24-48 hours)',
        'Standard (within a week)',
        'Flexible timing'
      ]
    }
  ],
  'hvac': [
    {
      id: 'hvacType',
      text: 'What type of HVAC work do you need?',
      type: 'radio',
      options: [
        'Repair (not working properly)',
        'Maintenance/tune-up',
        'Installation (new system)',
        'Replacement (existing system)',
        'Other (please specify)'
      ]
    },
    {
      id: 'hvacSystem',
      text: 'What type of system do you have?',
      type: 'radio',
      options: [
        'Central air conditioning',
        'Furnace/forced air heating',
        'Heat pump',
        'Boiler/radiator heating',
        'Mini-split/ductless system',
        'Not sure'
      ]
    }
  ],
  'roofing': [
    {
      id: 'roofingType',
      text: 'What type of roofing work do you need?',
      type: 'radio',
      options: [
        'Repair (leaks, damaged areas)',
        'Partial replacement',
        'Full roof replacement',
        'New construction roofing',
        'Inspection/maintenance',
        'Other (please specify)'
      ]
    },
    {
      id: 'roofingMaterial',
      text: 'What roofing material do you have or want?',
      type: 'radio',
      options: [
        'Asphalt shingles',
        'Metal',
        'Tile',
        'Slate',
        'Wood shakes/shingles',
        'Flat/membrane roofing',
        'Not sure'
      ]
    }
  ],
  'other': [
    {
      id: 'otherDescription',
      text: 'Please describe the project you need help with:',
      type: 'textarea'
    },
    {
      id: 'otherTimeframe',
      text: 'What is your preferred timeframe for this project?',
      type: 'radio',
      options: [
        'As soon as possible',
        'Within 1 month',
        '1-3 months',
        'Flexible timing'
      ]
    }
  ]
};
