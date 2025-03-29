
import { CONSTRUCTION_TYPES } from './categories/construction-types';
import { MAINTENANCE_TYPES } from './categories/maintenance-types';
import { FACILITY_TYPES } from './categories/facility-types';
import { SYSTEM_TYPES } from './categories/system-types';
import { SERVICE_TYPES } from './categories/service-types';
import { MISC_TYPES } from './categories/misc-types';
import { ProjectType } from '../types';

// Combine all project types from different categories
export const PROJECT_TYPES: ProjectType[] = [
  ...CONSTRUCTION_TYPES,
  ...MAINTENANCE_TYPES,
  ...FACILITY_TYPES,
  ...SYSTEM_TYPES,
  ...SERVICE_TYPES,
  ...MISC_TYPES
];
