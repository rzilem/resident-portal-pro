
import { NavigationItem } from './types';
import { getDashboardItem } from './dashboard-item';
import { getCommunitySection } from './community-section';
import { getOperationsSection } from './operations-section';
import { getRecordsSection } from './records-section';
import { getSystemSection } from './system-section';
import { getAccountingSection } from './accounting-section';
import { getResaleSection } from './resale-section';
import { getCommunicationSection } from './communication-section';

// Re-export the types
export * from './types';

export const getNavItems = (currentPath: string): NavigationItem[] => [
  getDashboardItem(currentPath),
  "separator",
  // Community Management Section
  getCommunitySection(currentPath),
  // Accounting Section
  getAccountingSection(currentPath),
  // Communications Section
  getCommunicationSection(currentPath),
  // Operations Section
  getOperationsSection(currentPath),
  // Records & Reports Section
  getRecordsSection(currentPath),
  // Resale Management Section
  getResaleSection(currentPath),
  "separator",
  // System Section
  getSystemSection(currentPath)
];
