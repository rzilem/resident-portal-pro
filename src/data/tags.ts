
import { Tag } from '@/types/resident';
import { v4 as uuidv4 } from 'uuid';

// Sample tags
export const boardMemberTag: Tag = {
  id: uuidv4(),
  type: 'board',
  label: 'Board Member',
  color: '#0ea5e9', // sky-500
  createdAt: '2023-01-01'
};

export const treasurerTag: Tag = {
  id: uuidv4(),
  type: 'board',
  label: 'Treasurer',
  color: '#0d9488', // teal-600
  createdAt: '2023-01-01'
};

export const landscapingCommitteeTag: Tag = {
  id: uuidv4(),
  type: 'committee',
  label: 'Landscaping Committee',
  color: '#65a30d', // lime-600
  createdAt: '2023-01-01'
};

export const delinquentTag: Tag = {
  id: uuidv4(),
  type: 'delinquent',
  label: 'Delinquent',
  color: '#dc2626', // red-600
  createdAt: '2023-01-01'
};

export const newResidentTag: Tag = {
  id: uuidv4(),
  type: 'custom',
  label: 'New Resident',
  color: '#7c3aed', // violet-600
  createdAt: '2023-02-15'
};

export const violationTag: Tag = {
  id: uuidv4(),
  type: 'delinquent',
  label: 'Landscaping Violation',
  color: '#ea580c', // orange-600
  createdAt: '2023-06-15'
};

export const arcPendingTag: Tag = {
  id: uuidv4(),
  type: 'custom',
  label: 'ARC Pending',
  color: '#7c3aed', // violet-600
  createdAt: '2023-06-15'
};
