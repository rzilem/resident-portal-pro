
import React from 'react';
import { DocumentAccessLevel } from '@/types/documents';

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
    <span 
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded border ${getColorClass()}`}
    >
      {accessLevel === 'all' ? 'Public' : accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1)}
    </span>
  );
};
