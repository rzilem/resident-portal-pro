
import { 
  Brush, TreePine, Wrench, Droplets, 
  Lock, HelpingHand
} from 'lucide-react';
import { ProjectType } from '../../types';

export const MAINTENANCE_TYPES: ProjectType[] = [
  { 
    id: 'arborist', 
    name: 'Arborist', 
    icon: TreePine, 
    description: 'Tree care and maintenance services'
  },
  { 
    id: 'fitness_equipment', 
    name: 'Fitness Equipment', 
    icon: Wrench, 
    description: 'Fitness equipment repair and maintenance'
  },
  { 
    id: 'gutter_cleaning', 
    name: 'Gutter Cleaning', 
    icon: Droplets, 
    description: 'Gutter cleaning and maintenance services'
  },
  { 
    id: 'handyman', 
    name: 'Handyman', 
    icon: Wrench, 
    description: 'General repairs and maintenance services'
  },
  { 
    id: 'landscaping', 
    name: 'Landscaping', 
    icon: TreePine, 
    description: 'Outdoor improvements, gardening, and hardscaping'
  },
  { 
    id: 'maintenance', 
    name: 'Regular Maintenance', 
    icon: Brush, 
    description: 'Scheduled upkeep of property features and systems'
  },
  { 
    id: 'other', 
    name: 'Other', 
    icon: HelpingHand, 
    description: 'Other specialized services not listed above'
  },
  { 
    id: 'pond_servicing', 
    name: 'Pond Servicing', 
    icon: Droplets, 
    description: 'Pond maintenance and cleaning services'
  },
  { 
    id: 'pressure_washing', 
    name: 'Power Washing', 
    icon: Droplets, 
    description: 'Pressure washing services for various surfaces'
  },
  { 
    id: 'trash', 
    name: 'Trash Services', 
    icon: HelpingHand, 
    description: 'Waste management and disposal services'
  },
  { 
    id: 'windows', 
    name: 'Window Services', 
    icon: Droplets, 
    description: 'Window cleaning, repair, and installation services'
  },
];
