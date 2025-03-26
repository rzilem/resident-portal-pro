
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PrintQueueFiltersProps {
  categoryFilter?: string;
  associationFilter?: string;
  associationName?: string;
  onClearCategoryFilter: () => void;
  onClearAssociationFilter: () => void;
}

const PrintQueueFilters: React.FC<PrintQueueFiltersProps> = ({
  categoryFilter,
  associationFilter,
  associationName,
  onClearCategoryFilter,
  onClearAssociationFilter
}) => {
  if (!categoryFilter && !associationFilter) return null;
  
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-md mb-4">
      <span className="text-sm font-medium text-gray-700 mr-2">Filtered by:</span>
      
      {categoryFilter && (
        <Badge variant="outline" className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
          <span>Category: {categoryFilter}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 w-5 p-0 hover:bg-blue-100"
            onClick={onClearCategoryFilter}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove filter</span>
          </Button>
        </Badge>
      )}
      
      {associationFilter && (
        <Badge variant="outline" className="pl-2 pr-1 py-1 flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
          <span>Association: {associationName || associationFilter}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 w-5 p-0 hover:bg-green-100"
            onClick={onClearAssociationFilter}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove filter</span>
          </Button>
        </Badge>
      )}
    </div>
  );
};

export default PrintQueueFilters;
