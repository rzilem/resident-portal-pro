
import { DocumentAccessLevel } from '@/types/documents';

/**
 * Get color for folder icon based on access level
 * @param accessLevel Access level string
 * @returns CSS color string
 */
export const getFolderIconColorByAccessLevel = (accessLevel: string): string => {
  switch (accessLevel) {
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

/**
 * Render an access level badge with appropriate styling
 * @param accessLevel Document access level
 * @returns React component with styled badge
 */
export const renderAccessLevelBadge = (accessLevel: DocumentAccessLevel) => {
  const getColorClass = () => {
    switch (accessLevel) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'management':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'board':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'homeowner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'all':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded border ${getColorClass()}`}>
      {accessLevel === 'all' ? 'Public' : accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1)}
    </span>
  );
};

/**
 * Get display name for access level
 * @param accessLevel Access level string
 * @returns Formatted display name
 */
export const getAccessLevelDisplayName = (accessLevel: DocumentAccessLevel): string => {
  switch (accessLevel) {
    case 'all':
      return 'Everyone (Public)';
    case 'homeowner':
      return 'Homeowners & Above';
    case 'board':
      return 'Board Members & Above';
    case 'management':
      return 'Management & Admin Only';
    case 'admin':
      return 'Administrator Only';
    default:
      return 'Unknown';
  }
};
