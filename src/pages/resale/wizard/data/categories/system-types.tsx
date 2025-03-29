
import { 
  Wind, Zap, Droplets, Lock, Bug, 
  Wrench, Building, Lightbulb
} from 'lucide-react';
import { ProjectType } from '../../types';

export const SYSTEM_TYPES: ProjectType[] = [
  { 
    id: 'access_system', 
    name: 'Access System', 
    icon: Lock, 
    description: 'Security and access control systems'
  },
  { 
    id: 'appliance_repair', 
    name: 'Equipment Repair', 
    icon: Wrench, 
    description: 'Repair services for fitness and other equipment'
  },
  { 
    id: 'electrical', 
    name: 'Electrical', 
    icon: Zap, 
    description: 'Wiring, fixtures, and electrical system work'
  },
  { 
    id: 'elevator_repair', 
    name: 'Elevator Repair / Servicing', 
    icon: Building, 
    description: 'Elevator maintenance and repair services'
  },
  { 
    id: 'fire_hydrant', 
    name: 'Fire Hydrant', 
    icon: Droplets, 
    description: 'Fire hydrant inspection and maintenance'
  },
  { 
    id: 'hvac', 
    name: 'HVAC', 
    icon: Wind, 
    description: 'Heating, ventilation, and air conditioning'
  },
  { 
    id: 'leak_detection', 
    name: 'Leak Detection', 
    icon: Droplets, 
    description: 'Water leak detection and repair services'
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
    id: 'plumbing', 
    name: 'Plumbing', 
    icon: Droplets, 
    description: 'Installation or repair of water and drainage systems'
  },
];
