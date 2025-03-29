
import { 
  Trash2, Dog, Droplets, Calculator,
  HelpingHand, FileSpreadsheet, Building, 
  Lock, Construction
} from 'lucide-react';
import { ProjectType } from '../../types';

export const SERVICE_TYPES: ProjectType[] = [
  { 
    id: 'pool_service', 
    name: 'Pool Service / Maintenance', 
    icon: Droplets, 
    description: 'Swimming pool cleaning and maintenance'
  },
  { 
    id: 'pool_monitoring', 
    name: 'Pool Monitoring', 
    icon: Droplets, 
    description: 'Swimming pool monitoring and management'
  },
  { 
    id: 'trash_disposal', 
    name: 'Trash Disposal', 
    icon: Trash2, 
    description: 'Waste collection and disposal services'
  },
  { 
    id: 'junk_removal', 
    name: 'Junk / Trash Removal', 
    icon: Trash2, 
    description: 'Removal of unwanted items and waste'
  },
  { 
    id: 'dog_waste', 
    name: 'Dog Waste', 
    icon: Dog, 
    description: 'Pet waste removal and management services'
  },
  { 
    id: 'locksmith', 
    name: 'Locksmith', 
    icon: Lock, 
    description: 'Lock installation, repair, and key services'
  },
  { 
    id: 'towing', 
    name: 'Towing', 
    icon: Building, 
    description: 'Vehicle towing and roadside assistance services'
  },
  { 
    id: 'welder', 
    name: 'Welder', 
    icon: Construction, 
    description: 'Metal welding and fabrication services'
  },
  { 
    id: 'cpa', 
    name: 'CPA', 
    icon: Calculator, 
    description: 'Certified Public Accountant services'
  },
  { 
    id: 'engineer', 
    name: 'Engineer', 
    icon: HelpingHand, 
    description: 'Engineering consultation and services'
  },
  { 
    id: 'reserve_study', 
    name: 'Reserve Study', 
    icon: FileSpreadsheet, 
    description: 'Financial planning for future capital expenditures'
  },
];
