
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
    description: 'Tree care and maintenance services',
    imagePath: 'arborist.jpg'
  },
  { 
    id: 'fitness_equipment', 
    name: 'Fitness Equipment', 
    icon: Wrench, 
    description: 'Fitness equipment repair and maintenance',
    imagePath: 'fitness-equipment.jpg'
  },
  { 
    id: 'gutter_cleaning', 
    name: 'Gutter Cleaning', 
    icon: Droplets, 
    description: 'Gutter cleaning and maintenance services',
    imagePath: 'gutter-cleaning.jpg'
  },
  { 
    id: 'handyman', 
    name: 'Handyman', 
    icon: Wrench, 
    description: 'General repairs and maintenance services',
    imagePath: 'handyman.jpg'
  },
  { 
    id: 'landscaping', 
    name: 'Landscaping', 
    icon: TreePine, 
    description: 'Outdoor improvements, gardening, and hardscaping',
    imagePath: 'landscaping.jpg'
  },
  { 
    id: 'maintenance', 
    name: 'Regular Maintenance', 
    icon: Brush, 
    description: 'Scheduled upkeep of property features and systems',
    imagePath: 'maintenance.jpg'
  },
  { 
    id: 'pond_servicing', 
    name: 'Pond Servicing', 
    icon: Droplets, 
    description: 'Pond maintenance and cleaning services',
    imagePath: 'pond.jpg'
  },
  { 
    id: 'pressure_washing', 
    name: 'Power Washing', 
    icon: Droplets, 
    description: 'Pressure washing services for various surfaces',
    imagePath: 'pressure-washing.jpg'
  },
  { 
    id: 'trash', 
    name: 'Trash Services', 
    icon: HelpingHand, 
    description: 'Waste management and disposal services',
    imagePath: 'trash.jpg'
  },
  { 
    id: 'windows', 
    name: 'Window Services', 
    icon: Droplets, 
    description: 'Window cleaning, repair, and installation services',
    imagePath: 'windows.jpg'
  },
];
