
import { Tag, TagType } from '@/types/resident';

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

export const PREDEFINED_TAGS = [
  { type: 'board', label: 'Board Member', color: '#0ea5e9' },
  { type: 'board', label: 'President', color: '#0ea5e9' },
  { type: 'board', label: 'Vice President', color: '#0ea5e9' },
  { type: 'board', label: 'Secretary', color: '#0ea5e9' },
  { type: 'board', label: 'Treasurer', color: '#0ea5e9' },
  { type: 'committee', label: 'Architectural Committee', color: '#16a34a' },
  { type: 'committee', label: 'Landscaping Committee', color: '#65a30d' },
  { type: 'committee', label: 'Social Committee', color: '#9333ea' },
  { type: 'committee', label: 'Finance Committee', color: '#0d9488' },
  { type: 'delinquent', label: 'Delinquent', color: '#dc2626' },
  { type: 'delinquent', label: '30+ Days Past Due', color: '#ea580c' },
  { type: 'delinquent', label: '60+ Days Past Due', color: '#e11d48' },
  { type: 'delinquent', label: '90+ Days Past Due', color: '#be123c' },
];

export interface TagFormData {
  type: TagType;
  label: string;
  color: string;
}
