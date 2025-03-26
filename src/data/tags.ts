
import { Tag } from '@/types/resident';
import { v4 as uuidv4 } from 'uuid';

// Sample tags with consistent IDs to ensure proper rendering
export const boardMemberTag: Tag = {
  id: "board-member-tag",
  type: 'board',
  label: 'Board Member',
  color: '#0ea5e9', // sky-500
  createdAt: '2023-01-01'
};

export const treasurerTag: Tag = {
  id: "treasurer-tag",
  type: 'board',
  label: 'Treasurer',
  color: '#0d9488', // teal-600
  createdAt: '2023-01-01'
};

export const landscapingCommitteeTag: Tag = {
  id: "landscaping-committee-tag",
  type: 'committee',
  label: 'Landscaping Committee',
  color: '#65a30d', // lime-600
  createdAt: '2023-01-01'
};

export const delinquentTag: Tag = {
  id: "delinquent-tag",
  type: 'delinquent',
  label: 'Delinquent',
  color: '#dc2626', // red-600
  createdAt: '2023-01-01'
};

export const newResidentTag: Tag = {
  id: "new-resident-tag",
  type: 'custom',
  label: 'New Resident',
  color: '#7c3aed', // violet-600
  createdAt: '2023-02-15'
};

export const violationTag: Tag = {
  id: "violation-tag",
  type: 'delinquent',
  label: 'Landscaping Violation',
  color: '#ea580c', // orange-600
  createdAt: '2023-06-15'
};

export const arcPendingTag: Tag = {
  id: "arc-pending-tag",
  type: 'custom',
  label: 'ARC Pending',
  color: '#7c3aed', // violet-600
  createdAt: '2023-06-15'
};

// Export all tags in an array for easier access
export const allTags = [
  boardMemberTag,
  treasurerTag,
  landscapingCommitteeTag,
  delinquentTag,
  newResidentTag,
  violationTag,
  arcPendingTag
];

// Utility function to find a tag by id
export const getTagById = (id: string): Tag | undefined => {
  return allTags.find(tag => tag.id === id);
};

// Utility function to find tags by type
export const getTagsByType = (type: string): Tag[] => {
  return allTags.filter(tag => tag.type === type);
};
