
import { Tag, TagType } from '@/types/resident';
import { v4 as uuidv4 } from 'uuid';

// Color options for tags
export const TAG_COLORS = [
  { label: 'Gray', value: '#71717a' }, // zinc-500
  { label: 'Red', value: '#dc2626' },  // red-600
  { label: 'Orange', value: '#ea580c' }, // orange-600
  { label: 'Amber', value: '#d97706' }, // amber-600 
  { label: 'Yellow', value: '#ca8a04' }, // yellow-600
  { label: 'Lime', value: '#65a30d' },  // lime-600
  { label: 'Green', value: '#16a34a' }, // green-600
  { label: 'Teal', value: '#0d9488' },  // teal-600
  { label: 'Sky', value: '#0ea5e9' },   // sky-500
  { label: 'Blue', value: '#2563eb' },  // blue-600
  { label: 'Indigo', value: '#4f46e5' }, // indigo-600
  { label: 'Violet', value: '#7c3aed' }, // violet-600
  { label: 'Purple', value: '#9333ea' }, // purple-600
  { label: 'Fuchsia', value: '#c026d3' }, // fuchsia-600
  { label: 'Pink', value: '#db2777' },   // pink-600
  { label: 'Rose', value: '#e11d48' },   // rose-600
];

export const RESIDENT_TAG_TYPES = {
  'board': 'Board',
  'committee': 'Committee', 
  'delinquent': 'Delinquent',
  'custom': 'Custom'
};

export const ASSOCIATION_TAG_TYPES = {
  'property': 'Property',
  'amenity': 'Amenity',
  'service': 'Service',
  'custom': 'Custom'
};

// Mock data for resident tags
export const RESIDENT_DEFAULT_TAGS: Tag[] = [
  {
    id: uuidv4(),
    type: 'board',
    label: 'Board Member',
    color: '#0ea5e9',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'board',
    label: 'President',
    color: '#0ea5e9',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'board',
    label: 'Treasurer',
    color: '#0ea5e9',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'committee',
    label: 'Architectural Committee',
    color: '#16a34a',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'committee',
    label: 'Landscaping Committee',
    color: '#65a30d',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'delinquent',
    label: 'Delinquent',
    color: '#dc2626',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'delinquent',
    label: '30+ Days Past Due',
    color: '#ea580c',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'custom',
    label: 'New Resident',
    color: '#7c3aed',
    createdAt: '2023-02-15'
  }
];

// Mock data for association tags
export const ASSOCIATION_DEFAULT_TAGS: Tag[] = [
  {
    id: uuidv4(),
    type: 'property' as TagType,
    label: 'On-site',
    color: '#2563eb',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'property' as TagType,
    label: 'Off-site',
    color: '#4f46e5',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'amenity' as TagType,
    label: 'Pool',
    color: '#0ea5e9',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'amenity' as TagType,
    label: 'Gym',
    color: '#16a34a',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'amenity' as TagType,
    label: 'Tennis Court',
    color: '#ca8a04',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'service' as TagType,
    label: 'Gate',
    color: '#9333ea',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'service' as TagType,
    label: 'Pedestrian Gate',
    color: '#7c3aed',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'service' as TagType,
    label: 'Security',
    color: '#dc2626',
    createdAt: '2023-01-01'
  }
];

export interface TagFormData {
  type: TagType | string;
  label: string;
  color?: string;
}
