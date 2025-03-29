
import { 
  Trash2, Dog, Droplets, Calculator,
  HelpingHand, FileSpreadsheet, Building, 
  Lock, Construction
} from 'lucide-react';
import { ProjectType } from '../../types';

export const SERVICE_TYPES: ProjectType[] = [
  { 
    id: 'cpa', 
    name: 'CPA', 
    icon: Calculator, 
    description: 'Certified Public Accountant services',
    imagePath: 'cpa.jpg'
  },
  { 
    id: 'dog_waste', 
    name: 'Dog Waste', 
    icon: Dog, 
    description: 'Pet waste removal and management services',
    imagePath: 'dog-waste.jpg'
  },
  { 
    id: 'engineer', 
    name: 'Engineer', 
    icon: HelpingHand, 
    description: 'Engineering consultation and services',
    imagePath: 'engineer.jpg'
  },
  { 
    id: 'junk_removal', 
    name: 'Junk / Trash Removal', 
    icon: Trash2, 
    description: 'Removal of unwanted items and waste',
    imagePath: 'junk-removal.jpg'
  },
  { 
    id: 'locksmith', 
    name: 'Locksmith', 
    icon: Lock, 
    description: 'Lock installation, repair, and key services',
    imagePath: 'locksmith.jpg'
  },
  { 
    id: 'pool_monitoring', 
    name: 'Pool Monitoring', 
    icon: Droplets, 
    description: 'Swimming pool monitoring and management',
    imagePath: 'pool-monitoring.jpg'
  },
  { 
    id: 'pool_service', 
    name: 'Pool Service / Maintenance', 
    icon: Droplets, 
    description: 'Swimming pool cleaning and maintenance',
    imagePath: 'pool-service.jpg'
  },
  { 
    id: 'reserve_study', 
    name: 'Reserve Study', 
    icon: FileSpreadsheet, 
    description: 'Financial planning for future capital expenditures',
    imagePath: 'reserve-study.jpg'
  },
  { 
    id: 'towing', 
    name: 'Towing', 
    icon: Building, 
    description: 'Vehicle towing and roadside assistance services',
    imagePath: 'towing.jpg'
  },
  { 
    id: 'trash_disposal', 
    name: 'Trash Disposal', 
    icon: Trash2, 
    description: 'Waste collection and disposal services',
    imagePath: 'trash-disposal.jpg'
  },
  { 
    id: 'welder', 
    name: 'Welder', 
    icon: Construction, 
    description: 'Metal welding and fabrication services',
    imagePath: 'welder.jpg'
  },
];
