
import { 
  Building, Construction, Hammer, Warehouse, 
  Home, HardHat, Paintbrush
} from 'lucide-react';
import { ProjectType } from '../../types';

export const CONSTRUCTION_TYPES: ProjectType[] = [
  { 
    id: 'concrete', 
    name: 'Concrete', 
    icon: Construction, 
    description: 'Concrete installation and repair services'
  },
  { 
    id: 'construction', 
    name: 'Construction (Big Projects)', 
    icon: Building, 
    description: 'Large-scale construction and renovation projects'
  },
  { 
    id: 'foundation_repair', 
    name: 'Foundation Repair', 
    icon: Building, 
    description: 'Building foundation repair services'
  },
  { 
    id: 'masonry', 
    name: 'Masonry', 
    icon: Construction, 
    description: 'Stonework, brickwork, and concrete services'
  },
  { 
    id: 'painting', 
    name: 'Painting', 
    icon: Paintbrush, 
    description: 'Interior or exterior painting projects'
  },
  { 
    id: 'renovation', 
    name: 'Renovation Project', 
    icon: Home, 
    description: 'Major renovations, remodeling, or structural changes'
  },
  { 
    id: 'repair', 
    name: 'Repair Work', 
    icon: Hammer, 
    description: 'Fixing damaged or non-functioning parts of the property'
  },
  { 
    id: 'stucco', 
    name: 'Stucco', 
    icon: HardHat, 
    description: 'Stucco application, repair, and finishing services'
  },
];
