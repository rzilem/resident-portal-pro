
import { DocumentAccessLevel } from '@/types/documents';
import { 
  BarChartIcon, FileIcon, FileTextIcon, 
  ClipboardIcon, FileSpreadsheetIcon, ShieldIcon,
  UsersIcon, UserIcon, FolderIcon
} from 'lucide-react';

export const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'financials':
    case 'financial':
    case 'monthlyFinancialReports':
      return <BarChartIcon className="h-4 w-4 text-blue-500" />;
    case 'forms':
      return <ClipboardIcon className="h-4 w-4 text-purple-500" />;
    case 'invoiceImages':
      return <FileSpreadsheetIcon className="h-4 w-4 text-green-500" />;
    case 'communityDocuments':
    case 'communityMeetings':
    case 'meetings':
      return <FileTextIcon className="h-4 w-4 text-amber-500" />;
    case 'governing':
      return <ShieldIcon className="h-4 w-4 text-red-500" />;
    case 'legal':
      return <ClipboardIcon className="h-4 w-4 text-red-500" />;
    case 'rules':
      return <ShieldIcon className="h-4 w-4 text-indigo-500" />;
    case 'contracts':
      return <FileTextIcon className="h-4 w-4 text-gray-500" />;
    default:
      return <FolderIcon className="h-4 w-4 text-yellow-400" />;
  }
};

export const getAccessLevelIcon = (accessLevel?: DocumentAccessLevel) => {
  switch(accessLevel) {
    case 'admin':
      return <ShieldIcon className="h-3 w-3" />;
    case 'management':
      return <UserIcon className="h-3 w-3" />;
    case 'board':
      return <UsersIcon className="h-3 w-3" />;
    case 'homeowner':
      return <UsersIcon className="h-3 w-3" />;
    case 'all':
    default:
      return null;
  }
};

export const getAccessLevelLabel = (accessLevel?: DocumentAccessLevel): string => {
  switch(accessLevel) {
    case 'admin':
      return 'Administrators Only';
    case 'management':
      return 'Management Staff';
    case 'board':
      return 'Board Members';
    case 'homeowner':
      return 'Homeowners';
    case 'all':
    default:
      return 'Public';
  }
};

export const getSecurityLevelColor = (accessLevel?: DocumentAccessLevel): string => {
  switch(accessLevel) {
    case 'admin':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400';
    case 'management':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800 dark:text-purple-400';
    case 'board':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-400';
    case 'homeowner':
      return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400';
    case 'all':
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/20 dark:border-gray-700 dark:text-gray-400';
  }
};

export const getFolderIconColor = (accessLevel?: DocumentAccessLevel): string => {
  switch(accessLevel) {
    case 'admin':
      return 'text-red-500';
    case 'management':
      return 'text-purple-500';
    case 'board':
      return 'text-blue-500';
    case 'homeowner':
      return 'text-green-500';
    case 'all':
    default:
      return 'text-yellow-400';
  }
};
