
import { 
  Building, Fence, Dumbbell, Home, Construction
} from 'lucide-react';
import { ProjectType } from '../../types';

export const FACILITY_TYPES: ProjectType[] = [
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
    id: 'gym_equipment', 
    name: 'Gym Equipment', 
    icon: Dumbbell, 
    description: 'Fitness equipment installation and repair'
  },
  { 
    id: 'privacy_gate', 
    name: 'Privacy Gate', 
    icon: Fence, 
    description: 'Gate installation, repair, and access control'
  },
  { 
    id: 'fencing', 
    name: 'Fencing', 
    icon: Fence, 
    description: 'Fence installation, repair, or replacement services'
  },
  { 
    id: 'roofing', 
    name: 'Roofing', 
    icon: Home, 
    description: 'Roof repair, replacement, or installation'
  },
  { 
    id: 'roof_repair', 
    name: 'Roof Repair / Replacement', 
    icon: Building, 
    description: 'Roof repair, replacement, and maintenance'
  },
  { 
    id: 'street_repairs', 
    name: 'Street Repairs / Paving / Striping', 
    icon: Construction, 
    description: 'Road maintenance, paving, and line striping services'
  },
];
