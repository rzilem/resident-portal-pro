
import { CONSTRUCTION_TYPES } from './categories/construction-types';
import { MAINTENANCE_TYPES } from './categories/maintenance-types';
import { FACILITY_TYPES } from './categories/facility-types';
import { SYSTEM_TYPES } from './categories/system-types';
import { SERVICE_TYPES } from './categories/service-types';
import { ProjectType } from '../types';

// Remove MISC_TYPES import and from the spread
export const PROJECT_TYPES: ProjectType[] = [
  ...CONSTRUCTION_TYPES,
  ...MAINTENANCE_TYPES,
  ...FACILITY_TYPES,
  ...SYSTEM_TYPES,
  ...SERVICE_TYPES
];
