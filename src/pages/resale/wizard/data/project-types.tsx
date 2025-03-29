
import { 
  Building, Wrench, Wind, Warehouse, Hammer, Fence, 
  Droplets, Lock, Paintbrush, Bug, FileSpreadsheet, 
  TreePine, HardHat, Construction, Calculator, 
  Dog, Zap, HelpingHand, Trash2, Dumbbell, Home, Brush
} from 'lucide-react';
import { ProjectType } from '../types';

export const PROJECT_TYPES: ProjectType[] = [
  { 
    id: 'renovation', 
    name: 'Renovation Project', 
    icon: Home, 
    description: 'Major renovations, remodeling, or structural changes'
  },
  { 
    id: 'repair', 
    name: 'Repair Work', 
    icon: Wrench, 
    description: 'Fixing damaged or non-functioning parts of the property'
  },
  { 
    id: 'maintenance', 
    name: 'Regular Maintenance', 
    icon: Brush, 
    description: 'Scheduled upkeep of property features and systems'
  },
  { 
    id: 'landscaping', 
    name: 'Landscaping', 
    icon: TreePine, 
    description: 'Outdoor improvements, gardening, and hardscaping'
  },
  { 
    id: 'painting', 
    name: 'Painting', 
    icon: Paintbrush, 
    description: 'Interior or exterior painting projects'
  },
  { 
    id: 'plumbing', 
    name: 'Plumbing', 
    icon: Droplets, 
    description: 'Installation or repair of water and drainage systems'
  },
  { 
    id: 'electrical', 
    name: 'Electrical', 
    icon: Zap, 
    description: 'Wiring, fixtures, and electrical system work'
  },
  { 
    id: 'hvac', 
    name: 'HVAC', 
    icon: Wind, 
    description: 'Heating, ventilation, and air conditioning'
  },
  { 
    id: 'roofing', 
    name: 'Roofing', 
    icon: Home, 
    description: 'Roof repair, replacement, or installation'
  },
  { 
    id: 'other', 
    name: 'Other Project', 
    icon: FileSpreadsheet, 
    description: 'Any other type of project not listed above'
  },
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
    icon: Construction, 
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
    icon: Wrench, 
    description: 'General repairs and maintenance services'
  },
  { 
    id: 'junk_removal', 
    name: 'Junk / Trash Removal', 
    icon: Trash2, 
    description: 'Removal of unwanted items and waste'
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
    id: 'pest_control', 
    name: 'Pest Control', 
    icon: Bug, 
    description: 'Pest management and extermination services'
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
    icon: Wrench, 
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
